import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import api from '../api';
import type { ManufacturerDto, CountryDto, ItemTypeDto } from '../types';
import {
    Typography, Box, Card, CardContent, CardHeader,
    TextField, Button, List, ListItem, ListItemText,
    Divider, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export default function Dictionaries() {
    const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemTypeDto[]>([]);

    const [newCountryName, setNewCountryName] = useState('');
    const [newManName, setNewManName] = useState('');
    const [newManDesc, setNewManDesc] = useState('');
    const [editMan, setEditMan] = useState<ManufacturerDto | null>(null);

    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeDesc, setNewTypeDesc] = useState('');
    const [editType, setEditType] = useState<ItemTypeDto | null>(null);

    const loadData = async () => {
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

    const formatDate = (dateString?: string | null) => {
        if (!dateString || dateString.startsWith('0001-01-01')) return 'Нет данных';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return 'Нет данных';
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadData();
        };
        fetchData();
    }, []);

    const handleAddCountry = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCountryName) return;
        await api.post('/country', { name: newCountryName });
        setNewCountryName('');
        await loadData();
    };

    const handleDeleteCountry = async (id: string) => {
        try {
            await api.delete(`/country/${id}`);
            await loadData();
        } catch (error) {
            console.error("Ошибка при удалении страны:", error);
        }
    };

    const handleAddManufacturer = async (e: FormEvent) => {
        e.preventDefault();
        if (!newManName) return;
        await api.post('/manufacturer', { name: newManName, description: newManDesc });
        setNewManName('');
        setNewManDesc('');
        await loadData();
    };

    const handleUpdateManufacturer = async () => {
        if (!editMan) return;
        try {
            await api.put(`/manufacturer/${editMan.id}`, editMan);
            setEditMan(null);
            await loadData();
        } catch (error) {
            console.error("Ошибка при обновлении производителя:", error);
        }
    };

    const handleDeleteManufacturer = async (id: string) => {
        try {
            await api.delete(`/manufacturer/${id}`);
            await loadData();
        } catch (error) {
            console.error("Ошибка при удалении производителя:", error);
        }
    };

    const handleAddItemType = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTypeName) return;
        await api.post('/itemtype', { name: newTypeName, description: newTypeDesc });
        setNewTypeName('');
        setNewTypeDesc('');
        await loadData();
    };

    const handleUpdateItemType = async () => {
        if (!editType) return;
        try {
            await api.put(`/itemtype/${editType.id}`, editType);
            setEditType(null);
            await loadData();
        } catch (error) {
            console.error("Ошибка при обновлении типа техники:", error);
        }
    };

    const handleDeleteItemType = async (id: string) => {
        try {
            await api.delete(`/itemtype/${id}`);
            await loadData();
        } catch (error) {
            console.error("Ошибка при удалении типа техники:", error);
        }
    };

    return (
        <Box sx={{ pb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 800 }}>
                Управление Справочниками
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Здесь вы можете управлять вспомогательными данными: производителями, странами и типами позиций.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>


                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader
                            title="Производители"
                            titleTypographyProps={{ variant: 'h6', color: 'text.primary', fontWeight: 700 }}
                            sx={{ bgcolor: '#F4F7FE', pb: 2, pt: 2 }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box component="form" onSubmit={handleAddManufacturer}
                                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    size="small" label="Название" variant="outlined" required fullWidth
                                    value={newManName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewManName(e.target.value)}
                                />
                                <TextField
                                    size="small" label="Описание" variant="outlined" fullWidth
                                    value={newManDesc}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewManDesc(e.target.value)}
                                />
                                <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}
                                    disableElevation>
                                    Добавить
                                </Button>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <List sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                p: 0,
                                overflow: 'auto',
                                maxHeight: 300
                            }}>
                                {manufacturers.length === 0 &&
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Нет
                                        данных</Typography>}
                                {manufacturers.map(m => (
                                    <ListItem key={m.id} disablePadding sx={{ py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                        {editMan?.id === m.id ? (
                                            <Box sx={{ width: '100%', pr: 2 }}>
                                                <TextField size="small" fullWidth value={editMan.name} onChange={e => setEditMan({ ...editMan, name: e.target.value })} sx={{ mb: 1 }} />
                                                <TextField size="small" fullWidth value={editMan.description} onChange={e => setEditMan({ ...editMan, description: e.target.value })} />
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                                    <IconButton size="small" color="primary" onClick={handleUpdateManufacturer}><SaveIcon fontSize="small" /></IconButton>
                                                    <IconButton size="small" color="error" onClick={() => setEditMan(null)}><CloseIcon fontSize="small" /></IconButton>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            {m.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 0.5 }}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                {m.description || 'Нет описания'}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Создано: {formatDate(m.createdAt)}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Изменено: {formatDate(m.updatedAt)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    disableTypography
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <IconButton size="small" color="primary" onClick={() => setEditMan(m)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteManufacturer(m.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>


                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader
                            title="Страны"
                            titleTypographyProps={{ variant: 'h6', color: 'text.primary', fontWeight: 700 }}
                            sx={{ bgcolor: '#F4F7FE', pb: 2, pt: 2 }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box component="form" onSubmit={handleAddCountry}
                                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    size="small" label="Название страны" variant="outlined" required fullWidth
                                    value={newCountryName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCountryName(e.target.value)}
                                />
                                <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}
                                    disableElevation>
                                    Добавить
                                </Button>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <List sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                p: 0,
                                overflow: 'auto',
                                maxHeight: 300
                            }}>
                                {countries.length === 0 &&
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Нет
                                        данных</Typography>}
                                {countries.map(c => (
                                    <ListItem key={c.id} disablePadding sx={{ py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                        <ListItemText primary={c.name} primaryTypographyProps={{ fontWeight: 500 }} />
                                        <IconButton size="small" color="error" onClick={() => handleDeleteCountry(c.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>


                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader
                            title="Типы техники"
                            titleTypographyProps={{ variant: 'h6', color: 'text.primary', fontWeight: 700 }}
                            sx={{ bgcolor: '#F4F7FE', pb: 2, pt: 2 }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box component="form" onSubmit={handleAddItemType}
                                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    size="small" label="Название типа" variant="outlined" required fullWidth
                                    value={newTypeName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTypeName(e.target.value)}
                                />
                                <TextField
                                    size="small" label="Описание" variant="outlined" fullWidth
                                    value={newTypeDesc}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTypeDesc(e.target.value)}
                                />
                                <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}
                                    disableElevation>
                                    Добавить
                                </Button>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <List sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                p: 0,
                                overflow: 'auto',
                                maxHeight: 300
                            }}>
                                {itemTypes.length === 0 &&
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Нет
                                        данных</Typography>}
                                {itemTypes.map(t => (
                                    <ListItem key={t.id} disablePadding sx={{ py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                        {editType?.id === t.id ? (
                                            <Box sx={{ width: '100%', pr: 2 }}>
                                                <TextField size="small" fullWidth value={editType.name} onChange={e => setEditType({ ...editType, name: e.target.value })} sx={{ mb: 1 }} />
                                                <TextField size="small" fullWidth value={editType.description} onChange={e => setEditType({ ...editType, description: e.target.value })} />
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                                    <IconButton size="small" color="primary" onClick={handleUpdateItemType}><SaveIcon fontSize="small" /></IconButton>
                                                    <IconButton size="small" color="error" onClick={() => setEditType(null)}><CloseIcon fontSize="small" /></IconButton>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            {t.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 0.5 }}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                {t.description || 'Нет описания'}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Создано: {formatDate(t.createdAt)}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Изменено: {formatDate(t.updatedAt)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    disableTypography
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <IconButton size="small" color="primary" onClick={() => setEditType(t)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteItemType(t.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>

            </Box>
        </Box>
    );
}
