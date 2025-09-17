export interface AuthorDTO {
    id: number;
    name: string;
    biography?: string;
    birthDate?: string; // formato: "YYYY-MM-DD"
}