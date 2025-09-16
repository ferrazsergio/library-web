import api from './api';
import { DashboardDataDTO } from '../types/dashboard';

// Busca todos os dados do dashboard (cards, categorias mais emprestadas, atividades recentes)
export const fetchDashboardData = async (): Promise<DashboardDataDTO> => {
    const response = await api.get('/api/v1/dashboard');
    return response.data;
};