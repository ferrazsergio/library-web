import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, MenuItem, Grid, Alert } from '@mui/material';
import { fetchBookById, createBook, updateBook } from '../../api/booksApi';
import { BookDTO, AuthorDTO, CategoryDTO } from '../../types/book';
import api from '../../api/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 410, damping: 34 } }
};

const BookFormPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [book, setBook] = useState<Partial<BookDTO>>({
        title: '',
        isbn: '',
        authorIds: [],
        categoryId: 0,
        availableQuantity: 1,
        totalQuantity: 1,
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);

    useEffect(() => {
        // Buscar autores reais da API
        api.get('/authors', { params: { size: 100 } })
            .then(res => setAuthors(res.data.content || res.data))
            .catch(() => setError('Erro ao carregar autores.'));

        // Buscar categorias reais da API
        api.get('/categories', { params: { size: 100 } })
            .then(res => setCategories(res.data.content || res.data))
            .catch(() => setError('Erro ao carregar categorias.'));

        // Carregar livro se for edição
        const load = async () => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const data = await fetchBookById(Number(id));
                    setBook({
                        ...data,
                        authorIds: data.authors?.map(a => a.id) || [],
                        categoryId: data.category?.id || 0,
                    });
                }
            } catch {
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBook(prev => ({
            ...prev,
            [name]: name === 'categoryId' ? Number(value) : value,
        }));
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBook((prev) => ({
            ...prev,
            authorIds: Array.isArray(value) ? value.map(Number) : [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEdit && id) {
                await updateBook(Number(id), book);
            } else {
                await createBook(book);
            }
            navigate('/books');
        } catch {
            setError('Erro ao salvar livro.');
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
                                {isEdit ? 'Editar Livro' : 'Cadastrar Livro'}
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
                                        label="Título"
                                        name="title"
                                        required
                                        value={book.title}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="Digite o título do livro"
                                        autoComplete="off"
                                        inputProps={{ "aria-label": "Título do livro" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="ISBN"
                                        name="isbn"
                                        value={book.isbn}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="ISBN do livro"
                                        autoComplete="off"
                                        inputProps={{ "aria-label": "ISBN do livro" }}
                                    />
                                </motion.div>
                            </Grid>
                            {/* Select para autores (múltiplo) */}
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        select
                                        label="Autor(es)"
                                        name="authorIds"
                                        value={book.authorIds}
                                        onChange={handleAuthorChange}
                                        fullWidth
                                        SelectProps={{ multiple: true, renderValue: (selected) =>
                                                Array.isArray(selected)
                                                    ? selected.map(id => authors.find(a => a.id === id)?.name).join(', ')
                                                    : ''
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ "aria-label": "Autores do livro" }}
                                    >
                                        {authors.map(a => (
                                            <MenuItem value={a.id} key={a.id}>
                                                {a.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </motion.div>
                            </Grid>
                            {/* Select para categoria */}
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        select
                                        label="Categoria"
                                        name="categoryId"
                                        value={book.categoryId || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ "aria-label": "Categoria do livro" }}
                                    >
                                        {categories.map(c => (
                                            <MenuItem value={c.id} key={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Quantidade Total"
                                        name="totalQuantity"
                                        type="number"
                                        required
                                        value={book.totalQuantity}
                                        onChange={handleChange}
                                        fullWidth
                                        inputProps={{ min: 1, "aria-label": "Quantidade total" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Disponíveis"
                                        name="availableQuantity"
                                        type="number"
                                        required
                                        value={book.availableQuantity}
                                        onChange={handleChange}
                                        fullWidth
                                        inputProps={{
                                            min: 0,
                                            max: book.totalQuantity,
                                            "aria-label": "Quantidade disponível"
                                        }}
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
                                        aria-label="Salvar livro"
                                        sx={{ fontWeight: 500, px: 3, py: 1.1, fontSize: 16 }}
                                    >
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate('/books')}
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

export default BookFormPage;