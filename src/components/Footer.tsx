// src/components/Footer.tsx
import React from 'react';
import FadeIn from '../components/FadeIn'; // 1. IMPORTE O COMPONENTE


const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <FadeIn className="footer-about">
                    <h3>Fiigura</h3>
                    <p>Design estratégico e direção criativa para marcas com propósito.</p>
                </FadeIn>
                <FadeIn className="footer-social">
                    <h3>Siga-me</h3>
                    <div className="social-icons">
                        <a href="#" target="_blank" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" target="_blank" aria-label="Vimeo"><i className="fab fa-vimeo-v"></i></a>
                        <a href="#" target="_blank" aria-label="Behance"><i className="fab fa-behance"></i></a>
                    </div>
                </FadeIn>
                <FadeIn className="footer-contact">
                    <h3>Contato</h3>
                    <a href="mailto:seuemail@exemplo.com" className="footer-email">seuemail@exemplo.com</a>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="email" placeholder="Subscreva. Insira o seu e-mail..." />
                        <button type="submit" aria-label="Subscrever"><i className="fas fa-envelope"></i></button>
                    </form>
                </FadeIn>
            </div>
            <FadeIn className="footer-bottom">
                <p>© 2023 [Seu Nome]. Todos os direitos reservados.</p>
            </FadeIn>
        </footer>
    );
};

export default Footer;