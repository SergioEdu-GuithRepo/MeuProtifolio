// src/components/CustomCursor.tsx

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [variant, setVariant] = useState('default');
    const [magneticTarget, setMagneticTarget] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

    // Usa motion values para uma animação de POSIÇÃO suave
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    const trailSpringConfig = { damping: 30, stiffness: 150, mass: 0.8 };
    const trailSpringX = useSpring(cursorX, trailSpringConfig);
    const trailSpringY = useSpring(cursorY, trailSpringConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            const magneticElement = target.closest('[data-cursor-magnetic]');

            if (magneticElement) {
                const { x, y, width, height } = magneticElement.getBoundingClientRect();
                setMagneticTarget({ x, y, width, height });
                setVariant('magnetic');
            } else if (target.closest('h1, h2, h3, p, a, button, .filter-btn')) {
                setVariant('text');
            } else {
                setVariant('default');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    const padding = 10;

    // As variantes de APARÊNCIA que serão animadas
    const mainVariants = {
        default: {
            width: 20,
            height: 20,
            borderRadius: '50%',
            borderWidth: '2px',
            backgroundColor: 'transparent',
            mixBlendMode: 'difference',
        },
        text: {
            width: 4,
            height: 30,
            borderRadius: '0px',
            borderWidth: '0px',
            backgroundColor: 'var(--accent-color)',
            mixBlendMode: 'normal',
        },
        magnetic: {
            width: (magneticTarget?.width ?? 0) + padding * 2,
            height: (magneticTarget?.height ?? 0) + padding * 2,
            borderRadius: '20px',
            borderWidth: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            mixBlendMode: 'difference',
        },
    };

    const trailVariants = {
        default: { scale: 1 },
        text: { scale: 0 },
        magnetic: { scale: 0 },
    };
    
    // A CORREÇÃO ESTÁ AQUI: Controlamos a posição diretamente com `style`
    // e a aparência com `animate` + `variants`.
    return (
        <>
            <motion.div
                className="custom-cursor-trail"
                style={{
                    translateX: trailSpringX,
                    translateY: trailSpringY,
                    x: '-50%', y: '-50%',
                }}
                variants={trailVariants}
                animate={variant}
            />
            <motion.div
                className="custom-cursor-main"
                style={{
                    translateX: variant === 'magnetic'
                        ? (magneticTarget?.x ?? 0) + (magneticTarget?.width ?? 0) / 2
                        : springX,
                    translateY: variant === 'magnetic'
                        ? (magneticTarget?.y ?? 0) + (magneticTarget?.height ?? 0) / 2
                        : springY,
                    x: '-50%', y: '-50%',
                }}
                variants={mainVariants}
                animate={variant}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </>
    );
};

export default CustomCursor;