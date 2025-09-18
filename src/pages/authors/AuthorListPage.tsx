import React, { useEffect, useState } from 'react';
import { fetchAuthors, deleteAuthor } from '../../api/authorsApi';
import { AuthorDTO } from '../../types/author';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
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

const AuthorListPage: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const loadAuthors = async () => {
        try {
            setLoading(true);
            const data = await fetchAuthors();
            setAuthors(data);
            setError('');
        } catch {
            setError('Erro ao carregar autores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Deseja realmente excluir este autor?')) return;
        try {
            await deleteAuthor(id);
            setAuthors(prev => prev.filter(author => author.id !== id));
            setSuccess('Autor excluído com sucesso!');
            setTimeout(() => setSuccess(''), 2000);
        } catch {
            setError('Erro ao excluir autor.');
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
                                <TableCell>Biografia</TableCell>
                                <TableCell>Data de Nascimento</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {authors.map((author, i) => (
                                    <motion.tr
                                        key={author.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="show"
                                        custom={i}
                                        exit="hidden"
                                        style={{ background: i % 2 ? "#f8fafd" : "#fff" }}
                                    >
                                        <TableCell sx={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {author.name}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {author.biography}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {author.birthDate || ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Editar autor"
                                                    onClick={() => navigate(`/authors/${author.id}/edit`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Excluir autor"
                                                    onClick={() => handleDelete(author.id)}
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
                    Autores
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
                                aria-label="Adicionar autor"
                                onClick={() => navigate('/authors/new')}
                                sx={{ fontWeight: 500, py: 1.1, fontSize: 17 }}
                            >
                                Adicionar Autor
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

export default AuthorListPage;