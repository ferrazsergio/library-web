import React from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: 420 }}
            >
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                    <LibraryBooksRoundedIcon sx={{ fontSize: 62, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Bem-vindo à Biblioteca
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Gerencie livros, autores, empréstimos e usuários de forma fácil e intuitiva.
                    </Typography>
                    <Stack direction="column" spacing={2} mt={2}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            fullWidth
                        >
                            Entrar
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/register')}
                            fullWidth
                        >
                            Cadastrar
                        </Button>
                    </Stack>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default HomePage;