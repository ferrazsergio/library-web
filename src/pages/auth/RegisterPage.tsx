import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Alert, MenuItem } from '@mui/material';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const roles = [
    { value: 'READER', label: 'Leitor' },
    { value: 'LIBRARIAN', label: 'Bibliotecário' },
    { value: 'ADMIN', label: 'Admin' },
];

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'READER',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError('');
        try {
            await register(form);
            setSuccess(true);
            setForm({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                role: 'READER',
            });
            setTimeout(() => navigate('/login'), 1200);
        } catch (err: any) {
            if (err?.response?.status === 409) {
                setError('E-mail já cadastrado.');
            } else if (err?.response?.data?.errors) {
                setError(
                    err.response.data.errors
                        .map((e: any) => `${e.field}: ${e.message}`)
                        .join(', ')
                );
            } else {
                setError('Erro ao registrar. Tente novamente.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Criar Conta
                </Typography>
                {success && <Alert severity="success">Usuário registrado com sucesso!</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="E-mail"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                fullWidth
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Senha"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Telefone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Endereço"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Tipo de Usuário"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                fullWidth
                            >
                                {roles.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth disabled={saving}>
                                {saving ? 'Registrando...' : 'Registrar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default RegisterPage;