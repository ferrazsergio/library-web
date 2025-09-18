import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: '0 8px 28px #d32f2f11' }}>
                <Typography variant="h3" color="error" gutterBottom>
                    403
                </Typography>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                    Acesso Negado
                </Typography>
                <Typography sx={{ mb: 3 }}>
                    Você não tem permissão para acessar esta página.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Ir para página inicial
                </Button>
            </Paper>
        </Box>
    );
};

export default ForbiddenPage;