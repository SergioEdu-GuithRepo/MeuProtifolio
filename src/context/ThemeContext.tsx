// src/context/ThemeContext.tsx

import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

// Define a "forma" do nosso contexto
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

// Cria o contexto com um valor padrão
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Cria o Provedor, que vai gerenciar o estado do tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Lógica para determinar o estado inicial
    const getInitialTheme = () => {
        // 1. Verifica se há um tema salvo no localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // 2. Se não, verifica a preferência do sistema operacional do usuário
        const userPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        return userPrefersLight ? 'light' : 'dark';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Efeito que roda sempre que o 'theme' muda
    useEffect(() => {
        // 1. Salva a nova escolha no localStorage
        localStorage.setItem('theme', theme);

        // 2. Adiciona ou remove a classe 'light-mode' do <body>
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};