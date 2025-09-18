import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../api/usersApi';
import { UserDTO } from '../../types/user';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Grid, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getRoleLabel = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'Administrador';
            case 'librarian':
                return 'Bibliotecário';
            case 'reader':
                return 'Leitor';
            default:
                return 'Usuário';
        }
    };
    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'secondary';
            case 'librarian':
                return 'primary';
            case 'reader':
                return 'default';
            default:
                return 'default';
        }
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError('Erro ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Deseja realmente excluir este usuário?')) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch {
            alert('Erro ao excluir usuário.');
        }
    };

    let content;
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
                            <TableCell>Email</TableCell>
                            <TableCell>Papel</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => {
                            const normalizedStatus = user.status?.toLowerCase();
                            const statusLabel = normalizedStatus === 'active' ? 'Ativo' : 'Inativo';
                            const statusColor = normalizedStatus === 'active' ? 'success' : 'default';

                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getRoleLabel(user.role)}
                                            color={getRoleColor(user.role) as 'default' | 'primary' | 'secondary'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusLabel}
                                            color={statusColor}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="primary" onClick={() => navigate(`/users/${user.id}/edit`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => user.id !== undefined && handleDelete(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Usuários
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/users/new')}>
                        Adicionar Usuário
                    </Button>
                </Grid>
            </Grid>
            {content}
        </Box>
    );
};

export default UserListPage;