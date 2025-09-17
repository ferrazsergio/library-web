import api from './api';
import { CategoryDTO } from '../types/category';

export const fetchCategories = async (): Promise<CategoryDTO[]> => {
    const { data } = await api.get('/categories');
    return data;
};

export const fetchCategoryById = async (id: number): Promise<CategoryDTO> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
};

export const createCategory = async (category: Partial<CategoryDTO>): Promise<CategoryDTO> => {
    const { data } = await api.post('/categories', category);
    return data;
};

export const updateCategory = async (id: number, category: Partial<CategoryDTO>): Promise<CategoryDTO> => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};