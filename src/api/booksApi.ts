import api from './api';
import { BookDTO } from '../types/book';

// Lista todos os livros
export const fetchBooks = async (): Promise<BookDTO[]> => {
    const { data } = await api.get('/books');
    return data;
};

// Busca livro por ID
export const fetchBookById = async (id: number): Promise<BookDTO> => {
    const { data } = await api.get(`/books/${id}`);
    return data;
};

// Cria novo livro
export const createBook = async (book: Partial<BookDTO>): Promise<BookDTO> => {
    const { data } = await api.post('/books', book);
    return data;
};

// Atualiza livro
export const updateBook = async (id: number, book: Partial<BookDTO>): Promise<BookDTO> => {
    const { data } = await api.put(`/books/${id}`, book);
    return data;
};

// Remove livro
export const deleteBook = async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
};