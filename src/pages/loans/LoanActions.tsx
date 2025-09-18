import React, { useState } from 'react';
import { Button, CircularProgress, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { returnLoan, renewLoan } from '../../api/loansApi';
import { LoanDTO } from '../../types/loan';
import {AnimatePresence, motion} from 'framer-motion';

interface LoanActionsProps {
    loan: LoanDTO;
    onActionComplete: () => void;
}

const LoanActions: React.FC<LoanActionsProps> = ({ loan, onActionComplete }) => {
    const [loading, setLoading] = useState<'renew' | 'return' | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    // Para evitar múltiplos cliques
    const anyLoading = !!loading;

    const handleReturn = async () => {
        setError('');
        setSuccess('');
        setLoading('return');
        try {
            await returnLoan(loan.id);
            setSuccess('Empréstimo devolvido com sucesso!');
            onActionComplete();
        } catch {
            setError('Erro ao devolver empréstimo. Tente novamente.');
        } finally {
            setLoading(null);
            setConfirmDialogOpen(false);
            setTimeout(() => setSuccess(''), 2500);
        }
    };

    const handleRenew = async () => {
        setError('');
        setSuccess('');
        setLoading('renew');
        try {
            await renewLoan(loan.id);
            setSuccess('Empréstimo renovado com sucesso!');
            onActionComplete();
        } catch {
            setError('Erro ao renovar empréstimo. Tente novamente.');
        } finally {
            setLoading(null);
            setTimeout(() => setSuccess(''), 2500);
        }
    };

    const isActive = loan.status === 'ACTIVE';

    return (
        <div>
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                        <Alert severity="error" sx={{ mb: 1, py: 0.5, fontSize: 14 }}>
                            {error}
                        </Alert>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                        <Alert severity="success" sx={{ mb: 1, py: 0.5, fontSize: 14 }}>
                            {success}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                style={{ display: "inline-block" }}
                whileHover={{ scale: isActive && !anyLoading ? 1.04 : 1 }}
                whileTap={{ scale: isActive && !anyLoading ? 0.96 : 1 }}
            >
                <Tooltip title={isActive ? "Devolver empréstimo" : "Ação só disponível para empréstimos ativos"}>
                    <span>
                        <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            startIcon={loading === 'return' ? <CircularProgress size={18} /> : <AssignmentReturnIcon />}
                            disabled={!isActive || anyLoading}
                            onClick={() => setConfirmDialogOpen(true)}
                            aria-label="Devolver empréstimo"
                            tabIndex={0}
                        >
                            Devolver
                        </Button>
                    </span>
                </Tooltip>
            </motion.div>
            <motion.div
                style={{ display: "inline-block", marginLeft: 8 }}
                whileHover={{ scale: isActive && !anyLoading ? 1.04 : 1 }}
                whileTap={{ scale: isActive && !anyLoading ? 0.96 : 1 }}
            >
                <Tooltip title={isActive ? "Renovar empréstimo" : "Ação só disponível para empréstimos ativos"}>
                    <span>
                        <Button
                            variant="outlined"
                            size="small"
                            color="info"
                            startIcon={loading === 'renew' ? <CircularProgress size={18} /> : <AutorenewIcon />}
                            disabled={!isActive || anyLoading}
                            onClick={handleRenew}
                            aria-label="Renovar empréstimo"
                            tabIndex={0}
                        >
                            Renovar
                        </Button>
                    </span>
                </Tooltip>
            </motion.div>

            {/* Diálogo de confirmação para devolver */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                aria-labelledby="confirm-return-title"
            >
                <DialogTitle id="confirm-return-title">Confirmar Devolução</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja devolver este empréstimo?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleReturn} color="secondary" variant="contained" disabled={loading === 'return'}>
                        {loading === 'return' ? <CircularProgress size={18} /> : "Confirmar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoanActions;