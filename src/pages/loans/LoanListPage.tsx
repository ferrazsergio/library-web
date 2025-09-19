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
    Chip,
    Tooltip,
    Alert,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

const tableContainerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -25 },
    show: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.06, type: "spring", stiffness: 460, damping: 35 }
    })
};

const LoanListPage: React.FC = () => {
    const [loans, setLoans] = useState<LoanDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const loadLoans = async () => {
        try {
            setLoading(true);
            const data = await fetchLoans();
            setLoans(data);
            setError('');
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
            setSuccess('Empréstimo excluído com sucesso!');
            setOpenSnackbar(true);
        } catch {
            setError('Erro ao excluir empréstimo.');
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
            setSuccess('Empréstimo devolvido com sucesso!');
            setOpenSnackbar(true);
        } catch {
            setError('Erro ao processar devolução.');
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
            setSuccess('Empréstimo renovado com sucesso!');
            setOpenSnackbar(true);
        } catch {
            setError('Erro ao renovar empréstimo.');
        } finally {
            setActionLoadingId(null);
        }
    };

    let content: React.ReactNode;

    if (loading) {
        content = (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 7 }}>
                <CircularProgress />
            </Box>
        );
    } else if (error) {
        content = (
            <AnimatePresence>
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
            </AnimatePresence>
        );
    } else {
        content = (
            <motion.div
                variants={tableContainerVariants}
                initial="hidden"
                animate="show"
            >
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 28px #1976d111', mt: 1 }}>
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
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {loans.map((loan, i) => (
                                    <motion.tr
                                        key={loan.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="show"
                                        custom={i}
                                        exit="hidden"
                                        style={{ background: i % 2 ? "#f8fafd" : "#fff" }}
                                    >
                                        <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {loan.user?.name || loan.userId}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {loan.book?.title || loan.bookId}
                                        </TableCell>
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
                                                    label={`R$ ${loan.fine.amount.toFixed(2)}${loan.fine.paid ? ' (paga)' : ''}`}
                                                    color={loan.fine.paid ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/loans/${loan.id}/edit`)}
                                                        disabled={actionLoadingId === loan.id}
                                                        aria-label="Editar empréstimo"
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
                                                            loan.status !== 'ACTIVE' || actionLoadingId === loan.id
                                                        }
                                                        aria-label="Devolver empréstimo"
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
                                                            loan.status !== 'ACTIVE' || actionLoadingId === loan.id
                                                        }
                                                        aria-label="Renovar empréstimo"
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
                                                        aria-label="Excluir empréstimo"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
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
            </motion.div>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <motion.div
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            >
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Empréstimos
                </Typography>
                <motion.div
                    whileHover={{ scale: 1.04, boxShadow: '0 2px 16px #1976d233' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: 'inline-block', marginBottom: 16 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/loans/new')}
                        aria-label="Novo empréstimo"
                        sx={{ fontWeight: 500, py: 1.1, fontSize: 17 }}
                    >
                        Novo Empréstimo
                    </Button>
                </motion.div>
                <AnimatePresence>
                    {success && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        >
                            <Snackbar
                                open={!!success}
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                autoHideDuration={2000}
                                onClose={() => setSuccess('')}
                                message={success}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {content}
            </motion.div>
        </Box>
    );
};

export default LoanListPage;