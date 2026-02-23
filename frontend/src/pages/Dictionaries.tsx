import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import api from '../api';
import type { ManufacturerDto, CountryDto, ItemTypeDto } from '../types';
import {
    Typography, Box, Card, CardContent, CardHeader,
    TextField, Button, List, ListItem, ListItemText,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Dictionaries() {
    const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemTypeDto[]>([]);

    const [newCountryName, setNewCountryName] = useState('');
    const [newManName, setNewManName] = useState('');
    const [newManDesc, setNewManDesc] = useState('');
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeDesc, setNewTypeDesc] = useState('');

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

    const handleAddManufacturer = async (e: FormEvent) => {
        e.preventDefault();
        if (!newManName) return;
        await api.post('/manufacturer', { name: newManName, description: newManDesc });
        setNewManName('');
        setNewManDesc('');
        await loadData();
    };

    const handleAddItemType = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTypeName) return;
        await api.post('/itemtype', { name: newTypeName, description: newTypeDesc });
        setNewTypeName('');
        setNewTypeDesc('');
        await loadData();
    };

    return (
        <Box sx={{ pb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.dark' }}>
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
                            titleTypographyProps={{ variant: 'h6', color: 'primary.dark' }}
                            sx={{ bgcolor: 'rgba(142, 172, 187, 0.1)', pb: 2 }}
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
                                    <ListItem key={m.id} disablePadding sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={m.name}
                                            secondary={m.description}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
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
                            titleTypographyProps={{ variant: 'h6', color: 'primary.dark' }}
                            sx={{ bgcolor: 'rgba(142, 172, 187, 0.1)', pb: 2 }}
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
                                    <ListItem key={c.id} disablePadding sx={{ py: 0.5 }}>
                                        <ListItemText primary={c.name} primaryTypographyProps={{ fontWeight: 500 }} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>


                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader
                            title="Типы позиций"
                            titleTypographyProps={{ variant: 'h6', color: 'primary.dark' }}
                            sx={{ bgcolor: 'rgba(142, 172, 187, 0.1)', pb: 2 }}
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
                                    <ListItem key={t.id} disablePadding sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={t.name}
                                            secondary={t.description}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
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
