import React from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography } from '@mui/material';

interface DashboardData {
    totalBooks: number;
    activeLoans: number;
    // Adicione outros campos conforme necessário
}

interface DashboardCardsProps {
    data?: Partial<DashboardData>;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ data }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* 2. Usar a prop 'size' para os breakpoints */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary">
                            Total de Livros
                        </Typography>
                        <Typography variant="h4">
                            {data?.totalBooks ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* 2. Usar a prop 'size' para os breakpoints */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary">
                            Empréstimos Ativos
                        </Typography>
                        <Typography variant="h4">
                            {data?.activeLoans ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DashboardCards;