// src/components/ThemeToggleButton.tsx
// Botão de alternar tema com uma transição em círculo que se expande a partir do próprio
// botão, usando a View Transition API do navegador (com fallback para quem não suporta,
// como o Firefox). Inspirado no "Animated Theme Toggler" da Magic UI (componente livre) —
// implementação própria, adaptada para o ThemeContext e o botão já existentes no projeto.
import React, { useRef } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = async () => {
        const button = buttonRef.current;

        // Sem suporte à View Transition API (ex.: Firefox) ou sem o botão: troca direto, sem animação
        if (!button || !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            toggleTheme();
            return;
        }

        const { left, top, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            // flushSync força o React a aplicar a troca de tema (e a classe no <body>)
            // sincronamente, antes da View Transition tirar o "print" do novo estado
            flushSync(() => {
                toggleTheme();
            });
        });

        try {
            await transition.ready;
        } catch {
            return;
        }

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    };

    return (
        <motion.button
            ref={buttonRef}
            className="theme-toggle-button"
            onClick={handleClick}
            aria-label={`Mudar para o modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {/* Anima a transição entre os ícones */}
            <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {theme === 'light' ? (
                    <i className="fas fa-moon"></i>
                ) : (
                    <i className="fas fa-sun"></i>
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggleButton;
