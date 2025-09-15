import api from './api';

export const fetchDashboardData = async () => {
    const response = await api.get('/api/v1/dashboard');
    return response.data;
};

export const fetchMostBorrowedCategories = async () => {
    const response = await api.get('/api/v1/dashboard/categories');
    return response.data;
};

export const fetchRecentActivities = async (limit = 5) => {
    const response = await api.get(`/api/v1/dashboard/activities?limit=${limit}`);
    return response.data;
};