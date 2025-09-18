import React, { useEffect, useState } from 'react';
import { fetchBooks, deleteBook } from '../../api/booksApi';
import { BookDTO } from '../../types/book';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Tooltip, Alert } from '@mui/material';
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

const BookListPage: React.FC = () => {
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await fetchBooks();
            setBooks(data);
            setError('');
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
            setSuccess('Livro excluído com sucesso!');
            setTimeout(() => setSuccess(''), 2000);
        } catch {
            setError('Erro ao excluir livro.');
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
                                <TableCell>Título</TableCell>
                                <TableCell>ISBN</TableCell>
                                <TableCell>Autores</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Disponíveis</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {books.map((book, i) => (
                                    <motion.tr
                                        key={book.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="show"
                                        custom={i}
                                        exit="hidden"
                                        style={{ background: i % 2 ? "#f8fafd" : "#fff" }}
                                    >
                                        <TableCell sx={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {book.title}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {book.isbn}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {book.authors?.map(a => a.name).join(', ')}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {book.category?.name}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 70 }}>{book.availableQuantity}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Editar livro"
                                                    onClick={() => book.id !== undefined && navigate(`/books/${book.id}/edit`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {book.id !== undefined && (
                                                <Tooltip title="Excluir">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        aria-label="Excluir livro"
                                                        onClick={() => handleDelete(book.id!)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
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
                    Livros
                </Typography>
                <motion.div
                    whileHover={{ scale: 1.04, boxShadow: '0 2px 16px #1976d233' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: 'inline-block', marginBottom: 16 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="Adicionar livro"
                        onClick={() => navigate('/books/new')}
                        sx={{ fontWeight: 500, py: 1.1, fontSize: 17 }}
                    >
                        Adicionar Livro
                    </Button>
                </motion.div>
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

export default BookListPage;