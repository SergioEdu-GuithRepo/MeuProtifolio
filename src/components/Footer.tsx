// src/components/Footer.tsx
import React from 'react';
import FadeIn from '../components/FadeIn'; // 1. IMPORTE O COMPONENTE


const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <FadeIn className="footer-about">
                    <h3>Fiigura</h3>
                    <p>Design E Direção Criativa Para Marcas.</p>
                </FadeIn>
                <FadeIn className="footer-social">
                    <h3>Minhas Redes sociais</h3>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/sergiio.fiigura/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-cursor-magnetic><i className="fab fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/s%C3%A9rgio-eduardo-s%C3%A9rgio/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-cursor-magnetic><i className="fab fa-linkedin-in"></i></a>
                        <a href="https://www.behance.net/sergiofigura" target="_blank" rel="noopener noreferrer" aria-label="Behance" data-cursor-magnetic><i className="fab fa-behance"></i></a>
                    </div>
                </FadeIn>
                <FadeIn className="footer-contact">
                    <h3>Contato</h3>
                    <a href="mailto:sergiokuroko2@gmail.com" className="footer-email">sergiokuroko2@gmail.com</a>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="email" placeholder="Subscreva. Insira o seu e-mail..." />
                        <button type="submit" aria-label="Subscrever" data-cursor-magnetic><i className="fas fa-envelope"></i></button>
                    </form>
                </FadeIn>
            </div>
            <FadeIn className="footer-bottom">
                <p>© 2025 <strong>Sérgio Eduardo</strong>. Todos os direitos reservados.</p>
            </FadeIn>
        </footer>
    );
};

export default Footer;