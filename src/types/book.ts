export interface AuthorDTO {
    id: number;
    name: string;
}

export interface CategoryDTO {
    id: number;
    name: string;
}

export interface BookDTO {
    id: number;
    isbn: string;
    title: string;
    description?: string;
    publishDate?: string;
    availableQuantity: number;
    totalQuantity: number;
    authorIds: number[];
    categoryId: number;
    publisher?: string;
    authors?: AuthorDTO[];
    category?: CategoryDTO;
}