import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem, Grid, Link as MuiLink } from '@mui/material';
import { register } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const roles = [
    { value: 'READER', label: 'Leitor' },
    { value: 'LIBRARIAN', label: 'Bibliotecário' },
    { value: 'ADMIN', label: 'Admin' },
];

// Variants para animação stagger dos campos
const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.11,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 35 } },
};

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
            setTimeout(() => navigate('/login'), 1300);
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
        <Box sx={{ maxWidth: 420, mx: 'auto', mt: { xs: 3, sm: 8 } }}>
            <motion.div
                initial={{ opacity: 0, y: 54, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 28px #1976d211',
                    }}
                >
                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        onSubmit={handleSubmit}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h5" fontWeight={600} sx={{ mb: 2.5, textAlign: 'center' }}>
                                Criar Conta
                            </Typography>
                        </motion.div>

                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: -18, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -18, scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                    <Alert severity="success" sx={{ mb: 2, fontWeight: 500 }}>
                                        Usuário registrado com sucesso!
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -18, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -18, scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                    <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>
                                        {error}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Nome"
                                        name="name"
                                        placeholder="Seu nome completo"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        autoComplete="name"
                                        inputProps={{ "aria-label": "Nome" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="E-mail"
                                        name="email"
                                        placeholder="exemplo@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        type="email"
                                        autoComplete="email"
                                        inputProps={{ "aria-label": "E-mail" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Senha"
                                        name="password"
                                        placeholder="Crie uma senha forte"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        type="password"
                                        autoComplete="new-password"
                                        inputProps={{ "aria-label": "Senha" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Telefone"
                                        name="phone"
                                        placeholder="(99) 99999-9999"
                                        value={form.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        autoComplete="tel"
                                        inputProps={{ "aria-label": "Telefone" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Endereço"
                                        name="address"
                                        placeholder="Rua, número, bairro, cidade"
                                        value={form.address}
                                        onChange={handleChange}
                                        fullWidth
                                        autoComplete="street-address"
                                        inputProps={{ "aria-label": "Endereço" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        select
                                        label="Tipo de Usuário"
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        fullWidth
                                        inputProps={{ "aria-label": "Tipo de Usuário" }}
                                    >
                                        {roles.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, boxShadow: '0 2px 16px #1976d233' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ marginTop: 0 }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        aria-label="Registrar"
                                        disabled={saving}
                                        sx={{ fontWeight: 500, py: 1.2, fontSize: 17 }}
                                    >
                                        {saving ? 'Registrando...' : 'Registrar'}
                                    </Button>
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, boxShadow: '0 2px 16px #1976d244' }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={() => navigate('/')}
                                        aria-label="Voltar para a Home"
                                        sx={{ mt: 1, fontWeight: 500, py: 1.2, fontSize: 17 }}
                                    >
                                        Voltar para a Home
                                    </Button>
                                </motion.div>
                            </Grid>
                            <Grid size={12}>
                                <motion.div variants={itemVariants}>
                                    <Typography align="center" sx={{ mt: 1.5 }}>
                                        Já possui conta?{' '}
                                        <MuiLink
                                            component={Link}
                                            to="/login"
                                            sx={{ color: '#1976d2', fontWeight: 500, textDecoration: 'none', ml: 0.5 }}
                                        >
                                            Entrar
                                        </MuiLink>
                                    </Typography>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.form>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default RegisterPage;