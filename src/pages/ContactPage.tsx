// src/pages/ContactPage.tsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { TextAnimate } from '../components/TextAnimate';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactPage: React.FC = () => {
    const [status, setStatus] = useState<FormStatus>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => { setStatus('success'); }, 2000);
    };

    return (
        <PageTransition>
            <div className="contact-page-wrapper">
                <Helmet>
                    <title>Contato - Fiigura | Diretor Criativo & Designer</title>
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
                                className="btn-send"
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
        </PageTransition>
    );
};

export default ContactPage;