// src/components/GrainGradient.tsx
// Background "grão + gradiente cinematográfico": um gradiente escuro e suave com uma
// textura de grão de filme animada por cima — visual discreto, tipo still de cinema.
// Escrito do zero em Canvas 2D (sem dependências novas).
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface GrainGradientProps {
    /** Largura do contêiner */
    width?: string | number;
    /** Altura do contêiner */
    height?: string | number;
    /** Classes CSS adicionais */
    className?: string;
    /** Conteúdo renderizado por cima do efeito */
    children?: ReactNode;
    /** Cor central do gradiente (mais clara) */
    gradientFrom?: string;
    /** Cor das bordas do gradiente (mais escura) */
    gradientTo?: string;
    /** Intensidade do grão (0–1) */
    grainIntensity?: number;
    /** Velocidade da animação do grão (trocas por segundo) */
    grainSpeed?: number;
    /** Ativa um brilho suave que se desloca lentamente pela cena */
    driftGlow?: boolean;
    /** Cor do brilho que se desloca */
    driftGlowColor?: string;
    style?: CSSProperties;
}

export default function GrainGradient({
    width = '100%',
    height = '100%',
    className = '',
    children,
    gradientFrom = '#1a1a1a',
    gradientTo = '#050505',
    grainIntensity = 0.06,
    grainSpeed = 12,
    driftGlow = true,
    driftGlowColor = '#9EFF00',
    style,
}: GrainGradientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // grão não precisa de dpr alto
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
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        // Tile de ruído pré-gerado (pequeno, reaproveitado e deslocado a cada frame)
        const tileSize = 160;
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = tileSize;
        noiseCanvas.height = tileSize;
        const noiseCtx = noiseCanvas.getContext('2d')!;

        const generateNoiseTile = () => {
            const imageData = noiseCtx.createImageData(tileSize, tileSize);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 255;
            }
            noiseCtx.putImageData(imageData, 0, 0);
        };
        generateNoiseTile();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let animationId = 0;
        let time = 0;
        let lastTs = performance.now();
        let lastGrainSwap = 0;

        const render = (ts: number) => {
            const dt = Math.min((ts - lastTs) / 1000, 0.05);
            lastTs = ts;
            time += dt;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // Gradiente de base: mais claro perto do centro/topo, escurecendo nas bordas (vinheta)
            const grad = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.5, Math.max(w, h) * 0.75);
            grad.addColorStop(0, gradientFrom);
            grad.addColorStop(1, gradientTo);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Brilho suave que deriva bem devagar pela cena
            if (driftGlow) {
                const gx = w * (0.5 + 0.25 * Math.sin(time * 0.08));
                const gy = h * (0.4 + 0.18 * Math.cos(time * 0.06));
                const glowGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.35);
                glowGrad.addColorStop(0, hexToRgba(driftGlowColor, 0.07));
                glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = glowGrad;
                ctx.fillRect(0, 0, w, h);
            }

            // Grão: troca o tile de ruído algumas vezes por segundo (não a cada frame, por performance)
            if (!prefersReducedMotion && time - lastGrainSwap > 1 / grainSpeed) {
                generateNoiseTile();
                lastGrainSwap = time;
            }
            const pattern = ctx.createPattern(noiseCanvas, 'repeat');
            if (pattern) {
                ctx.globalAlpha = grainIntensity;
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, w, h);
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
        };
    }, [gradientFrom, gradientTo, grainIntensity, grainSpeed, driftGlow, driftGlowColor]);

    return (
        <div
            ref={containerRef}
            className={`grain-gradient-container ${className}`}
            style={{ position: 'relative', width, height, overflow: 'hidden', backgroundColor: gradientTo, ...style }}
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
