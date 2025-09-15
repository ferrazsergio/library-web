import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Paper, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchDashboardData, fetchMostBorrowedCategories, fetchRecentActivities } from '../../api/dashboardApi';

// Tipos para os dados da API para melhorar a segurança de tipo
interface DashboardData {
    totalBooks: number;
    activeLoans: number;
    overdueLoans: number;
    totalUsers: number;
    totalLoans: number;
}

interface CategoryData {
    category: string;
    count: number;
}

interface ActivityData {
    id: number;
    timestamp: string;
    description: string;
    userName: string;
    bookTitle: string;
}

// Tipo para os dados do gráfico de pizza
interface PieDataEntry {
    name: string;
    value: number;
}

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#A28CFF'];

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const [dataResponse, categoriesResponse, activitiesResponse] = await Promise.all([
                    fetchDashboardData(),
                    fetchMostBorrowedCategories(),
                    fetchRecentActivities(5)
                ]);

                setDashboardData(dataResponse);
                setCategories(categoriesResponse);
                setActivities(activitiesResponse);
            } catch (err) {
                console.error('Error loading dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
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

    const pieChartData: PieDataEntry[] = [
        { name: 'Ativos', value: dashboardData?.activeLoans || 0 },
        { name: 'Atrasados', value: dashboardData?.overdueLoans || 0 },
        { name: 'Devolvidos', value: Math.max(0, (dashboardData?.totalLoans || 0) - ((dashboardData?.activeLoans || 0) + (dashboardData?.overdueLoans || 0))) },
    ];

    // CORREÇÃO: Usar 'any' para evitar conflitos de tipo com Recharts
    const renderPieLabel = (entry: any) => {
        return `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard da Biblioteca
            </Typography>

            {/* Cards de Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="textSecondary">Total de Livros</Typography>
                            <Typography variant="h4">{dashboardData?.totalBooks || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="textSecondary">Empréstimos Ativos</Typography>
                            <Typography variant="h4">{dashboardData?.activeLoans || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="textSecondary">Empréstimos em Atraso</Typography>
                            <Typography variant="h4">{dashboardData?.overdueLoans || 0}</Typography>
                            { (dashboardData?.overdueLoans || 0) > 0 &&
                                <Typography variant="body2" color="error">
                                    Atenção necessária
                                </Typography>
                            }
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="textSecondary">Usuários Cadastrados</Typography>
                            <Typography variant="h4">{dashboardData?.totalUsers || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3}>
                {/* Gráfico de Categorias Mais Emprestadas */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Categorias Mais Emprestadas
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categories}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Empréstimos" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Gráfico de Pizza - Status dos Empréstimos */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Status dos Empréstimos
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={renderPieLabel}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Atividades Recentes */}
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Atividades Recentes
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <Box key={activity.id} sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(activity.timestamp).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                                    <Typography variant="body1">
                                        {activity.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {`${activity.userName} - ${activity.bookTitle}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {index < activities.length - 1 && <Divider sx={{ my: 1 }} />}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1">Nenhuma atividade recente encontrada.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DashboardPage;