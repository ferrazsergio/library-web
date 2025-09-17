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
import { useNavigate } from 'react-router-dom';

const AuthorListPage: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadAuthors = async () => {
        try {
            setLoading(true);
            const data = await fetchAuthors();
            setAuthors(data);
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
        } catch {
            alert('Erro ao excluir autor.');
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
                            <TableCell>Nome</TableCell>
                            <TableCell>Biografia</TableCell>
                            <TableCell>Data de Nascimento</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map(author => (
                            <TableRow key={author.id}>
                                <TableCell>{author.name}</TableCell>
                                <TableCell>{author.biography}</TableCell>
                                <TableCell>{author.birthDate || ''}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/authors/${author.id}/edit`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(author.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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
                Autores
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/authors/new')}
                    >
                        Adicionar Autor
                    </Button>
                </Grid>
            </Grid>
            {content}
        </Box>
    );
};

export default AuthorListPage;