export interface UserDTO {
    id?: number; // pode não existir na criação
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    role: 'admin' | 'librarian' | 'reader';
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}