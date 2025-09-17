import React, { useEffect, useState } from 'react';
import { fetchMe } from '../../api/usersApi';
import { UserDTO } from '../../types/user';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMe().then((data) => {
            setUser(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Carregando...</div>;
    if (!user) return <div>Erro ao carregar perfil.</div>;

    return (
        <div style={{maxWidth: 500, margin: "0 auto"}}>
            <h2>Meu Perfil</h2>
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Nome:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            {user.phone && <div><strong>Telefone:</strong> {user.phone}</div>}
            {user.address && <div><strong>Endereço:</strong> {user.address}</div>}
            <div><strong>Papel:</strong> {user.role}</div>
            {user.status && <div><strong>Status:</strong> {user.status}</div>}
            {user.createdAt && <div><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</div>}
            {user.updatedAt && <div><strong>Atualizado em:</strong> {new Date(user.updatedAt).toLocaleString()}</div>}
        </div>
    );
};

export default ProfilePage;