import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, MenuItem, Grid } from '@mui/material';
import { fetchBookById, createBook, updateBook } from '../../api/booksApi';
import { BookDTO, AuthorDTO, CategoryDTO } from '../../types/book';
import api from '../../api/api';

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
            .then(res => {
                console.log('Autores recebidos:', res.data.content || res.data); // Debug
                setAuthors(res.data.content || res.data);
            })
            .catch(() => setError('Erro ao carregar autores.'));

        // Buscar categorias reais da API
        api.get('/categories', { params: { size: 100 } })
            .then(res => {
                console.log('Categorias recebidas:', res.data.content || res.data); // Debug
                setCategories(res.data.content || res.data);
            })
            .catch(() => setError('Erro ao carregar categorias.'));

        // Carregar livro se for edição
        const load = async () => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const data = await fetchBookById(Number(id));
                    console.log('Livro carregado:', data); // Debug
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

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Livro' : 'Cadastrar Livro'}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Título"
                                name="title"
                                required
                                value={book.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="ISBN"
                                name="isbn"
                                value={book.isbn}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        {/* Select para autores (múltiplo) */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                label="Autor(es)"
                                name="authorIds"
                                value={book.authorIds}
                                onChange={handleAuthorChange}
                                fullWidth
                                SelectProps={{ multiple: true }}
                            >
                                {authors.map(a => (
                                    <MenuItem value={a.id} key={a.id}>
                                        {a.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {/* Select para categoria */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                label="Categoria"
                                name="categoryId"
                                value={book.categoryId || ''}
                                onChange={handleChange}
                                fullWidth
                            >
                                {categories.map(c => (
                                    <MenuItem value={c.id} key={c.id}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Quantidade Total"
                                name="totalQuantity"
                                type="number"
                                required
                                value={book.totalQuantity}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Disponíveis"
                                name="availableQuantity"
                                type="number"
                                required
                                value={book.availableQuantity}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ min: 0, max: book.totalQuantity }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/books')}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default BookFormPage;