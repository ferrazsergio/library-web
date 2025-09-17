import React from 'react';
import { Button } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { returnLoan, renewLoan } from '../../api/loansApi';
import { LoanDTO } from '../../types/loan';

interface LoanActionsProps {
    loan: LoanDTO;
    onActionComplete: () => void;
}

const LoanActions: React.FC<LoanActionsProps> = ({ loan, onActionComplete }) => (
    <>
        <Button
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<AssignmentReturnIcon />}
            disabled={loan.status !== 'ACTIVE'}
            onClick={async () => {
                await returnLoan(loan.id);
                onActionComplete();
            }}
        >
            Devolver
        </Button>
        <Button
            variant="outlined"
            size="small"
            color="info"
            startIcon={<AutorenewIcon />}
            disabled={loan.status !== 'ACTIVE'}
            sx={{ ml: 1 }}
            onClick={async () => {
                await renewLoan(loan.id);
                onActionComplete();
            }}
        >
            Renovar
        </Button>
    </>
);

export default LoanActions;