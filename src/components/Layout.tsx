// src/components/Layout.tsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from './CustomCursor'; // Importe o novo componente


const Layout: React.FC = () => {
    const location = useLocation();

    // Efeito para rolar para o topo em cada mudança de rota
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

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
                <div className="loader-logo">ICONI</div>
            </div>  */}

            <Header />

            <main>
                {/* Outlet renderiza o componente da rota atual (HomePage, ContactPage, etc.) */}
                <Outlet />
            </main>

            <Footer />

            <a href="#" id="back-to-top" aria-label="Voltar ao topo"><i className="fas fa-arrow-up"></i></a>
             <CustomCursor />
        </>
    );
};

export default Layout;