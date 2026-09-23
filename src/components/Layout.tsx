// src/components/Layout.tsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from './CustomCursor'; // Importe o novo componente
import ThemeToggleButton from './ThemeToggleButton'; // Importe o botão




const Layout: React.FC = () => {
    const location = useLocation();

    // Efeito para rolar para o topo em cada mudança de rota — ou até a âncora (#portfolio, etc.), se houver uma
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const timeout = setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo(0, 0);
                }
            }, 50);
            return () => clearTimeout(timeout);
        }
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash]);

    // Lógica do cursor customizado
    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            (cursor as HTMLElement).style.left = `${e.clientX}px`;
            (cursor as HTMLElement).style.top = `${e.clientY}px`;
        };

        window.addEventListener('mousemove', moveCursor);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    // Efeito de fade-in no carregamento da página
    useEffect(() => {
        document.body.classList.remove('fade-out');
    }, [location]);


    useEffect(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Adiciona a classe para iniciar a animação de fade-out
            preloader.classList.add('loaded');

            // Opcional: remove o elemento do DOM após a animação
            // para não interferir com cliques, etc.
            const handleTransitionEnd = () => {
                preloader.remove();
            };
            preloader.addEventListener('transitionend', handleTransitionEnd);

            return () => {
                preloader.removeEventListener('transitionend', handleTransitionEnd);
            };
        }
    }, []);

    

    return (
        <>
            {/*<div id="preloader">
                <div className="loader-logo">Fiigura</div>
            </div>  */}

            {/* Título, description e OG de reserva — cada página pode sobrescrever com seu próprio <Helmet> */}
            <Helmet>
                <title>Fiigura - Design e Direção Criativa</title>
                <meta name="description" content="Fiigura — Design e direção criativa para marcas. Compositing fotográfico avançado e retoque conceitual por Sérgio Eduardo." />
                <meta property="og:title" content="Fiigura — Direção de Arte" />
                <meta property="og:description" content="Design e direção criativa para marcas. Compositing fotográfico avançado e retoque conceitual." />
                <meta property="og:url" content="https://fiigura.space/" />
            </Helmet>

            <Header />

            <main>
                {/* Outlet renderiza o componente da rota atual (HomePage, ContactPage, etc.) */}
                <Outlet />
            </main>

            <Footer />

            <a href="#" id="back-to-top" aria-label="Voltar ao topo"><i className="fas fa-arrow-up"></i></a>
            <ThemeToggleButton />
             <CustomCursor />
        </>
    );
};

export default Layout;