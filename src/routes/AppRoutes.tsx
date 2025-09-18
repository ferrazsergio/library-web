import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import PageTransition from '../components/layout/PageTransition'; // <-- Importação aqui!

// Páginas públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
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
import UserListPage from '../pages/users/UserListPage';
import UserFormPage from '../pages/users/UserFormPage';
import LoanListPage from '../pages/loans/LoanListPage';
import LoanFormPage from '../pages/loans/LoanFormPage';
import ProfilePage from '../pages/profiles/ProfilePage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Rota Home pública */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />

            {/* Rotas públicas */}
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forbidden" element={<PageTransition><ForbiddenPage /></PageTransition>} />

            {/* Rotas protegidas dentro do layout principal */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
                    <Route path="/books" element={<PageTransition><BookListPage /></PageTransition>} />
                    <Route path="/books/new" element={<PageTransition><BookFormPage /></PageTransition>} />
                    <Route path="/books/:id/edit" element={<PageTransition><BookFormPage /></PageTransition>} />
                    <Route path="/authors" element={<PageTransition><AuthorListPage /></PageTransition>} />
                    <Route path="/authors/new" element={<PageTransition><AuthorFormPage /></PageTransition>} />
                    <Route path="/authors/:id/edit" element={<PageTransition><AuthorFormPage /></PageTransition>} />
                    <Route path="/categories" element={<PageTransition><CategoryListPage /></PageTransition>} />
                    <Route path="/categories/new" element={<PageTransition><CategoryFormPage /></PageTransition>} />
                    <Route path="/categories/:id/edit" element={<PageTransition><CategoryFormPage /></PageTransition>} />
                    <Route path="/users" element={<PageTransition><UserListPage /></PageTransition>} />
                    <Route path="/users/new" element={<PageTransition><UserFormPage /></PageTransition>} />
                    <Route path="/users/:id/edit" element={<PageTransition><UserFormPage /></PageTransition>} />
                    <Route path="/loans" element={<PageTransition><LoanListPage /></PageTransition>} />
                    <Route path="/loans/new" element={<PageTransition><LoanFormPage /></PageTransition>} />
                    <Route path="/loans/:id/edit" element={<PageTransition><LoanFormPage /></PageTransition>} />
                    <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                </Route>
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
    );
};

export default AppRoutes;