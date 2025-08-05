// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importe motion
import FadeIn from './FadeIn';


const Header: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setScrolled] = useState(false);
    const navigate = useNavigate(); // Hook para navegação programática
    const location = useLocation();

    // Lógica de header com scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fecha o menu ao mudar de rota
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Impede o scroll do body quando o menu está aberto
    useEffect(() => {
        document.body.classList.toggle('menu-open', isMenuOpen);
    }, [isMenuOpen]);

    const headerClasses = isScrolled || location.pathname !== '/' ? 'scrolled' : '';


    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();

        // Não faz nada se já estamos na página (ou âncora)
        if (path === location.pathname + location.hash) return;

        document.body.classList.add('fade-out');
        setTimeout(() => {
            navigate(path);
            // O fade-in será gerenciado pelo Layout.tsx
        }, 400); // Deve corresponder à duração da transição no CSS
    };


    return (
        <>
            <header className={headerClasses}>
                <div className="navbar">
                    <Link to="/" data-cursor-magnetic className="logo">Fiigura</Link>
                    <FadeIn className="footer-social">
                        <div className="social-icons">
                            <a href="#" target="_blank" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" target="_blank" aria-label="Vimeo"><i className="fab fa-vimeo-v"></i></a>
                            <a href="#" target="_blank" aria-label="Behance"><i className="fab fa-behance"></i></a>
                        </div>
                    </FadeIn>
                    <button className="menu-toggle" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
                        {/* Substitua "Menu" por um ícone do Font Awesome */}
                        <i className="fas fa-bars"></i>
                    </button>
                </div>

            </header>

            <div className={`fullscreen-menu ${isMenuOpen ? 'is-active' : ''}`}>
                <motion.button
                    className="close-menu-btn"
                    aria-label="Fechar menu"
                    onClick={() => setMenuOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }} // Gira e aumenta no hover
                    whileTap={{ scale: 0.9 }}
                >
                    <i className="fas fa-times"></i>
                </motion.button>

                <nav>
                    {/* Substitua os <Link> por <a> com onClick */}
                    <a href="/" onClick={(e) => handleNavClick(e, '/')} style={{ '--i': 0 } as React.CSSProperties}>Home</a>
                    <a href="/#portfolio" onClick={(e) => handleNavClick(e, '/#portfolio')} style={{ '--i': 1 } as React.CSSProperties}>Portfolio</a>
                    <a href="/contato" onClick={(e) => handleNavClick(e, '/contato')} style={{ '--i': 2 } as React.CSSProperties}>Contato</a>
                </nav>
            </div>
        </>
    );
};

export default Header;