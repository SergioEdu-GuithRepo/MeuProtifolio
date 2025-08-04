// src/components/CoverflowCarousel.tsx

import React from 'react';
import { motion, type PanInfo } from 'framer-motion';

interface CoverflowCarouselProps {
    images: string[];
}

// Criamos nosso próprio hook de estado para o carrossel, para manter o código limpo
const useCoverflow = (totalSlides: number) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    return { currentIndex, goToSlide, goToPrev, goToNext };
};

const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({ images }) => {
    const totalSlides = images.length;
    const { currentIndex, goToSlide, goToPrev, goToNext } = useCoverflow(totalSlides);

    // Função que é chamada ao final do gesto de arrastar
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // A 'velocidade' do arraste no eixo X
        const velocity = info.velocity.x;
        // O 'deslocamento' do arraste no eixo X
        const offset = info.offset.x;
        
        // Se o arraste foi rápido para a esquerda OU se arrastou mais de 50% para a esquerda
        if (velocity < -500 || offset < -100) {
            goToNext();
        } 
        // Se o arraste foi rápido para a direita OU se arrastou mais de 50% para a direita
        else if (velocity > 500 || offset > 100) {
            goToPrev();
        }
    };

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
    
    return (
        <div className="coverflow-carousel">
            {/* O motion.div agora envolve o palco do carrossel */}
            <motion.div
                className="carousel-stage"
                drag="x" // Permite arrastar horizontalmente
                dragConstraints={{ left: 0, right: 0 }} // Não limita o movimento, mas podemos ajustar
                dragElastic={0.2} // Adiciona um efeito "elástico" nas bordas
                onDragEnd={handleDragEnd} // Função para mudar de slide
                whileTap={{ cursor: "grabbing" }}
            >
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
            </motion.div>
            
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