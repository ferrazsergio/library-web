import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Grid, MenuItem } from '@mui/material';
import { fetchUserById, createUser, updateUser } from '../../api/usersApi';
import { UserDTO } from '../../types/user';

const UserFormPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [user, setUser] = useState<Partial<UserDTO>>({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const data = await fetchUserById(Number(id));
                    setUser(data);
                }
            } catch {
                setError('Erro ao carregar dados do usuário.');
            } finally {
                setLoading(false);
            }
        };
        if (isEdit) load();
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUser(prev => ({
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
                await updateUser(Number(id), user);
            } else {
                await createUser(user);
            }
            navigate('/users');
        } catch {
            setError('Erro ao salvar usuário.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Usuário' : 'Cadastrar Usuário'}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nome"
                                name="name"
                                required
                                value={user.name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Email"
                                name="email"
                                required
                                value={user.email}
                                onChange={handleChange}
                                fullWidth
                                type="email"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                label="Papel"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="user">Usuário</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                label="Status"
                                name="status"
                                value={user.status}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="active">Ativo</MenuItem>
                                <MenuItem value="inactive">Inativo</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/users')}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default UserFormPage;