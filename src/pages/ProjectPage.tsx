// src/pages/ProjectPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlockContent from '@sanity/block-content-to-react';

// Componentes
import PageTransition from '../components/PageTransition';
import CoverflowCarousel from '../components/CoverflowCarousel';
import GrainGradient from '../components/GrainGradient';
import { TextAnimate } from '../components/TextAnimate';
import { useTheme } from '../context/ThemeContext';


// Conexão com Sanity
import sanityClient from '../sanityClient';
import { type ProjectCategory, categoryLabels } from '../types/data';

// --- Tipagem para os dados do projeto ---
interface SanityProjectDetails {
  title: string;
  category: ProjectCategory;
  imageUrl: string;
  extraImages?: string[];
  content: any[]; // Tipo para 'blockContent' do Sanity
  challenge?: string;
  solution?: string;
  role?: string;
  client?: string;
  year?: string;
}

interface ProjectNavItem {
    slug: string;
    title: string;
    imageUrl: string;
}

const ProjectPage: React.FC = () => {
    // O nome do parâmetro na rota é 'projectId', mas o usamos como 'slug'
    const { projectId: slug } = useParams<{ projectId: string }>();
    const { theme } = useTheme();

    const [project, setProject] = useState<SanityProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [projectList, setProjectList] = useState<ProjectNavItem[]>([]);

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
            content,
            challenge,
            solution,
            role,
            client,
            year
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

        // Lista leve de todos os projetos, na mesma ordem do portfólio, para navegar
        // para o projeto anterior/próximo sem precisar voltar para o grid
        const navQuery = `*[_type == "project"] | order(_createdAt desc){
            "slug": slug.current,
            title,
            "imageUrl": imageUrl.asset->url
        }`;
        sanityClient.fetch<ProjectNavItem[]>(navQuery)
            .then(setProjectList)
            .catch(err => console.error("Falha ao buscar lista de projetos:", err));
    }, [slug]);

    if (isLoading) {
        return (
            <GrainGradient
                width="100%"
                height="100vh"
                gradientFrom={theme === 'light' ? '#ffffff' : '#1a1a1a'}
                gradientTo={theme === 'light' ? '#e4e8eb' : '#050505'}
                driftGlowColor="#9EFF00"
            >
                <div className="project-loading">
                    <span className="project-loading-spinner" />
                    <span className="project-loading-text">Carregando projeto</span>
                </div>
            </GrainGradient>
        );
    }

    if (!project) {
        // Se não está carregando e não encontrou o projeto, redireciona
        return <Navigate to="/" replace />;
    }

    const allImages = [project.imageUrl, ...(project.extraImages || [])].filter(Boolean);

    const currentIndex = projectList.findIndex((p) => p.slug === slug);
    const hasNav = projectList.length > 1 && currentIndex !== -1;
    const prevProject = hasNav ? projectList[(currentIndex - 1 + projectList.length) % projectList.length] : null;
    const nextProject = hasNav ? projectList[(currentIndex + 1) % projectList.length] : null;

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
    const shareWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${project.title} — ${pageUrl}`)}`;

    return (
        <PageTransition>
            <GrainGradient
                width="100%"
                height="auto"
                gradientFrom={theme === 'light' ? '#ffffff' : '#1a1a1a'}
                gradientTo={theme === 'light' ? '#e4e8eb' : '#050505'}
                driftGlowColor="#9EFF00"
            >
            <>
                <Helmet>
                    <title>{project.title} - Portfólio Fiigura</title>
                    <meta
                        name="description"
                        content={project.challenge || `Projeto de ${categoryLabels[project.category] ?? project.category} por Sérgio Eduardo (Fiigura): direção de arte, compositing e retoque conceitual.`}
                    />
                    <meta property="og:title" content={`${project.title} - Fiigura`} />
                    <meta
                        property="og:description"
                        content={project.challenge || `Projeto de ${categoryLabels[project.category] ?? project.category} por Sérgio Eduardo (Fiigura).`}
                    />
                    {project.imageUrl && <meta property="og:image" content={project.imageUrl} />}
                    <meta property="og:type" content="article" />
                </Helmet>

                <div id="project-display-container">
                    <Link to="/#portfolio" className="back-to-portfolio">
                        <i className="fas fa-arrow-left"></i> Voltar ao Portfólio
                    </Link>

                    <p className="project-main-category">
                        {categoryLabels[project.category] ?? project.category}
                        {(project.client || project.year) && (
                            <span className="project-meta-extra">
                                {' '}— {[project.client, project.year].filter(Boolean).join(', ')}
                            </span>
                        )}
                    </p>
                    <TextAnimate as="h1" by="word" animation="blurInUp" duration={0.8} once>
                        {project.title}
                    </TextAnimate>

                    <CoverflowCarousel images={allImages} />

                    {(project.challenge || project.solution || project.role) && (
                        <div className="case-study-grid">
                            {project.challenge && (
                                <div className="case-study-block">
                                    <span className="case-study-label">Desafio</span>
                                    <p>{project.challenge}</p>
                                </div>
                            )}
                            {project.solution && (
                                <div className="case-study-block">
                                    <span className="case-study-label">Solução</span>
                                    <p>{project.solution}</p>
                                </div>
                            )}
                            {project.role && (
                                <div className="case-study-block">
                                    <span className="case-study-label">Meu Papel</span>
                                    <p>{project.role}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="project-details">
                        <BlockContent 
                            blocks={project.content}
                            projectId={sanityClient.config().projectId!}
                            dataset={sanityClient.config().dataset!}
                        />
                    </div>

                    <div className="project-share">
                        <span>Compartilhar:</span>
                        <a href={shareLinkedIn} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn" data-cursor-magnetic>
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href={shareWhatsApp} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp" data-cursor-magnetic>
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>

                    <div className="project-closing-cta">
                        <h3>Gostou? Vamos conversar sobre o seu projeto.</h3>
                        <Link to="/contato" className="btn btn-primary" data-cursor-magnetic>
                            Vamos Bater Um Papo?
                        </Link>
                    </div>
                </div>

                {(prevProject || nextProject) && (
                    <div className="project-nav">
                        {prevProject && (
                            <Link to={`/projeto/${prevProject.slug}`} className="project-nav-link project-nav-prev">
                                <img src={prevProject.imageUrl} alt="" className="project-nav-thumb" />
                                <span>
                                    <small><i className="fas fa-arrow-left"></i> Projeto Anterior</small>
                                    {prevProject.title}
                                </span>
                            </Link>
                        )}
                        {nextProject && (
                            <Link to={`/projeto/${nextProject.slug}`} className="project-nav-link project-nav-next">
                                <span>
                                    <small>Próximo Projeto <i className="fas fa-arrow-right"></i></small>
                                    {nextProject.title}
                                </span>
                                <img src={nextProject.imageUrl} alt="" className="project-nav-thumb" />
                            </Link>
                        )}
                    </div>
                )}
            </>
            </GrainGradient>
        </PageTransition>
    );
};

export default ProjectPage;