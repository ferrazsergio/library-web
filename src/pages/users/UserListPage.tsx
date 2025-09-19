import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../api/usersApi';
import { UserDTO } from '../../types/user';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Chip,
    Snackbar,
    Alert,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'Ativo';
        case 'inactive':
            return 'Inativo';
        default:
            return '-';
    }
};
const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'default';
        default:
            return 'default';
    }
};

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
            setError('');
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
            setActionLoadingId(id);
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
            setSuccess('Usuário excluído com sucesso!');
            setOpenSnackbar(true);
        } catch {
            setError('Erro ao excluir usuário.');
        } finally {
            setActionLoadingId(null);
        }
    };

    let content;
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 28px #1976d111', mt: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Papel</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {users.map(user => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -25 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -25 }}
                                        transition={{ type: "spring", stiffness: 460, damping: 35 }}
                                        style={{ background: user.id && user.id % 2 ? "#f8fafd" : "#fff" }}
                                    >
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
                                                label={getStatusLabel(user.status)}
                                                color={getStatusColor(user.status)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/users/${user.id}/edit`)}
                                                        aria-label="Editar usuário"
                                                        disabled={actionLoadingId === user.id}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => user.id !== undefined && handleDelete(user.id)}
                                                        aria-label="Excluir usuário"
                                                        disabled={actionLoadingId === user.id}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Nenhum usuário encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <motion.div
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            >
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Usuários
                </Typography>
                <motion.div
                    whileHover={{ scale: 1.04, boxShadow: '0 2px 16px #1976d233' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: 'inline-block', marginBottom: 16 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/users/new')}
                        aria-label="Adicionar usuário"
                        sx={{ fontWeight: 500, py: 1.1, fontSize: 17 }}
                    >
                        Adicionar Usuário
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
                            <Snackbar
                                open={!!success}
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                autoHideDuration={2000}
                                onClose={() => setSuccess('')}
                                message={success}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {content}
            </motion.div>
        </Box>
    );
};

export default UserListPage;