import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../api/api';
import { User } from '../../types';

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
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    // Sincronização com múltiplas abas (login/logout)
    useEffect(() => {
        const syncAuth = (e: StorageEvent) => {
            if (e.key === 'token') {
                setToken(e.newValue);
            }
            if (e.key === 'user') {
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    // Logout se o token expirar (checa a cada load e a cada mudança do token)
    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (decoded.exp * 1000 < Date.now()) {
                logout();
                return;
            }
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                fetchUser(token);
            }
            // Timer para logout automático ao expirar o token
            const timeout = decoded.exp * 1000 - Date.now();
            const timer = setTimeout(() => {
                logout();
            }, timeout);
            return () => clearTimeout(timer);
        } catch {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchUser = useCallback(async (token: string) => {
        try {
            const res = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            logout();
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            setToken(token);
            localStorage.setItem('token', token);
            await fetchUser(token);
        } catch (error) {
            logout();
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        await api.post('/auth/register', { name, email, password });
    };

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Opcional: redirecionar para login
        // window.location.href = '/login?expired=1';
    }, []);

    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const isLibrarian = user?.role?.toUpperCase() === 'LIBRARIAN' || isAdmin;
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