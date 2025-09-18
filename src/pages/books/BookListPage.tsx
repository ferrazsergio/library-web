import React, { useEffect, useState } from 'react';
import { fetchBooks, deleteBook } from '../../api/booksApi';
import { BookDTO } from '../../types/book';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const BookListPage: React.FC = () => {
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await fetchBooks();
            setBooks(data);
        } catch (err) {
            setError('Erro ao carregar livros.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Deseja realmente excluir este livro?')) return;
        try {
            await deleteBook(id);
            setBooks(prev => prev.filter(book => book.id !== id));
        } catch {
            alert('Erro ao excluir livro.');
        }
    };

    let content: React.ReactNode;
    if (loading) {
        content = <CircularProgress />;
    } else if (error) {
        content = <Typography color="error">{error}</Typography>;
    } else {
        content = (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>ISBN</TableCell>
                            <TableCell>Autores</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Disponíveis</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map(book => (
                            <TableRow key={book.id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                                <TableCell>{book.authors?.map(a => a.name).join(', ')}</TableCell>
                                <TableCell>{book.category?.name}</TableCell>
                                <TableCell>{book.availableQuantity}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => book.id !== undefined && navigate(`/books/${book.id}/edit`)}>
                                        <EditIcon />
                                    </IconButton>
                                    {book.id !== undefined && (
                                        <IconButton size="small" color="error" onClick={() => handleDelete(book.id!)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Livros
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate('/books/new')}>
                Adicionar Livro
            </Button>
            {content}
        </Box>
    );
};

export default BookListPage;