import { useEffect, useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import api from '../api';
import type { ItemDto, ManufacturerDto, CountryDto, ItemTypeDto, CreateItemDto } from '../types';
import {
    Typography, Box, Card, CardContent, CardMedia,
    Grid, CircularProgress, Chip,
    CardActions, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, InputAdornment,
    Collapse, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

export default function ItemsList() {
    const [items, setItems] = useState<ItemDto[]>([]);
    const [loading, setLoading] = useState(true);


    const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemTypeDto[]>([]);


    const [openAddModal, setOpenAddModal] = useState(false);
    const [openInlineCountryModal, setOpenInlineCountryModal] = useState(false);


    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMan, setFilterMan] = useState('');
    const [filterType, setFilterType] = useState('');


    const [newItem, setNewItem] = useState<Partial<CreateItemDto>>({
        model: '', photoUrl: '', price: 0,
        manufacturerId: '', itemTypeId: '', countryId: ''
    });
    const [inlineCountryName, setInlineCountryName] = useState('');

    useEffect(() => {
        loadItems();
        loadDictionaries();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/item');
            setItems(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке позиций:", error);
        } finally {
            setLoading(false);
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

            await api.post('/item', dto);
            setOpenAddModal(false);


            setNewItem({ model: '', photoUrl: '', price: 0, manufacturerId: '', itemTypeId: '', countryId: '' });
            setInlineCountryName('');

            await loadDictionaries();
            await loadItems();
        } catch (error) {
            console.error("Ошибка при создании позиции:", error);
            alert("Не удалось создать позицию. Проверьте заполнение всех полей.");
        }
    };


    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchQuery = item.model.toLowerCase().includes(searchQuery.toLowerCase());

            const matchMan = filterMan ? item.manufacturer === filterMan : true;
            const matchType = filterType ? item.itemType === filterType : true;
            return matchQuery && matchMan && matchType;
        });
    }, [items, searchQuery, filterMan, filterType]);

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
                <Typography variant="h4" component="h1" sx={{ color: 'primary.dark' }}>
                    Список Позиций
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" color="primary" startIcon={<FilterListIcon />} onClick={() => setShowFilters(!showFilters)}>
                        Фильтры {(!showFilters && (searchQuery || filterMan || filterType)) && ' (Активны)'}
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
                        Добавить
                    </Button>
                </Box>
            </Box>


            <Collapse in={showFilters}>
                <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#f1f5f9', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                        <TextField
                            fullWidth size="small" label="Поиск по названию..."
                            variant="outlined" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                            sx={{ flex: 1.5 }}
                        />
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <InputLabel>Производитель</InputLabel>
                            <Select value={filterMan} label="Производитель" onChange={e => setFilterMan(e.target.value)}>
                                <MenuItem value=""><em>Все</em></MenuItem>
                                {manufacturers.map(m => <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <InputLabel>Тип позиции</InputLabel>
                            <Select value={filterType} label="Тип позиции" onChange={e => setFilterType(e.target.value)}>
                                <MenuItem value=""><em>Все</em></MenuItem>
                                {itemTypes.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button variant="text" color="secondary" sx={{ flex: 0.5, minWidth: '100px' }} onClick={() => {
                            setSearchQuery(''); setFilterMan(''); setFilterType('');
                        }}>Сбросить</Button>
                    </Box>
                </Paper>
            </Collapse>

            {filteredItems.length === 0 ? (
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
                    Ничего не найдено!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredItems.map(item => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.photoUrl || 'https://via.placeholder.com/300x200?text=Нет+фото'}
                                    alt={item.model}
                                    sx={{ objectFit: 'contain', p: 2, bgcolor: '#f8fafc' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {item.model}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        <Chip size="small" label={item.manufacturer} color="primary" variant="outlined" />
                                        <Chip size="small" label={item.itemType} color="secondary" variant="outlined" />
                                        <Chip size="small" label={item.country} variant="outlined" />
                                    </Box>

                                    <Typography variant="h6" color="primary.main">
                                        {item.price.toLocaleString('ru-RU')} ₽
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Button size="small" startIcon={<EditIcon />} onClick={() => alert("Редактирование пока в разработке!")}>
                                        Изменить
                                    </Button>
                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.id)}>
                                        Удалить
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}


            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Добавление новой позиции</DialogTitle>
                <form onSubmit={handleCreateItem}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        <TextField required label="Модель (Название)" fullWidth value={newItem.model}
                            onChange={e => setNewItem({ ...newItem, model: e.target.value })} />

                        <TextField label="Ссылка на фото (URL)" fullWidth value={newItem.photoUrl}
                            onChange={e => setNewItem({ ...newItem, photoUrl: e.target.value })} />

                        <TextField required label="Цена" type="number" fullWidth value={newItem.price}
                            onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })}
                            InputProps={{ startAdornment: <InputAdornment position="start">₽</InputAdornment> }} />


                        <FormControl required fullWidth>
                            <InputLabel>Производитель</InputLabel>
                            <Select value={newItem.manufacturerId} label="Производитель"
                                onChange={e => setNewItem({ ...newItem, manufacturerId: e.target.value })}>
                                {manufacturers.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl required fullWidth>
                            <InputLabel>Тип позиции</InputLabel>
                            <Select value={newItem.itemTypeId} label="Тип позиции"
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
                        <Button type="submit" variant="contained" color="primary">Сохранить товар</Button>
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

