// src/components/CoverflowCarousel.tsx

import React, { useState } from 'react';

interface CoverflowCarouselProps {
    images: string[];
}

const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({ images }) => {
    // 'useState' para controlar qual slide é o ativo
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalSlides = images.length;

    if (totalSlides === 0) {
        return <p>Nenhuma imagem para exibir.</p>;
    }

    if (totalSlides === 1) {
        return (
            <div className="coverflow-carousel">
                <div className="carousel-stage">
                    <div className="carousel-slide active">
                        <img src={images[0]} alt="Imagem do Projeto" />
                    </div>
                </div>
            </div>
        );
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="coverflow-carousel">
            <div className="carousel-stage">
                {images.map((url, index) => {
                    let className = 'carousel-slide';
                    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    const nextIndex = (currentIndex + 1) % totalSlides;

                    if (index === currentIndex) {
                        className += ' active';
                    } else if (index === prevIndex) {
                        className += ' prev';
                    } else if (index === nextIndex) {
                        className += ' next';
                    }

                    return (
                        <div key={index} className={className} onClick={() => goToSlide(index)}>
                            <img src={url} alt={`Imagem ${index + 1} do projeto`} />
                        </div>
                    );
                })}
            </div>
            <div className="carousel-navigation">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir para o slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default CoverflowCarousel;