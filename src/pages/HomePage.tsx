// src/pages/HomePage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Componentes
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/FadeIn';
import ImageLoader from '../components/ImageLoader';

// Conexão com Sanity
import sanityClient from '../sanityClient';
import { type ProjectCategory } from '../types/data';

import Masonry from 'react-masonry-css';

/* const MotionLink = motion(Link); */


// --- Tipagem para os dados ---
interface SanityProject {
    title: string;
    slug: string;
    imageUrl: string;
    category: ProjectCategory;
}

const HomePage: React.FC = () => {
    // --- Estados do Componente ---
    const [projects, setProjects] = useState<SanityProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all');

    // Estados e Refs do Hero
    const [activeSlide, setActiveSlide] = useState(0);
    const heroRef = useRef<HTMLElement>(null);
    const aboutSectionRef = useRef<HTMLElement>(null); // 1. MUDAMOS A REF PARA A SEÇÃO INTEIRA
    const lastKnownIndex = useRef(0);

    const masonryBreakpoints = {
        default: 3,   // acima de 1100px → 3 colunas
        1100: 2,      // entre 1100px e 768px → 2 colunas
        768: 1,       // entre 768px e 424px → 1 coluna
        423: 1        // menor que 423px → 1 coluna garantida
    };

    useEffect(() => {
        const handleScroll = () => {
            const sectionElement = aboutSectionRef.current;
            if (!sectionElement) return;

            const rect = sectionElement.getBoundingClientRect();

            // O efeito acontece enquanto a seção estiver visível na tela
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                // Fator de parallax. Para uma seção grande, um valor menor é melhor.
                const parallaxFactor = 0.1;

                // O cálculo do deslocamento. Move a seção inteira.
                const translateY = (window.innerHeight / 2 - rect.top) * parallaxFactor;

                // Aplicamos a transformação diretamente no container dos elementos
                const container = sectionElement.querySelector('.about-container');
                if (container) {
                    (container as HTMLElement).style.transform = `translateY(${translateY}px)`;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Efeitos ---
    // Busca os dados do Sanity
    useEffect(() => {
        const query = `*[_type == "project"] | order(_createdAt desc){
            title, "slug": slug.current, "imageUrl": imageUrl.asset->url, category
        }`;
        sanityClient.fetch<SanityProject[]>(query)
            .then(data => { setProjects(data); setIsLoading(false); })
            .catch(err => { console.error("Falha ao buscar projetos:", err); setIsLoading(false); });
    }, []);

    // Efeito para o slideshow do Hero
    useEffect(() => {
        const heroElement = heroRef.current;
        if (!heroElement) return;
        const handleMouseMove = (e: MouseEvent) => {
            const newIndex = e.clientX / heroElement.offsetWidth < 0.5 ? 0 : 1;
            if (newIndex !== lastKnownIndex.current) {
                setActiveSlide(newIndex);
                lastKnownIndex.current = newIndex;
            }
        };
        heroElement.addEventListener('mousemove', handleMouseMove);
        return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Efeito para o parallax do Hero
    useEffect(() => {
        const handleScroll = () => {
            document.querySelectorAll('.hero-slide').forEach(slide => {
                (slide as HTMLElement).style.transform = `translateY(${window.scrollY * 0.4}px)`;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    // --- Lógica de Filtragem ---
    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <PageTransition>
            <>
                <Helmet>
                    <title>ICONI - Design e Direção Criativa</title>
                </Helmet>

                <section id="hero" ref={heroRef}>
                    <div className={`hero-slide ${activeSlide === 0 ? 'active-slide' : ''}`} style={{ backgroundImage: `url('https://bobcorp.nyc3.digitaloceanspaces.com/rabiscodahistoria/2023/07/Fotos-campanha-publicitaria-criativa-sucesso.webp')` }}>
                        <div className="hero-content">
                            <h1 className="gradient-text">DESIGN ESTRATÉGICO</h1>
                            <h2 style={{ color: 'white', fontWeight: 700 }}>DIREÇÃO CRIATIVA</h2>
                            <p>Transformando ideias em experiências visuais memoráveis.</p>
                            <motion.a href="#portfolio" className="btn btn-secondary" data-cursor-magnetic whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explorar Portfólio</motion.a>
                            {/* <motion.a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <i className="fab fa-github" style={{marginRight: '8px'}}></i>GitHub
                            </motion.a> */}
                        </div>
                    </div>
                    <div className={`hero-slide ${activeSlide === 1 ? 'active-slide' : ''}`} style={{ backgroundImage: `url('https://vivagreen.com.br/wp-content/uploads/2018/02/robin-wood-macaco-1.jpg')` }}>
                        <div className="hero-content">
                            <h1 className="gradient-text">CONSTRUINDO MARCAS</h1>
                            <h2 style={{ color: 'white', fontWeight: 700 }}>CONTANDO HISTÓRIAS</h2>
                            <p>De branding a campanhas digitais, meu foco é criar soluções criativas com propósito.</p>
                            <motion.a href="#portfolio" className="btn btn-secondary"  data-cursor-magnetic whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explorar Portfólio</motion.a>
                        </div>
                    </div>
                    <motion.a href="#portfolio" className="btn btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explorar Portfólio</motion.a>

                </section>

                {/* <section id="about" ref={aboutSectionRef}>
                    <div className="about-container">
                        <FadeIn className="about-image" ><img src="https://i.pinimg.com/1200x/45/2a/dc/452adcc3b92ab2338d1d8faa3b532e07.jpg" alt="foto" /></FadeIn>
                        <FadeIn className="about-text" >
                            <h2>Olá, me chamo Sérgio Eduardo, Diretor de Arte e Designer Gráfico.</h2>
                            <br></br>
                            <p>Desde cedo, descobri no design uma forma de expressão e impacto. O que começou como curiosidade virou
                                vocação — e, ao longo dos anos, fui lapidando meu olhar criativo, aprofundando técnicas e desenvolvendo uma visão
                                estratégica para comunicar com propósito.</p>
                            <br></br>
                            <p>Sou formado em Engenharia Informática pela Universidade Metodista de Angola, mas foi no universo visual que encontrei minha
                                verdadeira paixão. Desde então, venho construindo uma jornada que une arte, função e emoção.</p>
                            <p>
                                <br></br>
                                Já colaborei com marcas como a <strong>Universidade Metodista</strong>, <strong>Escola da Missão Metodista</strong> e a gigante das telecomunicações <strong>UNITEL</strong>,
                                contribuindo com projetos que vão desde identidade visual até campanhas digitais.
                            </p>
                            <div style={{ marginTop: '30px' }}>
                                    <MotionLink
                                        to="/contato" // Use 'to' em vez de 'href'
                                        className="btn btn-primary"
                                        data-cursor-magnetic
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 1.5 }}
                                    >
                                        Vamos Bater Um Papo?
                                    </MotionLink>
                            </div>
                        </FadeIn>
                    </div>
                </section> */}

                <section id="portfolio">
                    <div className="portfolio-container">
                        <FadeIn className="filter-buttons">
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Todos</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'branding' ? 'active' : ''}`} onClick={() => setActiveFilter('branding')}>Branding</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'webdesign' ? 'active' : ''}`} onClick={() => setActiveFilter('webdesign')}>Web Design</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'campanhas' ? 'active' : ''}`} onClick={() => setActiveFilter('campanhas')}>Campanhas</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'editorial' ? 'active' : ''}`} onClick={() => setActiveFilter('editorial')}>Editorial</button>
                        </FadeIn>

                        <Masonry
                            breakpointCols={masonryBreakpoints}
                            className="gallery masonry-grid"
                            columnClassName="masonry-column"
                        >
                            {isLoading
                                ? Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="gallery-item-skeleton" />
                                ))
                                : filteredProjects.map((project) => (
                                    <FadeIn key={project.slug}>
                                        <Link to={`/projeto/${project.slug}`} className="gallery-item">
                                            <ImageLoader
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="gallery-item-image"
                                            />
                                            <div className="gallery-item-overlay">
                                                <h3 className="gallery-item-title">{project.title}</h3>
                                            </div>
                                        </Link>
                                    </FadeIn>
                                ))}
                        </Masonry>
                    </div>
                </section>
            </>
        </PageTransition>
    );
};

export default HomePage;