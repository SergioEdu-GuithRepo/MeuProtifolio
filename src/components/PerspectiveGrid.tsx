// src/components/PerspectiveGrid.tsx
// Background "grade de perspectiva": um piso de grade em fuga até o horizonte, com
// linhas brilhantes que avançam continuamente em direção à câmera — visual tech/synthwave,
// em loop infinito. Escrito do zero em Canvas 2D (sem dependências novas).
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface PerspectiveGridProps {
    /** Largura do contêiner */
    width?: string | number;
    /** Altura do contêiner */
    height?: string | number;
    /** Classes CSS adicionais */
    className?: string;
    /** Conteúdo renderizado por cima do efeito */
    children?: ReactNode;
    /** Multiplicador de velocidade da animação */
    speed?: number;
    /** Cor das linhas da grade (hex ou rgb) */
    lineColor?: string;
    /** Cor de fundo */
    backgroundColor?: string;
    /** Posição do horizonte, de 0 (topo) a 1 (rodapé) */
    horizonY?: number;
    /** Número de colunas verticais convergindo para o horizonte */
    columns?: number;
    /** Número de linhas horizontais visíveis a cada momento */
    rows?: number;
    /** Intensidade do brilho (glow) nas linhas */
    glow?: number;
    style?: CSSProperties;
}

export default function PerspectiveGrid({
    width = '100%',
    height = '100%',
    className = '',
    children,
    speed = 1,
    lineColor = '#9EFF00',
    backgroundColor = '#0a0a0a',
    horizonY = 0.42,
    columns = 16,
    rows = 14,
    glow = 0.6,
    style,
}: PerspectiveGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0;
        let h = 0;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            w = Math.max(rect.width, 1);
            h = Math.max(rect.height, 1);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let animationId = 0;
        let t = 0; // fase de animação, 0..1, em loop
        let lastTs = performance.now();

        const render = (ts: number) => {
            const dt = Math.min((ts - lastTs) / 1000, 0.05);
            lastTs = ts;
            if (!prefersReducedMotion) {
                t = (t + dt * speed * 0.25) % 1;
            }

            const hy = h * horizonY;
            const vanishX = w / 2;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);

            // Brilho suave logo acima do horizonte
            const horizonGlowGrad = ctx.createLinearGradient(0, hy - 80, 0, hy + 10);
            horizonGlowGrad.addColorStop(0, 'rgba(0,0,0,0)');
            horizonGlowGrad.addColorStop(1, hexToRgba(lineColor, 0.18 * glow));
            ctx.fillStyle = horizonGlowGrad;
            ctx.fillRect(0, hy - 80, w, 90);

            ctx.strokeStyle = lineColor;
            ctx.shadowColor = lineColor;

            // Linhas verticais convergindo para o ponto de fuga no horizonte
            ctx.shadowBlur = 4 * glow;
            ctx.lineWidth = 1;
            const halfCols = columns / 2;
            for (let i = -halfCols; i <= halfCols; i++) {
                const bottomX = vanishX + (i / halfCols) * w * 0.9;
                const alpha = 0.5;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(vanishX, hy);
                ctx.lineTo(bottomX, h);
                ctx.stroke();
            }

            // Linhas horizontais "avançando" em direção à câmera (loop contínuo)
            for (let j = 0; j < rows; j++) {
                const depth = j + t;
                const normalized = 1 / (1 + depth * 0.9); // 1 = mais perto (embaixo), ~0 = no horizonte
                const y = hy + (h - hy) * normalized;
                if (y <= hy || y > h) continue;
                const fade = Math.min(1, normalized * 1.6);
                ctx.globalAlpha = fade * 0.8;
                ctx.lineWidth = 1 + fade * 1.5;
                ctx.shadowBlur = glow * 6 * fade;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Linha do horizonte em destaque
            ctx.globalAlpha = 0.9;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 8 * glow;
            ctx.beginPath();
            ctx.moveTo(0, hy);
            ctx.lineTo(w, hy);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
        };
    }, [speed, lineColor, backgroundColor, horizonY, columns, rows, glow]);

    return (
        <div
            ref={containerRef}
            className={`perspective-grid-container ${className}`}
            style={{ position: 'relative', width, height, overflow: 'hidden', ...style }}
        >
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
            {children && (
                <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                    {children}
                </div>
            )}
        </div>
    );
}

function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
