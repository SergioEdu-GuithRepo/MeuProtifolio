// src/types/data.d.ts
export type ProjectCategory = 'branding' | 'campanhas' | 'webdesign' | 'editorial';

export interface IProject {
    id: string;
    title: string;
    category: ProjectCategory;
    imageUrl: string;
    /* challenge: string;
    solution: string;
    role: string; */
    extraImages?: string[]; // Marcado como opcional
}