// src/pages/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Componentes
import PageTransition from '../components/PageTransition';
import GrainGradient from '../components/GrainGradient';
import { useTheme } from '../context/ThemeContext';

const MotionLink = motion(Link);

const NotFoundPage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <PageTransition>
            <Helmet>
                <title>Página não encontrada - Fiigura</title>
            </Helmet>
            <GrainGradient
                width="100%"
                height="100vh"
                gradientFrom={theme === 'light' ? '#ffffff' : '#1a1a1a'}
                gradientTo={theme === 'light' ? '#e4e8eb' : '#050505'}
                driftGlowColor="#9EFF00"
            >
                <div className="notfound-container">
                    <span className="notfound-code">404</span>
                    <h1>Esta página se perdeu no meio da composição.</h1>
                    <p>A página que você procura não existe ou foi movida.</p>
                    <MotionLink
                        to="/"
                        className="btn btn-primary"
                        data-cursor-magnetic
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Voltar para o início
                    </MotionLink>
                </div>
            </GrainGradient>
        </PageTransition>
    );
};

export default NotFoundPage;
