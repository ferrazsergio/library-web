import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Grid, MenuItem } from '@mui/material';
import { fetchLoanById, createLoan, updateLoan } from '../../api/loansApi';
import { LoanDTO } from '../../types/loan';
import { fetchUsers } from '../../api/usersApi';
import { fetchBooks } from '../../api/booksApi';

const LoanFormPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loan, setLoan] = useState<Partial<LoanDTO>>({
        userId: '',
        bookId: '',
        loanDate: '',
        expectedReturnDate: '',
        returnDate: '',
        status: 'ACTIVE',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [books, setBooks] = useState<{ id: number; title: string }[]>([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [usersData, booksData] = await Promise.all([fetchUsers(), fetchBooks()]);
                setUsers(usersData.map(u => ({ id: u.id, name: u.name })));
                setBooks(booksData.map(b => ({ id: b.id, title: b.title })));
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
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEdit && id) {
                await updateLoan(Number(id), loan);
            } else {
                await createLoan(loan);
            }
            navigate('/loans');
        } catch {
            setError('Erro ao salvar empréstimo.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Empréstimo' : 'Novo Empréstimo'}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Usuário"
                                name="userId"
                                required
                                value={loan.userId}
                                onChange={handleChange}
                                fullWidth
                                disabled={isEdit}
                            >
                                {users.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Livro"
                                name="bookId"
                                required
                                value={loan.bookId}
                                onChange={handleChange}
                                fullWidth
                                disabled={isEdit}
                            >
                                {books.map(b => (
                                    <MenuItem key={b.id} value={b.id}>{b.title}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Data Empréstimo"
                                name="loanDate"
                                type="date"
                                required
                                value={loan.loanDate}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Previsão Devolução"
                                name="expectedReturnDate"
                                type="date"
                                required
                                value={loan.expectedReturnDate}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Data Devolução Real"
                                name="returnDate"
                                type="date"
                                value={loan.returnDate || ''}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Status"
                                name="status"
                                value={loan.status}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="ACTIVE">Ativo</MenuItem>
                                <MenuItem value="RETURNED">Devolvido</MenuItem>
                                <MenuItem value="OVERDUE">Atrasado</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/loans')}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default LoanFormPage;