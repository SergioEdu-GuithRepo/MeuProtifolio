// src/components/BlurHighlight.tsx
// Parágrafo animado: entra desfocado e com opacidade reduzida, ganha foco ao rolar a tela,
// e trechos escolhidos do texto "acendem" numa cor de destaque, com um efeito de varredura.
// Inspirado na ideia do componente "Blur Highlight" da React Bits Pro (biblioteca paga,
// cujo código-fonte não tenho acesso) — implementação própria, escrita do zero com
// framer-motion (já usado no projeto).
import { useRef, type ElementType } from 'react';
import { motion, useInView } from 'framer-motion';

interface HighlightBit {
    text: string;
    /** Se o texto se repete, escolhe qual ocorrência destacar (1 = a primeira) */
    occurrence?: number;
}

interface BlurHighlightProps {
    /** O texto a ser exibido (string simples, sem JSX aninhado) */
    children: string;
    /** Trechos a destacar: uma string (destaca todas as ocorrências) ou { text, occurrence } */
    highlightedBits?: (string | HighlightBit)[];
    /** Cor do texto destacado */
    highlightColor?: string;
    /** Cor do texto quando está sobre o destaque (precisa contrastar com highlightColor) */
    highlightTextColor?: string;
    /** Elemento HTML a renderizar */
    as?: ElementType;
    /** Classe CSS adicional */
    className?: string;
    /** Desfoque inicial, em pixels */
    blurAmount?: number;
    /** Opacidade quando fora da tela */
    inactiveOpacity?: number;
    /** Atraso da animação de desfoque, em segundos */
    blurDelay?: number;
    /** Duração da animação de desfoque, em segundos */
    blurDuration?: number;
    /** Atraso da animação de destaque, em segundos */
    highlightDelay?: number;
    /** Duração da animação de destaque, em segundos */
    highlightDuration?: number;
    /** Direção da varredura do destaque */
    highlightDirection?: 'left' | 'right' | 'top' | 'bottom';
    /** Se a animação roda só uma vez */
    once?: boolean;
}

interface Segment {
    text: string;
    highlighted: boolean;
}

// Divide o texto em trechos normais e destacados, respeitando a ordem e as ocorrências pedidas
function splitIntoSegments(text: string, bits: (string | HighlightBit)[]): Segment[] {
    const ranges: Array<{ start: number; end: number }> = [];

    bits.forEach((bit) => {
        const search = typeof bit === 'string' ? bit : bit.text;
        const wantedOccurrence = typeof bit === 'string' ? undefined : bit.occurrence;
        if (!search) return;

        let fromIndex = 0;
        let occurrenceCount = 0;
        while (true) {
            const foundAt = text.indexOf(search, fromIndex);
            if (foundAt === -1) break;
            occurrenceCount++;
            if (wantedOccurrence === undefined || occurrenceCount === wantedOccurrence) {
                ranges.push({ start: foundAt, end: foundAt + search.length });
            }
            fromIndex = foundAt + search.length;
        }
    });

    ranges.sort((a, b) => a.start - b.start);

    const segments: Segment[] = [];
    let cursor = 0;
    ranges.forEach(({ start, end }) => {
        if (start < cursor) return; // evita sobreposição entre destaques
        if (start > cursor) segments.push({ text: text.slice(cursor, start), highlighted: false });
        segments.push({ text: text.slice(start, end), highlighted: true });
        cursor = end;
    });
    if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false });

    return segments;
}

export default function BlurHighlight({
    children,
    highlightedBits = [],
    highlightColor = 'var(--accent-color)',
    highlightTextColor = '#0a0a0a',
    as: Component = 'p',
    className = '',
    blurAmount = 8,
    inactiveOpacity = 0.3,
    blurDelay = 0,
    blurDuration = 0.8,
    highlightDelay = 0.4,
    highlightDuration = 1,
    highlightDirection = 'left',
    once = true,
}: BlurHighlightProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once, amount: 0.5 });
    const segments = splitIntoSegments(children, highlightedBits);

    const MotionComponent = motion(Component as ElementType);
    const gradientAngle = highlightDirection === 'right' ? 'to left'
        : highlightDirection === 'top' ? 'to bottom'
        : highlightDirection === 'bottom' ? 'to top'
        : 'to right';
    const backgroundPosition = highlightDirection === 'right' ? 'right'
        : highlightDirection === 'bottom' ? 'bottom'
        : highlightDirection === 'top' ? 'top'
        : 'left';
    const isVertical = highlightDirection === 'top' || highlightDirection === 'bottom';
    const finalBackgroundSize = '100% 100%';
    const initialBackgroundSize = isVertical ? '100% 0%' : '0% 100%';
    let highlightedCount = 0;

    return (
        <MotionComponent
            ref={ref}
            className={className}
            initial={{ filter: `blur(${blurAmount}px)`, opacity: inactiveOpacity }}
            animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : { filter: `blur(${blurAmount}px)`, opacity: inactiveOpacity }}
            transition={{ delay: blurDelay, duration: blurDuration, ease: 'easeOut' }}
        >
            {segments.map((segment, index) => {
                if (!segment.highlighted) return <span key={index}>{segment.text}</span>;

                const order = highlightedCount++;
                return (
                    <motion.mark
                        key={index}
                        style={{
                            // box-decoration-break: clone faz o fundo/borda se repetirem em cada
                            // linha, caso a frase destacada quebre — sem duplicar o texto em si
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            backgroundImage: `linear-gradient(${gradientAngle}, ${highlightColor}, ${highlightColor})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition,
                            borderRadius: '5px',
                            padding: '0.05em 0.35em',
                            fontWeight: 600,
                        }}
                        initial={{ backgroundSize: initialBackgroundSize, color: 'var(--secondary-color)' }}
                        animate={
                            isInView
                                ? { backgroundSize: finalBackgroundSize, color: highlightTextColor }
                                : { backgroundSize: initialBackgroundSize, color: 'var(--secondary-color)' }
                        }
                        transition={{
                            delay: highlightDelay + order * 0.15,
                            duration: highlightDuration,
                            ease: 'easeInOut',
                        }}
                    >
                        {segment.text}
                    </motion.mark>
                );
            })}
        </MotionComponent>
    );
}
