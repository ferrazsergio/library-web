import api from './api';
import { AuthorDTO } from '../types/author';

export const fetchAuthors = async (): Promise<AuthorDTO[]> => {
    const { data } = await api.get('/authors', { params: { size: 100 } }); // Adicione size se quiser limitar
    return data.content || [];
};

export const fetchAuthorById = async (id: number): Promise<AuthorDTO> => {
    const { data } = await api.get(`/authors/${id}`);
    return data;
};

export const createAuthor = async (author: Partial<AuthorDTO>): Promise<AuthorDTO> => {
    const { data } = await api.post('/authors', author);
    return data;
};

export const updateAuthor = async (id: number, author: Partial<AuthorDTO>): Promise<AuthorDTO> => {
    const { data } = await api.put(`/authors/${id}`, author);
    return data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
    await api.delete(`/authors/${id}`);
};