

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';

const CustomCursor: React.FC = () => {
    const { x, y } = useMousePosition();
    const [cursorVariant, setCursorVariant] = useState('default');
    const [magneticTarget, setMagneticTarget] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Verifica se o mouse está sobre um elemento magnético
            const magneticElement = target.closest('[data-cursor-magnetic]');
            if (magneticElement) {
                const { x, y, width, height } = magneticElement.getBoundingClientRect();
                setMagneticTarget({ x, y, width, height });
                setCursorVariant('magnetic');
            }
            // Senão, verifica se está sobre texto
            else if (target.closest('h1, h2, h3, p, a, button, .filter-btn')) {
                setCursorVariant('text');
            }
            // Senão, volta ao padrão
            else {
                setCursorVariant('default');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const padding = 10; 

    const mainCursorAnimate = {
        top: cursorVariant === 'magnetic'
            ? (magneticTarget?.y ?? y) + (magneticTarget?.height ?? 0) / 2 // Vai para o PONTO CENTRAL Y do alvo
            : y,
        left: cursorVariant === 'magnetic'
            ? (magneticTarget?.x ?? x) + (magneticTarget?.width ?? 0) / 2 // Vai para o PONTO CENTRAL X do alvo
            : x,
        width: cursorVariant === 'magnetic'
            ? (magneticTarget?.width ?? 0) + padding * 2
            : (cursorVariant === 'text' ? 4 : 20),
        height: cursorVariant === 'magnetic'
            ? (magneticTarget?.height ?? 0) + padding * 2
            : (cursorVariant === 'text' ? 60 : 20),
        borderRadius: cursorVariant === 'text' ? '0px' : (cursorVariant === 'magnetic' ? '20px' : '50%'),
        borderWidth: cursorVariant === 'magnetic' ? '0px' : '2px',
        backgroundColor: cursorVariant === 'magnetic' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)',
        x: '-50%', // Usa o transform para centralizar o cursor em seu próprio eixo
        y: '-50%',
    };

    // Animações para o rastro
    const trailCursorAnimate = {
        top: y,
        left: x,
        x: '-50%', // CORREÇÃO: Adiciona a centralização
        y: '-50%', // CORREÇÃO: Adiciona a centralização
        scale: cursorVariant !== 'default' ? 0 : 1, // Esconde o rastro em qualquer estado que não seja o padrão
    };

    useEffect(() => {
        document.body.setAttribute('data-cursor-variant', cursorVariant);
    }, [cursorVariant]);

    return (
        <>
            <motion.div
                className="custom-cursor-trail"
                animate={trailCursorAnimate}
                transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
            />
            <motion.div
                className="custom-cursor-main"
                animate={mainCursorAnimate}
                transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.2 }}
            />
        </>
    );
};

export default CustomCursor;

