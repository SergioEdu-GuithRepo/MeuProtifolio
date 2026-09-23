// src/types/data.d.ts
export type ProjectCategory = 'branding' | 'campanhas' | 'webdesign' | 'editorial';

// Rótulo de exibição para cada categoria — usado nos filtros da Home, nos cards do
// portfólio e no cabeçalho da página de projeto, para não ficarem dessincronizados
export const categoryLabels: Record<ProjectCategory, string> = {
    branding: 'Product Art',
    campanhas: 'Retoque & CGI',
    webdesign: 'Web Design',
    editorial: 'Editorial',
};

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