import React, { useEffect, useRef, useState } from 'react';
import { fetchMe, uploadAvatar } from '../../api/usersApi';
import { UserDTO } from '../../types/user';
import { Box, Typography, Paper, CircularProgress, Grid, Chip, Alert, Avatar, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const roleLabel = (role?: string) => {
    switch (role) {
        case 'admin': return 'Administrador';
        case 'librarian': return 'Bibliotecário';
        case 'reader': return 'Leitor';
        default: return role || '-';
    }
};
const statusColor = (status?: string) => {
    switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'default';
        default: return 'default';
    }
};
const statusLabel = (status?: string) => {
    switch (status) {
        case 'active': return 'Ativo';
        case 'inactive': return 'Inativo';
        default: return status || '-';
    }
};

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fetchMe()
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Erro ao carregar perfil.');
                setLoading(false);
            });
    }, []);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        setUploading(true);
        try {
            const updatedUser = await uploadAvatar(file);
            setUser(updatedUser);
        } catch {
            setError('Erro ao enviar imagem.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !user) {
        return (
            <AnimatePresence>
                <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                    <Alert severity="error" sx={{ my: 2 }}>{error || "Erro ao carregar perfil."}</Alert>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: { xs: 3, sm: 6 } }}>
            <motion.div
                initial={{ opacity: 0, y: 38, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: '0 8px 28px #1976d111' }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Meu Perfil
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            alt={user.name}
                            src={user.avatarUrl}
                            sx={{ width: 80, height: 80, mr: 2, fontSize: 32 }}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? "Enviando..." : "Trocar Foto"}
                        </Button>
                    </Box>

                    <Grid container spacing={1.2}>
                        <Grid size={{ xs: 12 }}><strong>ID:</strong> {user.id}</Grid>
                        <Grid size={{ xs: 12 }}><strong>Nome:</strong> {user.name}</Grid>
                        <Grid size={{ xs: 12 }}><strong>Email:</strong> {user.email}</Grid>
                        {user.phone && (
                            <Grid size={{ xs: 12 }}><strong>Telefone:</strong> {user.phone}</Grid>
                        )}
                        {user.address && (
                            <Grid size={{ xs: 12 }}><strong>Endereço:</strong> {user.address}</Grid>
                        )}
                        <Grid size={{ xs: 12 }}>
                            <strong>Papel:</strong> <Chip label={roleLabel(user.role)} color="info" size="small" sx={{ ml: 1 }} />
                        </Grid>
                        {user.status && (
                            <Grid size={{ xs: 12 }}>
                                <strong>Status:</strong>{' '}
                                <Chip
                                    label={statusLabel(user.status)}
                                    color={statusColor(user.status)}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Grid>
                        )}
                        {user.createdAt && (
                            <Grid size={{ xs: 12 }}>
                                <strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}
                            </Grid>
                        )}
                        {user.updatedAt && (
                            <Grid size={{ xs: 12 }}>
                                <strong>Atualizado em:</strong> {new Date(user.updatedAt).toLocaleString()}
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default ProfilePage;