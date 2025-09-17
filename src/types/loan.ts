import { UserDTO } from './user';
import { BookDTO } from './book';

export interface FineDTO {
    id: number;
    amount: number;
    paid: boolean;
    dueDate: string;
}

export interface LoanDTO {
    id: number;
    userId: number;
    bookId: number;
    loanDate: string | null;
    expectedReturnDate: string | null;
    returnDate: string | null;
    status: 'ACTIVE' | 'RETURNED' | 'OVERDUE'; // ajuste se houver mais status no backend
    user?: UserDTO;
    book?: BookDTO;
    fine?: FineDTO;
}