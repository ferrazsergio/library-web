import React from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography } from '@mui/material';
import { motion, Variants } from 'framer-motion';

interface DashboardData {
    totalBooks: number;
    activeLoans: number;
}

interface DashboardCardsProps {
    data?: Partial<DashboardData>;
}

const cardMotion: Variants = {
    initial: { opacity: 0, y: 28, scale: 0.97 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.48, ease: "easeOut" }
    }
};


const DashboardCards: React.FC<DashboardCardsProps> = ({ data }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                    {...cardMotion}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}
                >
                    <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>
                                Total de Livros
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {data?.totalBooks ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                    {...cardMotion}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 32px #1976d211' }}
                >
                    <Card sx={{ borderRadius: 3, minHeight: 120 }}>
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>
                                Empréstimos Ativos
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {data?.activeLoans ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            </Grid>
        </Grid>
    );
};

export default DashboardCards;
