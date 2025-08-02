// src/components/PageTransition.tsx

import React from 'react';
import { motion } from 'framer-motion';

// Este componente envolve o conteúdo de cada página
// para aplicar uma animação de entrada e saída.
const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            // Estado inicial: invisível e 20px para baixo
            initial={{ opacity: 0, y: 20 }}
            // Estado final (animado): visível e na posição original
            animate={{ opacity: 1, y: 0 }}
            // Estado de saída: invisível e 20px para cima
            exit={{ opacity: 0, y: -20 }}
            // Duração da transição
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;