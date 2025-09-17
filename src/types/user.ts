export interface UserDTO {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'admin' | 'user'; // ou string, se backend enviar outros valores
    status: 'active' | 'inactive'; // se existir esse campo no backend
    createdAt?: string;
    updatedAt?: string;
}