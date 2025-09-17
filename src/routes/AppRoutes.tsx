import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Páginas públicas
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import ForbiddenPage from '../pages/ForbiddenPage';
import NotFoundPage from '../pages/NotFoundPage';

// Páginas protegidas
import DashboardPage from '../pages/dashboard/DashboardPage';
import BookListPage from '../pages/books/BookListPage';
import BookFormPage from '../pages/books/BookFormPage';
import AuthorListPage from '../pages/authors/AuthorListPage';
import AuthorFormPage from '../pages/authors/AuthorFormPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import CategoryFormPage from '../pages/categories/CategoryFormPage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Rotas protegidas dentro do layout principal */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/books" element={<BookListPage />} />
                    <Route path="/books/new" element={<BookFormPage />} />
                    <Route path="/books/:id/edit" element={<BookFormPage />} />
                    <Route path="/authors" element={<AuthorListPage />} />
                    <Route path="/authors/new" element={<AuthorFormPage />} />
                    <Route path="/authors/:id/edit" element={<AuthorFormPage />} />
                    <Route path="/categories" element={<CategoryListPage />} />
                    <Route path="/categories/new" element={<CategoryFormPage />} />
                    <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
                </Route>
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;