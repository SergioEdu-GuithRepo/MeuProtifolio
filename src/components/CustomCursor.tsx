// src/components/CustomCursor.tsx

import React from 'react';
import { useMousePosition } from '../hooks/useMousePosition';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
    // Nosso hook customizado que nos dá a posição atual do mouse (x, y)
    const { x, y } = useMousePosition();
    
    return (
        <>
            {/* O Rastro (dot maior e com mais atraso) */}
            <motion.div
                className="custom-cursor-trail"
                // Em vez de 'variants', passamos os estilos de animação diretamente
                // e usamos a física de mola para suavizar o movimento.
                animate={{ 
                    top: y, 
                    left: x 
                }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 25,
                    mass: 0.5
                }}
            />
            
            {/* O Cursor Principal (dot menor e mais rápido) */}
            <motion.div
                className="custom-cursor-main"
                animate={{ 
                    top: y, 
                    left: x 
                }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 700, 
                    damping: 35,
                    mass: 0.2
                }}
            />
        </>
    );
};

export default CustomCursor;