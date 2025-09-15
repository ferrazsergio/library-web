import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import { User } from '../types';

interface DecodedToken {
    sub: string;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLibrarian: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        // Ao iniciar, se houver um token no state, valida-o e carrega o usuário.
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    return;
                }
                // Busca o usuário do localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Se não tem user salvo, busca do backend
                    fetchUser(token);
                }
            } catch (error) {
                logout();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Função para buscar dados do usuário autenticado
    const fetchUser = async (token: string) => {
        try {
            const res = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            logout();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            // Salva token
            setToken(token);
            localStorage.setItem('token', token);

            // Busca dados do usuário autenticado no backend
            await fetchUser(token);
        } catch (error) {
            logout();
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        await api.post('/auth/register', { name, email, password });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAdmin = user?.role === 'ADMIN';
    const isLibrarian = user?.role === 'LIBRARIAN' || isAdmin;
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isAdmin,
                isLibrarian,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};