// src/pages/ContactPage.tsx
import React, { useState } from 'react'; // Importe useState
import { Helmet } from 'react-helmet-async';
import FadeIn from '../components/FadeIn'; // 1. IMPORTE O COMPONENTE
import { motion } from 'framer-motion';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactPage: React.FC = () => {

    const [status, setStatus] = useState<FormStatus>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simula uma chamada de API com um atraso de 2 segundos
        setTimeout(() => {
            // Em um projeto real, aqui você faria a chamada a uma API (ex: EmailJS, Formspree)
            // e definiria o status com base na resposta.
            // Para nosso exemplo, vamos simular sucesso:
            setStatus('success');

            // Para testar o estado de erro, descomente a linha abaixo e comente a de cima:
            // setStatus('error');
        }, 2000);
    };
    return (
        <>
            <Helmet>
                <title>Contato - Fiigura | Diretor Criativo & Designer</title>
            </Helmet>

            <section className="contact-hero" style={{ backgroundImage: `url('https://tse1.mm.bing.net/th/id/OIP.tmpjxJ6647c53GA1XscMWwHaEU?rs=1&pid=ImgDetMain&o=7&rm=3')` }}>
                <FadeIn className="contact-hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }} // Anima após o fade da página
                    >
                        Entre em Contato
                    </motion.h1>                </FadeIn>
            </section>

            <div className="page-container contact-page">
                <div className="contact-content-grid">
                    <FadeIn className="contact-form-container">
                        <h2>Fale Conosco</h2>
                        <p>Se tiver alguma dúvida ou uma ideia de projeto, preencha o formulário abaixo.</p>

                        {/* A mágica acontece aqui: renderização condicional */}
                        {status === 'success' ? (
                            <div className="form-success-message">
                                <h3>Obrigado!</h3>
                                <p>Sua mensagem foi enviada. Entrarei em contato em breve.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <label htmlFor="name">Nome</label>
                                <input type="text" id="name" name="name" placeholder="Seu Nome Completo" required disabled={status === 'sending'} />
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" required disabled={status === 'sending'} />
                                <label htmlFor="subject">Assunto</label>
                                <input type="text" id="subject" name="subject" placeholder="Assunto da Mensagem" required disabled={status === 'sending'} />
                                <label htmlFor="message">Mensagem</label>
                                <textarea id="message" name="message" rows={6} placeholder="Escreva sua mensagem aqui..." required disabled={status === 'sending'}></textarea>

                                <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        'Enviar Mensagem'
                                    )}
                                </button>
                                {status === 'error' && (
                                    <p className="form-error-message">Ocorreu um erro. Por favor, tente novamente.</p>
                                )}
                            </form>
                        )}
                    </FadeIn>
                    <FadeIn className="contact-info-container">
                        <FadeIn className="info-block">
                            <i className="fas fa-phone-alt"></i>
                            <h3>Telefone</h3>
                            <p>(11) 98765-4321</p>
                        </FadeIn>
                        <FadeIn className="info-block">
                            <i className="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <a href="mailto:contato@iconi.com">contato@iconi.com</a>
                        </FadeIn>
                        <FadeIn className="info-block">
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>Nosso Endereço</h3>
                            <p>Av. Paulista, 1234<br />São Paulo, SP, Brasil</p>
                        </FadeIn>
                    </FadeIn>
                </div>
                <FadeIn className="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.145903975137!2d-46.65889138554287!3d-23.56322476769971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1678886543210!5m2!1spt-BR!2sbr" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localização no Google Maps"></iframe>
                </FadeIn>
            </div>
        </>
    );
};

export default ContactPage;