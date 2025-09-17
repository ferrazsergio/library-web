import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const NotFoundPage: React.FC = () => (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Página Não Encontrada
            </Typography>
            <Typography>
                A página que você procura não existe.
            </Typography>
        </Paper>
    </Box>
);

export default NotFoundPage;