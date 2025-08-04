// src/components/ThemeToggleButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
                    <i className="fas fa-moon"></i> // Ícone da lua para o tema claro
                ) : (
                    <i className="fas fa-sun"></i> // Ícone do sol para o tema escuro
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggleButton;