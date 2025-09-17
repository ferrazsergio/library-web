import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { fetchCategoryById, createCategory, updateCategory } from '../../api/categoriesApi';
import { CategoryDTO } from '../../types/category';

const CategoryFormPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [category, setCategory] = useState<Partial<CategoryDTO>>({
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const data = await fetchCategoryById(Number(id));
                    setCategory(data);
                }
            } catch {
                setError('Erro ao carregar dados da categoria.');
            } finally {
                setLoading(false);
            }
        };
        if (isEdit) load();
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCategory(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEdit && id) {
                await updateCategory(Number(id), category);
            } else {
                await createCategory(category);
            }
            navigate('/categories');
        } catch {
            setError('Erro ao salvar categoria.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Categoria' : 'Cadastrar Categoria'}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nome"
                                name="name"
                                required
                                value={category.name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Descrição"
                                name="description"
                                value={category.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/categories')}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CategoryFormPage;