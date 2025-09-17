import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ForbiddenPage: React.FC = () => (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" color="error" gutterBottom>
                403
            </Typography>
            <Typography variant="h5" gutterBottom>
                Acesso Negado
            </Typography>
            <Typography>
                Você não tem permissão para acessar esta página.
            </Typography>
        </Paper>
    </Box>
);

export default ForbiddenPage;