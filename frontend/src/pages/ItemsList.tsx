import { useEffect, useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import api from '../api';
import type { ItemDto, ManufacturerDto, CountryDto, ItemTypeDto, CreateItemDto } from '../types';
import {
    Typography, Box, CircularProgress, Chip, Alert,
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, InputAdornment,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as signalR from '@microsoft/signalr';
import SearchIcon from '@mui/icons-material/Search';
import { IMaskInput } from 'react-imask';
import { forwardRef } from 'react';

const PriceMaskCustom = forwardRef<HTMLInputElement, any>(
    function PriceMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={Number}
                scale={0}
                thousandsSeparator=" "
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

export default function ItemsList() {
    const [items, setItems] = useState<ItemDto[]>([]);
    const [loading, setLoading] = useState(true);


    const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemTypeDto[]>([]);


    const [openAddModal, setOpenAddModal] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [openInlineCountryModal, setOpenInlineCountryModal] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);



    const [searchQuery, setSearchQuery] = useState('');
    const [filterMan, setFilterMan] = useState('');
    const [filterType, setFilterType] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');


    const [newItem, setNewItem] = useState<Partial<CreateItemDto>>({
        model: '', photoUrl: '', price: 0,
        manufacturerId: '', itemTypeId: '', countryId: ''
    });
    const [inlineCountryName, setInlineCountryName] = useState('');

    const formatDate = (dateString?: string | null) => {
        if (!dateString || dateString.startsWith('0001-01-01')) return 'Нет данных';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return 'Нет данных';
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    useEffect(() => {
        loadItems();
        loadDictionaries();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/hubs/store")
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (message) => {
            console.log("SignalR Message:", message);
            loadItems(true);
        });

        connection.start()
            .then(() => console.log("Успешно подключено к SignalR хабу"))
            .catch(err => console.error("Ошибка подключения к SignalR:", err));

        return () => {
            connection.stop();
        };
    }, []);

    const loadItems = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const response = await api.get('/item');
            setItems(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке позиций:", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const loadDictionaries = async () => {
        try {
            const [manRes, countRes, typesRes] = await Promise.all([
                api.get('/manufacturer'),
                api.get('/country'),
                api.get('/itemtype')
            ]);
            setManufacturers(manRes.data);
            setCountries(countRes.data);
            setItemTypes(typesRes.data);
        } catch (error) {
            console.error("Ошибка при загрузке справочников:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/item/${id}`);
            await loadItems();
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const handleOpenEdit = (item: ItemDto) => {
        const manId = manufacturers.find(m => m.name === item.manufacturer)?.id || '';
        const typeId = itemTypes.find(t => t.name === item.itemType)?.id || '';
        const countryId = countries.find(c => c.name === item.country)?.id || '';

        setEditingItemId(item.id);
        setSubmitError(null);
        setNewItem({
            model: item.model,
            photoUrl: item.photoUrl,
            price: item.price,
            manufacturerId: manId,
            itemTypeId: typeId,
            countryId: countryId
        });
        setInlineCountryName('');
        setOpenAddModal(true);
    };

    const handleCreateItem = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const dto: CreateItemDto = {
                model: newItem.model!,
                photoUrl: newItem.photoUrl || '',
                price: Number(newItem.price),
                manufacturerId: newItem.manufacturerId!,
                itemTypeId: newItem.itemTypeId!,
                countryId: inlineCountryName ? null : newItem.countryId,
                newCountryName: inlineCountryName ? inlineCountryName : null
            };

            if (editingItemId) {
                await api.put(`/item/${editingItemId}`, dto);
            } else {
                await api.post('/item', dto);
            }

            setOpenAddModal(false);
            setEditingItemId(null);

            setNewItem({ model: '', photoUrl: '', price: 0, manufacturerId: '', itemTypeId: '', countryId: '' });
            setInlineCountryName('');

            await loadDictionaries();
            await loadItems();
        } catch (error) {
            console.error("Ошибка при сохранении позиции:", error);
            setSubmitError("Ошибка сохранения. Убедитесь, что все поля заполнены корректно и сервер доступен.");
        }
    };


    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const query = searchQuery.toLowerCase();
            const matchQuery = item.model.toLowerCase().includes(query) ||
                item.manufacturer.toLowerCase().includes(query) ||
                item.itemType.toLowerCase().includes(query);

            const matchMan = filterMan ? item.manufacturer === filterMan : true;
            const matchType = filterType ? item.itemType === filterType : true;

            const matchPriceFrom = priceFrom ? item.price >= Number(priceFrom) : true;
            const matchPriceTo = priceTo ? item.price <= Number(priceTo) : true;

            return matchQuery && matchMan && matchType && matchPriceFrom && matchPriceTo;
        });
    }, [items, searchQuery, filterMan, filterType, priceFrom, priceTo]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ color: 'text.primary', fontWeight: 800 }}>
                    Список техники
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => {
                    setEditingItemId(null);
                    setSubmitError(null);
                    setNewItem({ model: '', photoUrl: '', price: 0, manufacturerId: '', itemTypeId: '', countryId: '' });
                    setInlineCountryName('');
                    setOpenAddModal(true);
                }} sx={{ borderRadius: 2 }}>
                    Добавить технику
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#ffffff', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                    <TextField
                        fullWidth size="small" placeholder="Поиск по модели, типу или бренду..."
                        variant="outlined" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" fontSize="small" /></InputAdornment> }}
                        sx={{ flex: 2 }}
                    />
                    <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                        <Select displayEmpty value={filterMan} onChange={e => setFilterMan(e.target.value)} sx={{ color: filterMan ? 'text.primary' : 'text.secondary' }}>
                            <MenuItem value="">Все производители</MenuItem>
                            {manufacturers.filter(m => {
                                if (!filterType) return true;
                                return items.some(item => item.itemType === filterType && item.manufacturer === m.name);
                            }).map(m => <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                        <Select displayEmpty value={filterType} onChange={e => setFilterType(e.target.value)} sx={{ color: filterType ? 'text.primary' : 'text.secondary' }}>
                            <MenuItem value="">Все типы техники</MenuItem>
                            {itemTypes.filter(t => {
                                if (!filterMan) return true;
                                return items.some(item => item.manufacturer === filterMan && item.itemType === t.name);
                            }).map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Цена:
                    </Typography>
                    <TextField size="small" placeholder="От" type="number" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} sx={{ width: 120 }} />
                    <Typography color="text.secondary">—</Typography>
                    <TextField size="small" placeholder="До" type="number" value={priceTo} onChange={e => setPriceTo(e.target.value)} sx={{ width: 120 }} />

                    {(searchQuery || filterMan || filterType || priceFrom || priceTo) && (
                        <Button variant="text" color="secondary" sx={{ ml: 'auto' }} onClick={() => {
                            setSearchQuery(''); setFilterMan(''); setFilterType(''); setPriceFrom(''); setPriceTo('');
                        }}>Сбросить фильтры</Button>
                    )}
                </Box>
            </Paper>

            {filteredItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#ffffff', borderRadius: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Ничего не найдено
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Попробуйте изменить параметры фильтрации
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ bgcolor: '#F4F7FE' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>ТЕХНИКА</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>ТИП</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>ПРОИЗВОДИТЕЛЬ</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>СТРАНА</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>ЦЕНА</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>СОЗДАНО / ОБНОВЛЕНО</TableCell>
                                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>ДЕЙСТВИЯ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map(item => (
                                <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                component="img"
                                                src={item.photoUrl || 'https://via.placeholder.com/60?text=Нет'}
                                                sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover', bgcolor: '#f1f5f9' }}
                                            />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                    {item.model}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    ID: {item.id.substring(0, 10)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={item.itemType} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600, borderRadius: 1.5 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            {item.manufacturer}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            🌐 {item.country}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                            {item.price.toLocaleString('ru-RU')} ₽
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                            Создано: {formatDate(item.createdAt)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                            Изменено: {formatDate(item.updatedAt) === 'Нет данных' ? 'никогда' : formatDate(item.updatedAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenEdit(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}


            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {editingItemId ? 'Редактирование техники' : 'Добавление новой техники'}
                </DialogTitle>
                <form onSubmit={handleCreateItem}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {submitError && <Alert severity="error">{submitError}</Alert>}

                        <TextField required label="Модель (Название)" fullWidth value={newItem.model}
                            onChange={e => setNewItem({ ...newItem, model: e.target.value })} />

                        <TextField label="Ссылка на фото (URL)" fullWidth value={newItem.photoUrl}
                            onChange={e => setNewItem({ ...newItem, photoUrl: e.target.value })} />

                        <TextField required label="Цена" fullWidth value={newItem.price || ''}
                            onChange={e => setNewItem({ ...newItem, price: Number(e.target.value.replace(/\s/g, '')) })}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                                inputComponent: PriceMaskCustom as any
                            }} />


                        <FormControl required fullWidth>
                            <InputLabel>Производитель</InputLabel>
                            <Select value={newItem.manufacturerId} label="Производитель"
                                onChange={e => setNewItem({ ...newItem, manufacturerId: e.target.value })}>
                                {manufacturers.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl required fullWidth>
                            <InputLabel>Тип техники</InputLabel>
                            <Select value={newItem.itemTypeId} label="Тип техники"
                                onChange={e => setNewItem({ ...newItem, itemTypeId: e.target.value })}>
                                {itemTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                            </Select>
                        </FormControl>


                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <FormControl fullWidth disabled={!!inlineCountryName} required={!inlineCountryName}>
                                <InputLabel>Страна (где произведено)</InputLabel>
                                <Select value={newItem.countryId} label="Страна (где произведено)"
                                    onChange={e => setNewItem({ ...newItem, countryId: e.target.value })}>
                                    {countries.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <span style={{ color: 'grey', margin: '0 8px' }}>или</span>
                            <Button variant="outlined" sx={{ whiteSpace: 'nowrap' }}
                                onClick={() => setOpenInlineCountryModal(true)}
                                color={inlineCountryName ? "success" : "primary"}>
                                {inlineCountryName ? `Создадим: ${inlineCountryName}` : "Создать новую"}
                            </Button>
                        </Box>

                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={() => setOpenAddModal(false)} color="inherit">Отмена</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingItemId ? 'Сохранить изменения' : 'Сохранить технику'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>


            <Dialog open={openInlineCountryModal} onClose={() => setOpenInlineCountryModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Быстрое создание страны</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Впишите название страны. Она автоматически создастся в базе вместе с текущим товаром!
                    </Typography>
                    <TextField autoFocus fullWidth label="Новая страна"
                        value={inlineCountryName} onChange={e => setInlineCountryName(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setInlineCountryName(''); setOpenInlineCountryModal(false); }}>Сбросить</Button>
                    <Button onClick={() => setOpenInlineCountryModal(false)} variant="contained"
                        disabled={!inlineCountryName}>Применить для товара</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

