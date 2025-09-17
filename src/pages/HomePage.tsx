import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HomePage: React.FC = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Bem-vindo à Biblioteca
            </Typography>
            <Typography variant="body1">
                Use o menu para navegar entre livros, autores, empréstimos e usuários.
            </Typography>
        </Paper>
    </Box>
);

export default HomePage;