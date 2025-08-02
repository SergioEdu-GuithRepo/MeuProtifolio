// src/components/FadeIn.tsx

import React, { forwardRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
}

// Usamos forwardRef para permitir que este componente receba uma ref e a passe para o div
const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(({ children, className }, ref) => {
    const [setElement, isIntersecting] = useIntersectionObserver({ triggerOnce: true });
    
    const combinedClassName = `fade-in ${isIntersecting ? 'visible' : ''} ${className || ''}`;

    // Combinamos a ref do intersection observer com a ref encaminhada
    const handleRef = (node: HTMLDivElement) => {
        setElement(node);
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    return (
        <div ref={handleRef} className={combinedClassName}>
            {children}
        </div>
    );
});

export default FadeIn;