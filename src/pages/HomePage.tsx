// src/pages/HomePage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Componentes
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/FadeIn';
import ImageLoader from '../components/ImageLoader';
import { TextAnimate } from '../components/TextAnimate';
import GrainGradient from '../components/GrainGradient';
import BlurHighlight from '../components/BlurHighlight';
import { useTheme } from '../context/ThemeContext';

// Conexão com Sanity
import sanityClient from '../sanityClient';
import { type ProjectCategory, categoryLabels } from '../types/data';

import Masonry from 'react-masonry-css';

const MotionLink = motion(Link);


// --- Tipagem para os dados ---
interface SanityProject {
    title: string;
    slug: string;
    imageUrl: string;
    category: ProjectCategory;
}

// Marcas com que já trabalhou/teve parceria (placeholder em texto até termos os logos reais)
const brandPartners = ['Unitel', 'Zoom', 'Cuca', 'Pepsi', 'Zumol', 'Natu'];

const HomePage: React.FC = () => {
    // --- Estados do Componente ---
    const { theme } = useTheme();
    const [projects, setProjects] = useState<SanityProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all');

    // Estados e Refs do Hero
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const heroRef = useRef<HTMLElement>(null);
    const aboutSectionRef = useRef<HTMLElement>(null); // 1. MUDAMOS A REF PARA A SEÇÃO INTEIRA
    const lastKnownSide = useRef(0);

    // Imagens do hero: os 2 projetos mais recentes do portfólio (a query já vem ordenada por _createdAt desc)
    const heroImages = projects.length > 0
        ? projects.slice(0, 2).map(p => p.imageUrl)
        : [
            'https://cdn.sanity.io/images/9esw1hz4/production/b79eab7419bf769e77499883c6c2c893b57602ed-2400x1507.jpg',
            'https://cdn.sanity.io/images/9esw1hz4/production/d35a6037e87743d31d19411de743e9f186f6edec-1926x2400.jpg',
        ];

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

                // Aplicamos a transformação no wrapper que contém o about-container E a faixa de marcas,
                // para os dois se moverem juntos e nunca ficarem sobrepostos
                const container = sectionElement.querySelector('.about-parallax-wrapper');
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

    // Efeito para o slideshow do Hero: hover na metade esquerda/direita avança/recua a imagem
    useEffect(() => {
        const heroElement = heroRef.current;
        if (!heroElement || heroImages.length === 0) return;
        const handleMouseMove = (e: MouseEvent) => {
            const side = e.clientX / heroElement.offsetWidth < 0.5 ? 0 : 1;
            if (side !== lastKnownSide.current) {
                lastKnownSide.current = side;
                setActiveImageIndex(prev => {
                    const direction = side === 1 ? 1 : -1;
                    return (prev + direction + heroImages.length) % heroImages.length;
                });
            }
        };
        heroElement.addEventListener('mousemove', handleMouseMove);
        return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }, [heroImages.length]);

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
                    <title>Fiigura - Design e Direção Criativa</title>
                    <meta name="description" content="Portfólio de Sérgio Eduardo (Fiigura): direção de arte, compositing fotográfico avançado e retoque conceitual para marcas como Unitel, Zoom, Cuca, Pepsi, Zumol e Natu." />
                    <meta property="og:title" content="Fiigura - Design e Direção Criativa" />
                    <meta property="og:description" content="Direção de arte, compositing fotográfico avançado e retoque conceitual para marcas." />
                    <meta property="og:url" content="https://fiigura.space/" />
                </Helmet>

                <section id="hero" ref={heroRef}>
                    {heroImages.map((imageUrl, index) => (
                        <div
                            key={`${imageUrl}-${index}`}
                            className={`hero-slide ${activeImageIndex === index ? 'active-slide' : ''}`}
                            style={{ backgroundImage: `url('${imageUrl}')` }}
                        >
                            <div className="hero-content">
                                <span className="hero-kicker">Fiigura — Direção de Arte</span>
                                <TextAnimate
                                    as="h2"
                                    by="word"
                                    animation="blurInUp"
                                    duration={0.8}
                                    once
                                    style={{ color: 'white', fontWeight: 700 }}
                                >
                                    DIREÇÃO CRIATIVA
                                </TextAnimate>
                                <motion.a href="#portfolio" className="btn btn-secondary" data-cursor-magnetic whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explorar Portfólio</motion.a>
                            </div>
                        </div>
                    ))}
                    {heroImages.length > 1 && (
                        <div className="hero-dots" aria-hidden="true">
                            {heroImages.map((_, index) => (
                                <span key={index} className={`hero-dot ${activeImageIndex === index ? 'active' : ''}`} />
                            ))}
                        </div>
                    )}
                </section>

                <section id="about" ref={aboutSectionRef}>
                    <GrainGradient
                        width="100%"
                        height="auto"
                        className="about-grain-bg"
                        gradientFrom={theme === 'light' ? '#f4f4f4' : '#242424'}
                        gradientTo={theme === 'light' ? '#e0e0e0' : '#141414'}
                    >
                    <div className="about-parallax-wrapper">
                        <div className="about-container">
                            <FadeIn className="about-image">
                                {/* TODO: substituir por uma foto sua real (retrato ou no ambiente de trabalho) */}
                                <img src="https://i.pinimg.com/1200x/45/2a/dc/452adcc3b92ab2338d1d8faa3b532e07.jpg" alt="Sérgio Eduardo" />
                            </FadeIn>
                            <FadeIn className="about-text">
                                <TextAnimate as="h2" by="word" animation="blurInUp" duration={1} once>
                                    Olá, me chamo Sérgio Eduardo, Diretor de Arte e Designer Gráfico por trás da Fiigura.
                                </TextAnimate>
                                <br></br>
                                <BlurHighlight highlightedBits={['compositing fotográfico avançado', 'retoque conceitual']}>
                                    {'Minha maior força é o compositing fotográfico avançado e o retoque conceitual — unir fotografia, CGI e composição em camadas para transformar uma ideia em uma imagem que parece impossível de capturar com uma única fotografia.'}
                                </BlurHighlight>
                                <br></br>
                                <p>Sou formado em Engenharia Informática pela Universidade Metodista de Angola, mas foi no universo visual que encontrei
                                    minha verdadeira paixão. Desde então, venho construindo uma jornada que une arte, função e emoção.</p>
                                <p>
                                    <br></br>
                                    Hoje sou o parceiro criativo principal da <strong>UNITEL</strong>, produzindo key visuals, capas editoriais para a
                                    revista <strong>Zoom</strong> e campanhas institucionais. Assino também boa parte do product art e compositing de marcas
                                    de bebidas como <strong>Cuca</strong>, <strong>Pepsi</strong>, <strong>Zumol</strong> e <strong>Natu</strong>.
                                </p>
                                <div style={{ marginTop: '30px' }}>
                                        <MotionLink
                                            to="/contato"
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

                        {/* Marcas com que já trabalhou/teve parceria — placeholders em texto.
                            TODO: trocar por logotipos reais (SVG/PNG, de preferência em branco/monocromático) */}
                        <FadeIn className="brands-marquee-wrapper">
                            <div className="brands-marquee-track">
                                {[...brandPartners, ...brandPartners].map((brand, index) => (
                                    <span key={index} className="brand-item">{brand}</span>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                    </GrainGradient>
                </section>

                <section id="portfolio">
                    <GrainGradient
                        width="100%"
                        height="auto"
                        className="portfolio-grain-bg"
                        gradientFrom={theme === 'light' ? '#ffffff' : '#1a1a1a'}
                        gradientTo={theme === 'light' ? '#e4e8eb' : '#050505'}
                    >
                    <div className="portfolio-container">
                        <FadeIn className="filter-buttons">
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Todos</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'branding' ? 'active' : ''}`} onClick={() => setActiveFilter('branding')}>{categoryLabels.branding}</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'campanhas' ? 'active' : ''}`} onClick={() => setActiveFilter('campanhas')}>{categoryLabels.campanhas}</button>
                            <button data-cursor-magnetic className={`filter-btn ${activeFilter === 'editorial' ? 'active' : ''}`} onClick={() => setActiveFilter('editorial')}>{categoryLabels.editorial}</button>
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
                                                <span className="gallery-item-category">{categoryLabels[project.category] ?? project.category}</span>
                                                <h3 className="gallery-item-title">{project.title}</h3>
                                                <span className="gallery-item-cta">Ver Projeto <i className="fas fa-arrow-right"></i></span>
                                            </div>
                                        </Link>
                                    </FadeIn>
                                ))}
                        </Masonry>
                    </div>
                    </GrainGradient>
                </section>
            </>
        </PageTransition>
    );
};

export default HomePage;