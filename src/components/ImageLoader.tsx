// src/components/ImageLoader.tsx

import React, { useState, memo } from 'react';

interface ImageLoaderProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    // ADICIONAMOS UM ESTILO DE DEBUG VISUAL
    const debugStyle = {
        background: isLoaded ? 'lightgreen' : 'indianred', // Verde quando carregado, vermelho quando não
    };

    return (
        // Adicionamos o debugStyle ao container
        <div className={`image-loader-container ${className || ''}`} style={debugStyle}>
            <div className={`skeleton ${isLoaded ? 'hidden' : ''}`}></div>
            <img
                src={src}
                alt={alt}
                className={`image-loader-img ${isLoaded ? 'visible' : ''}`}
                onLoad={handleImageLoad}
                loading="lazy"
                // Adicionamos um onError para debug
                onError={() => console.error(`Falha ao carregar a imagem: ${src}`)}
            />
        </div>
    );
};

export default memo(ImageLoader);