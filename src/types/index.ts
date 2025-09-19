export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    role: 'admin' | 'librarian' | 'reader';
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
    avatarUrl?: string;
}

export interface Book {
    id: number;
    isbn: string;
    title: string;
    description?: string;
    publishDate?: string;
    availableQuantity: number;
    totalQuantity: number;
    publisher?: string;
    categoryId?: number;
    categoryName?: string;
    authorIds?: number[];
    authorNames?: string[];
}

export interface Author {
    id: number;
    name: string;
    biography?: string;
    birthDate?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Loan {
    id: number;
    userId: number;
    userName?: string;
    bookId: number;
    bookTitle?: string;
    loanDate: string;
    expectedReturnDate: string;
    returnDate?: string;
    status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}