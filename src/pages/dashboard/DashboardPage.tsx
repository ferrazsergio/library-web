import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import api from '../../api/api';

interface DashboardData {
    totalBooks: number;
    totalLoans: number;
    mostBorrowedCategories: { category: string; count: number }[];
}

const DashboardPage: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<DashboardData>('/dashboard');
                setData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Card: Total de Livros */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total de Livros</Typography>
                            <Typography variant="h4">{data?.totalBooks}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card: Empréstimos Ativos */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Empréstimos Ativos</Typography>
                            <Typography variant="h4">{data?.totalLoans}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico: Categorias Mais Emprestadas */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Categorias Mais Emprestadas</Typography>
                            <Box sx={{ height: 300 }}>
                                {/* Aqui você pode integrar com uma biblioteca de gráficos, como Chart.js ou Recharts */}
                                <Typography>Gráfico de Categorias</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;