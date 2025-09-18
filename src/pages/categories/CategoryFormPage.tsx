import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Grid, Alert } from '@mui/material';
import { fetchCategoryById, createCategory, updateCategory } from '../../api/categoriesApi';
import { CategoryDTO } from '../../types/category';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 410, damping: 33 } }
};

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 2, sm: 5 } }}>
            <motion.div
                initial={{ opacity: 0, y: 44, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Paper
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        boxShadow: '0 8px 28px #1976d211',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        onSubmit={handleSubmit}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h5" gutterBottom fontWeight={600}>
                                {isEdit ? 'Editar Categoria' : 'Cadastrar Categoria'}
                            </Typography>
                        </motion.div>
                        <AnimatePresence>
                            {error && (
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
                            )}
                        </AnimatePresence>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Nome"
                                        name="name"
                                        required
                                        value={category.name}
                                        onChange={handleChange}
                                        fullWidth
                                        autoComplete="off"
                                        placeholder="Nome da categoria"
                                        inputProps={{ "aria-label": "Nome da categoria" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Descrição"
                                        name="description"
                                        value={category.description}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        autoComplete="off"
                                        placeholder="Descrição da categoria"
                                        inputProps={{ "aria-label": "Descrição da categoria" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <motion.div
                                    variants={itemVariants}
                                    style={{ display: "flex", gap: 12 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={saving}
                                        aria-label="Salvar categoria"
                                        sx={{ fontWeight: 500, px: 3, py: 1.1, fontSize: 16 }}
                                    >
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate('/categories')}
                                        aria-label="Cancelar"
                                        sx={{ fontWeight: 500, px: 3, py: 1.1, fontSize: 16 }}
                                    >
                                        Cancelar
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.form>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default CategoryFormPage;