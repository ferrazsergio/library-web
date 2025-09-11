import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import { User } from '../types';

interface DecodedToken {
    sub: string;
    roles: string[];
    exp: number;
    name: string;
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
                // Verificar se o token expirou
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    return;
                }

                // Se o token é válido, carrega os dados do usuário do localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                // Se o token for inválido (malformado, etc), desloga.
                logout();
            }
        }
        // A array de dependências vazia [] garante que isso só rode uma vez, no início.
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            // CORREÇÃO AQUI: Use o 'token' da resposta da API, não 'storedToken'.
            const decoded = jwtDecode<DecodedToken>(token);

            const userData: User = {
                id: parseInt(decoded.sub),
                name: decoded.name,
                email: email,
                role: decoded.roles[0]
            };

            setUser(userData);
            setToken(token);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await api.post('/auth/register', { name, email, password });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
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