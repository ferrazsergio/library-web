import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../components/contexts/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Variantes para animação stagger dos campos
const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.13,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 340, damping: 30 },
    },
};

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(120deg, #f5f5f5 60%, #e3e8f0 100%)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 48, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: 400 }}
            >
                <Box
                    component={motion.form}
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    sx={{
                        width: '100%',
                        padding: 4,
                        background: '#fff',
                        borderRadius: 2.5,
                        boxShadow: '0px 8px 32px #1976d211',
                        overflow: 'hidden'
                    }}
                >
                    <motion.div variants={itemVariants}>
                        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                            Login
                        </Typography>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="error-message"
                                initial={{ opacity: 0, y: -24, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -24, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 390, damping: 28 }}
                            >
                                <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
                                    {error}
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            autoFocus
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <TextField
                            label="Senha"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, boxShadow: '0 2px 16px #1976d233' }}
                        whileTap={{ scale: 0.97 }}
                        style={{ marginTop: 16 }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ fontWeight: 500, py: 1.2, fontSize: 17 }}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            Entrar
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Typography align="center" sx={{ mt: 2 }}>
                            Não tem uma conta?{' '}
                            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                                Registre-se
                            </Link>
                        </Typography>
                    </motion.div>

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
                            sx={{ mt: 2, fontWeight: 500, py: 1.2, fontSize: 17 }}
                        >
                            Voltar para a Home
                        </Button>
                    </motion.div>
                </Box>
            </motion.div>
        </Box>
    );
};

export default LoginPage;
