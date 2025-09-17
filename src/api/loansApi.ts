import api from './api';
import { LoanDTO } from '../types/loan';

// Lista paginada (ajusta se quiser lidar com paginação real)
export const fetchLoans = async (): Promise<LoanDTO[]> => {
    const { data } = await api.get('/loans');
    return data.content || data; // Para backend Spring paginado
};

export const fetchLoanById = async (id: number): Promise<LoanDTO> => {
    const { data } = await api.get(`/loans/${id}`);
    return data;
};

export const createLoan = async (loan: Partial<LoanDTO>): Promise<LoanDTO> => {
    const { data } = await api.post('/loans', loan);
    return data;
};

export const updateLoan = async (id: number, loan: Partial<LoanDTO>): Promise<LoanDTO> => {
    // Se necessário para edição normal (não devolução/renovação)
    const { data } = await api.put(`/loans/${id}`, loan);
    return data;
};

export const deleteLoan = async (id: number): Promise<void> => {
    await api.delete(`/loans/${id}`);
};

export const returnLoan = async (id: number): Promise<LoanDTO> => {
    const { data } = await api.put(`/loans/${id}/return`);
    return data;
};

export const renewLoan = async (id: number): Promise<LoanDTO> => {
    const { data } = await api.put(`/loans/${id}/renew`);
    return data;
};