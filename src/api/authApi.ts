import api from './api';

export const register = async (user: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: string; // "READER" | "LIBRARIAN" | "ADMIN"
}) => {
    const { data } = await api.post('/auth/register', user);
    return data;
};