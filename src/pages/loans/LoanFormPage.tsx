import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    MenuItem,
    Alert,
    Tooltip,
    Snackbar
} from '@mui/material';
import { fetchLoanById, createLoan, updateLoan } from '../../api/loansApi';
import { LoanDTO } from '../../types/loan';
import { fetchUsers } from '../../api/usersApi';
import { fetchBooks } from '../../api/booksApi';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.10 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 35 } }
};

const LoanFormPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loan, setLoan] = useState<Partial<LoanDTO>>({
        userId: undefined,
        bookId: undefined,
        loanDate: '',
        expectedReturnDate: '',
        returnDate: '',
        status: 'ACTIVE',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [books, setBooks] = useState<{ id: number; title: string }[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [usersData, booksData] = await Promise.all([fetchUsers(), fetchBooks()]);
                setUsers(
                    usersData
                        .filter(u => u.id !== undefined)
                        .map(u => ({ id: u.id as number, name: u.name }))
                );
                setBooks(
                    booksData
                        .filter(b => b.id !== undefined)
                        .map(b => ({ id: b.id as number, title: b.title }))
                );
                if (isEdit && id) {
                    const data = await fetchLoanById(Number(id));
                    setLoan({
                        ...data,
                        userId: data.userId,
                        bookId: data.bookId,
                        loanDate: data.loanDate ? data.loanDate.slice(0, 10) : '',
                        expectedReturnDate: data.expectedReturnDate ? data.expectedReturnDate.slice(0, 10) : '',
                        returnDate: data.returnDate ? data.returnDate.slice(0, 10) : '',
                        status: data.status,
                    });
                }
            } catch {
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLoan(prev => ({
            ...prev,
            [name]: name === "userId" || name === "bookId" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            if (isEdit && id) {
                await updateLoan(Number(id), loan);
                setSuccess('Empréstimo atualizado com sucesso!');
            } else {
                await createLoan(loan);
                setSuccess('Empréstimo criado com sucesso!');
            }
            setOpenSnackbar(true);
            setTimeout(() => navigate('/loans'), 1400);
        } catch {
            setError('Erro ao salvar empréstimo.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 2, sm: 5 } }}>
            <motion.div
                initial={{ opacity: 0, y: 42, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            >
                <Paper
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        boxShadow: '0 8px 28px #1976d111',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        onSubmit={handleSubmit}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h5" gutterBottom fontWeight={600}>
                                {isEdit ? 'Editar Empréstimo' : 'Novo Empréstimo'}
                            </Typography>
                        </motion.div>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -16 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                >
                                    <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>
                                        {error}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <Tooltip title={isEdit ? "Usuário não pode ser editado" : ""}>
                                        <TextField
                                            select
                                            label="Usuário"
                                            name="userId"
                                            required
                                            value={loan.userId ?? ''}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled={isEdit}
                                            inputProps={{ "aria-label": "Selecionar usuário" }}
                                        >
                                            {users.map(u => (
                                                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Tooltip>
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <Tooltip title={isEdit ? "Livro não pode ser editado" : ""}>
                                        <TextField
                                            select
                                            label="Livro"
                                            name="bookId"
                                            required
                                            value={loan.bookId ?? ''}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled={isEdit}
                                            inputProps={{ "aria-label": "Selecionar livro" }}
                                        >
                                            {books.map(b => (
                                                <MenuItem key={b.id} value={b.id}>{b.title}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Tooltip>
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Data Empréstimo"
                                        name="loanDate"
                                        type="date"
                                        required
                                        value={loan.loanDate}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ "aria-label": "Data de empréstimo" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Previsão Devolução"
                                        name="expectedReturnDate"
                                        type="date"
                                        required
                                        value={loan.expectedReturnDate}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ "aria-label": "Data prevista para devolução" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        label="Data Devolução Real"
                                        name="returnDate"
                                        type="date"
                                        value={loan.returnDate || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ "aria-label": "Data real de devolução" }}
                                    />
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <TextField
                                        select
                                        label="Status"
                                        name="status"
                                        value={loan.status}
                                        onChange={handleChange}
                                        fullWidth
                                        inputProps={{ "aria-label": "Status do empréstimo" }}
                                    >
                                        <MenuItem value="ACTIVE">Ativo</MenuItem>
                                        <MenuItem value="RETURNED">Devolvido</MenuItem>
                                        <MenuItem value="OVERDUE">Atrasado</MenuItem>
                                    </TextField>
                                </motion.div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <motion.div
                                    variants={itemVariants}
                                    style={{ display: "flex", gap: 12 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={saving}
                                        aria-label={isEdit ? "Salvar alterações do empréstimo" : "Criar novo empréstimo"}
                                        sx={{ fontWeight: 500, px: 3, py: 1.1, fontSize: 16 }}
                                    >
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate('/loans')}
                                        aria-label="Cancelar"
                                        sx={{ fontWeight: 500, px: 3, py: 1.1, fontSize: 16 }}
                                    >
                                        Cancelar
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.form>
                    <Snackbar
                        open={openSnackbar && !!success}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        autoHideDuration={2000}
                        onClose={() => setOpenSnackbar(false)}
                        message={success}
                    />
                </Paper>
            </motion.div>
        </Box>
    );
};

export default LoanFormPage;