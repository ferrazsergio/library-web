import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../../api/categoriesApi';
import { CategoryDTO } from '../../types/category';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Grid, Tooltip, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const tableContainerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -25 },
    show: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.06, type: "spring", stiffness: 460, damping: 35 }
    })
};

const CategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
            setError('');
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
            setSuccess('Categoria excluída com sucesso!');
            setTimeout(() => setSuccess(''), 2000);
        } catch {
            setError('Erro ao excluir categoria.');
        }
    };

    let content: React.ReactNode;
    if (loading) {
        content = (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 7 }}>
                <CircularProgress />
            </Box>
        );
    } else if (error) {
        content = (
            <AnimatePresence>
                <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                    <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>
                        {error}
                    </Alert>
                </motion.div>
            </AnimatePresence>
        );
    } else {
        content = (
            <motion.div
                variants={tableContainerVariants}
                initial="hidden"
                animate="show"
            >
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 28px #1976d111',
                        mt: 1
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {categories.map((category, i) => (
                                    <motion.tr
                                        key={category.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="show"
                                        custom={i}
                                        exit="hidden"
                                        style={{ background: i % 2 ? "#f8fafd" : "#fff" }}
                                    >
                                        <TableCell sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {category.name}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {category.description}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Editar categoria"
                                                    onClick={() => navigate(`/categories/${category.id}/edit`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Excluir categoria"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <motion.div
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            >
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Categorias
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <motion.div
                            whileHover={{ scale: 1.04, boxShadow: '0 2px 16px #1976d233' }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                aria-label="Adicionar categoria"
                                onClick={() => navigate('/categories/new')}
                                sx={{ fontWeight: 500, py: 1.1, fontSize: 17 }}
                            >
                                Adicionar Categoria
                            </Button>
                        </motion.div>
                    </Grid>
                </Grid>
                <AnimatePresence>
                    {success && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        >
                            <Alert severity="success" sx={{ mb: 2, fontWeight: 500 }}>
                                {success}
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
                {content}
            </motion.div>
        </Box>
    );
};

export default CategoryListPage;