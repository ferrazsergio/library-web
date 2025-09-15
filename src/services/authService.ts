import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export async function login(email: string, password: string) {
    // 1. Faz login e pega o token
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);

    // 2. Busca dados do usuário autenticado
    const userRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.setItem("user", JSON.stringify(userRes.data));
    return userRes.data;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
}

export function getToken() {
    return localStorage.getItem("token");
}