import React, { useEffect, useState } from 'react';
import { fetchLoans, deleteLoan, returnLoan, renewLoan } from '../../api/loansApi';
import { LoanDTO } from '../../types/loan';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Grid,
    Chip,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useNavigate } from 'react-router-dom';

const statusLabel = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'Ativo';
        case 'RETURNED':
            return 'Devolvido';
        case 'OVERDUE':
            return 'Atrasado';
        default:
            return status;
    }
};

const statusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'primary';
        case 'RETURNED':
            return 'success';
        case 'OVERDUE':
            return 'error';
        default:
            return 'default';
    }
};

const LoanListPage: React.FC = () => {
    const [loans, setLoans] = useState<LoanDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const loadLoans = async () => {
        try {
            setLoading(true);
            const data = await fetchLoans();
            setLoans(data);
        } catch (err) {
            setError('Erro ao carregar empréstimos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLoans();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Deseja realmente excluir este empréstimo?')) return;
        try {
            setActionLoadingId(id);
            await deleteLoan(id);
            setLoans((prev) => prev.filter((loan) => loan.id !== id));
        } catch {
            alert('Erro ao excluir empréstimo.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReturn = async (id: number) => {
        if (!window.confirm('Confirma devolução deste livro?')) return;
        try {
            setActionLoadingId(id);
            await returnLoan(id);
            await loadLoans();
        } catch {
            alert('Erro ao processar devolução.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRenew = async (id: number) => {
        if (!window.confirm('Confirma renovação deste empréstimo?')) return;
        try {
            setActionLoadingId(id);
            await renewLoan(id);
            await loadLoans();
        } catch {
            alert('Erro ao renovar empréstimo.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Empréstimos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/loans/new')}
                    >
                        Novo Empréstimo
                    </Button>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Usuário</TableCell>
                                <TableCell>Livro</TableCell>
                                <TableCell>Data Empréstimo</TableCell>
                                <TableCell>Previsão Devolução</TableCell>
                                <TableCell>Data Devolução Real</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Multa</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>{loan.user?.name || loan.userId}</TableCell>
                                    <TableCell>{loan.book?.title || loan.bookId}</TableCell>
                                    <TableCell>
                                        {loan.loanDate
                                            ? new Date(loan.loanDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {loan.expectedReturnDate
                                            ? new Date(loan.expectedReturnDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {loan.returnDate
                                            ? new Date(loan.returnDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusLabel(loan.status)}
                                            color={statusColor(loan.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {loan.fine ? (
                                            <Chip
                                                label={`R$ ${loan.fine.amount.toFixed(2)}${
                                                    loan.fine.paid ? ' (paga)' : ''
                                                }`}
                                                color={loan.fine.paid ? 'success' : 'error'}
                                                size="small"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Editar">
                      <span>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/loans/${loan.id}/edit`)}
                            disabled={actionLoadingId === loan.id}
                        >
                          <EditIcon />
                        </IconButton>
                      </span>
                                        </Tooltip>
                                        <Tooltip title="Devolver" placement="top">
                      <span>
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleReturn(loan.id)}
                            disabled={
                                loan.status !== 'ACTIVE' ||
                                actionLoadingId === loan.id
                            }
                        >
                          <AssignmentReturnIcon />
                        </IconButton>
                      </span>
                                        </Tooltip>
                                        <Tooltip title="Renovar" placement="top">
                      <span>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleRenew(loan.id)}
                            disabled={
                                loan.status !== 'ACTIVE' ||
                                actionLoadingId === loan.id
                            }
                        >
                          <AutorenewIcon />
                        </IconButton>
                      </span>
                                        </Tooltip>
                                        <Tooltip title="Excluir">
                      <span>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(loan.id)}
                            disabled={actionLoadingId === loan.id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {loans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        Nenhum empréstimo encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LoanListPage;