import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Paper, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchDashboardData } from '../../api/dashboardApi';
import { motion, Variants } from 'framer-motion';

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

interface DashboardData {
    totalBooks: number;
    activeLoans: number;
    overdueLoans: number;
    totalUsers: number;
    totalLoans: number;
    mostBorrowedCategories: CategoryData[];
    recentActivities: ActivityData[];
}

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#A28CFF'];

export const cardMotion: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const dataResponse = await fetchDashboardData();
                setDashboardData(dataResponse);
            } catch (err) {
                setError('Erro ao carregar dados do dashboard.');
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

    if (error || !dashboardData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error || "Erro ao carregar dados do dashboard."}</Typography>
            </Box>
        );
    }

    const pieChartData = [
        { name: 'Ativos', value: dashboardData.activeLoans },
        { name: 'Atrasados', value: dashboardData.overdueLoans },
        { name: 'Devolvidos', value: Math.max(0, dashboardData.totalLoans - (dashboardData.activeLoans + dashboardData.overdueLoans)) },
    ];

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
                    <motion.div {...cardMotion} whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}>
                        <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                                    Total de Livros
                                </Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {dashboardData.totalBooks}
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div {...cardMotion} whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}>
                        <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                                    Empréstimos Ativos
                                </Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {dashboardData.activeLoans}
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div {...cardMotion} whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}>
                        <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                                    Empréstimos em Atraso
                                </Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {dashboardData.overdueLoans}
                                </Typography>
                                { dashboardData.overdueLoans > 0 &&
                                    <Typography variant="body2" color="error">
                                        Atenção necessária
                                    </Typography>
                                }
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div {...cardMotion} whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}>
                        <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                                    Usuários Cadastrados
                                </Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {dashboardData.totalUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
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
                            <BarChart data={dashboardData.mostBorrowedCategories}>
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

                {dashboardData.recentActivities.length > 0 ? (
                    dashboardData.recentActivities.map((activity, index) => (
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
                                        {[activity.userName, activity.bookTitle].filter(Boolean).join(" - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {index < dashboardData.recentActivities.length - 1 && <Divider sx={{ my: 1 }} />}
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