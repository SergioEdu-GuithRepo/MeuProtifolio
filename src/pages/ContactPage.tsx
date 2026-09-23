// src/pages/ContactPage.tsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { TextAnimate } from '../components/TextAnimate';
import GrainGradient from '../components/GrainGradient';
import { useTheme } from '../context/ThemeContext';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactPage: React.FC = () => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const { theme } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => { setStatus('success'); }, 2000);
    };

    return (
        <PageTransition>
            <GrainGradient
                width="100%"
                height="auto"
                gradientFrom={theme === 'light' ? '#ffffff' : '#1a1a1a'}
                gradientTo={theme === 'light' ? '#e4e8eb' : '#050505'}
                driftGlowColor="#9EFF00"
            >
            <div className="contact-page-wrapper">
                <Helmet>
                    <title>Contato - Fiigura | Diretor Criativo & Designer</title>
                    <meta name="description" content="Fale com Sérgio Eduardo (Fiigura) sobre direção de arte, compositing fotográfico e projetos de branding, campanhas ou editorial." />
                    <meta property="og:title" content="Contato - Fiigura" />
                    <meta property="og:description" content="Vamos trabalhar juntos: fale com Sérgio Eduardo sobre o seu próximo projeto." />
                    <meta property="og:url" content="https://fiigura.space/contato" />
                </Helmet>

                {/* Formulário de contato, centralizado */}
                <motion.div
                    className="contact-form-column"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <div className="form-header">
                        <h2>
                            <TextAnimate as="span" by="word" animation="blurInUp" duration={0.6} once>
                                Vamos trabalhar
                            </TextAnimate>{' '}
                            <TextAnimate as="span" className="form-header-accent" by="word" animation="blurInUp" duration={0.3} delay={0.5} once>
                                juntos.
                            </TextAnimate>
                        </h2>
                    </div>

                    {status === 'success' ? (
                        <div className="form-success-message">
                            <h3>Obrigado!</h3>
                            <p>Sua mensagem foi enviada com sucesso.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="new-contact-form">
                            <div className="input-group">
                                <label htmlFor="name">Nome *</label>
                                <input id="name" type="text" name="name" required disabled={status === 'sending'} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email *</label>
                                <input id="email" type="email" name="email" required disabled={status === 'sending'} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="subject">Assunto *</label>
                                <input id="subject" type="text" name="subject" required disabled={status === 'sending'} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="message">Sua Mensagem *</label>
                                <textarea id="message" name="message" rows={5} required disabled={status === 'sending'}></textarea>
                            </div>
                            <motion.button
                                type="submit"
                                className="btn btn-primary btn-send"
                                data-cursor-magnetic
                                disabled={status === 'sending'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {status === 'sending' ? <span className="spinner"></span> : 'Enviar Mensagem'}
                            </motion.button>
                        </form>
                    )}
                </motion.div>
            </div>
            </GrainGradient>
        </PageTransition>
    );
};

export default ContactPage;