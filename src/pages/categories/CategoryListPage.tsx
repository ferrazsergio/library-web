import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../../api/categoriesApi';
import { CategoryDTO } from '../../types/category';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const CategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError('Erro ao carregar categorias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Deseja realmente excluir esta categoria?')) return;
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(category => category.id !== id));
        } catch {
            alert('Erro ao excluir categoria.');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Categorias
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/categories/new')}>
                        Adicionar Categoria
                    </Button>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="primary" onClick={() => navigate(`/categories/${category.id}/edit`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default CategoryListPage;