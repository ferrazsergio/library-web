import api from './api';
import { UserDTO } from '../types/user';

export const fetchUsers = async (): Promise<UserDTO[]> => {
    const { data } = await api.get('/users');
    return data;
};

export const fetchUserById = async (id: number): Promise<UserDTO> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
};

export const createUser = async (user: Partial<UserDTO>): Promise<UserDTO> => {
    const { data } = await api.post('/users', user);
    return data;
};

export const updateUser = async (id: number, user: Partial<UserDTO>): Promise<UserDTO> => {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};

export const fetchMe = async (): Promise<UserDTO> => {
    const { data } = await api.get('/users/me');
    return data;
};

export async function uploadAvatar(file: File): Promise<UserDTO> {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    });

    return data;
}