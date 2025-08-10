// src/pages/ProjectPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlockContent from '@sanity/block-content-to-react';

// Componentes
import PageTransition from '../components/PageTransition';
import CoverflowCarousel from '../components/CoverflowCarousel';


// Conexão com Sanity
import sanityClient from '../sanityClient';

// --- Tipagem para os dados do projeto ---
interface SanityProjectDetails {
  title: string;
  category: string;
  imageUrl: string;
  extraImages?: string[];
  content: any[]; // Tipo para 'blockContent' do Sanity
}

const ProjectPage: React.FC = () => {
    // O nome do parâmetro na rota é 'projectId', mas o usamos como 'slug'
    const { projectId: slug } = useParams<{ projectId: string }>();
    
    const [project, setProject] = useState<SanityProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        const query = `*[_type == "project" && slug.current == $slug][0]{
            title,
            category,
            "imageUrl": imageUrl.asset->url,
            "extraImages": extraImages[].asset->url,
            content
        }`;
        
        sanityClient.fetch<SanityProjectDetails>(query, { slug })
            .then(data => {
                setProject(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Falha ao buscar detalhes do projeto:", err);
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) {
        return <div style={{color: 'white', textAlign: 'center', paddingTop: '200px', height: '100vh'}}>Carregando projeto...</div>;
    }

    if (!project) {
        // Se não está carregando e não encontrou o projeto, redireciona
        return <Navigate to="/" replace />;
    }

    const allImages = [project.imageUrl, ...(project.extraImages || [])].filter(Boolean);

    return (
        <PageTransition>
            <>
                <Helmet>
                    <title>{project.title} - Portfólio ICONI</title>
                </Helmet>

                <div id="project-display-container">
                    <p className="project-main-category">Projeto de {project.category}</p>
                    <h1>{project.title}</h1>

                    <CoverflowCarousel images={allImages} />
                    
                    <div className="project-details">
                        <BlockContent 
                            blocks={project.content}
                            projectId={sanityClient.config().projectId!}
                            dataset={sanityClient.config().dataset!}
                        />
                    </div>
                </div>
            </>
        </PageTransition>
    );
};

export default ProjectPage;