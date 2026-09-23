// src/components/BlackHole.tsx
// Efeito de lente gravitacional: um shader WebGL que dobra um "disco" de luz ao redor
// de uma esfera escura (horizonte de eventos), com um anel brilhante na borda — o
// visual clássico de buraco negro (tipo Interstellar).
// Inspirado na ideia do componente "Black Hole" da React Bits Pro (biblioteca paga,
// cujo código-fonte não tenho acesso) — esta é uma implementação própria, escrita do
// zero em WebGL puro (sem Three.js/dependências novas), não uma cópia do código deles.
"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface BlackHoleProps {
    /** Largura do contêiner */
    width?: string | number;
    /** Altura do contêiner */
    height?: string | number;
    /** Classes CSS adicionais */
    className?: string;
    /** Conteúdo renderizado por cima do efeito */
    children?: ReactNode;
    /** Multiplicador de velocidade da animação (0.1–3.0) */
    speed?: number;
    /** Raio do horizonte de eventos (esfera escura), em proporção da tela (0.05–0.4) */
    holeRadius?: number;
    /** Intensidade do brilho/anel ao redor do horizonte de eventos (0.01–3) */
    glow?: number;
    /** Força da curvatura da luz ao redor da esfera (0–1) */
    lensStrength?: number;
    /** Número de segmentos do espelhamento em caleidoscópio (1–8) */
    mirrorSplits?: number;
    /** Ativa o efeito de espelhamento em caleidoscópio */
    warpEnabled?: boolean;
    /** Velocidade do ciclo/turbulência de cor do disco */
    colorSpeed?: number;
    /** Cor de fundo (hex) */
    backgroundColor?: string;
    /** Opacidade geral do efeito (0–1) */
    opacity?: number;
    /** Ativa a interação com o cursor (desloca o centro do buraco negro) */
    cursorInteraction?: boolean;
    /** Força do efeito do cursor (0–3) */
    cursorIntensity?: number;
    style?: CSSProperties;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHoleRadius;
uniform float uGlow;
uniform float uLensStrength;
uniform float uMirrorSplits;
uniform float uWarpEnabled;
uniform float uColorSpeed;
uniform vec3 uBackgroundColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    // Espelhamento em caleidoscópio: dobra o angulo em N segmentos
    if (uWarpEnabled > 0.5 && uMirrorSplits > 1.5) {
        float ang = atan(uv.y, uv.x);
        float segment = 3.14159265 * 2.0 / uMirrorSplits;
        ang = mod(ang, segment);
        ang = abs(ang - segment * 0.5);
        float r = length(uv);
        uv = vec2(cos(ang), sin(ang)) * r;
    }

    vec2 center = uMouse;
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    vec2 dir = dist > 0.0001 ? toCenter / dist : vec2(0.0, 1.0);

    // Curvatura gravitacional: quanto mais perto do horizonte, mais o raio de luz se dobra
    float bend = uLensStrength * 0.16 / max(dist, uHoleRadius * 0.5);
    float falloff = smoothstep(uHoleRadius * 6.0, uHoleRadius * 0.8, dist);
    vec2 lensedUv = uv + dir * bend * falloff;

    // Disco de luz: uma faixa achatada, com turbulência procedural
    float diskY = lensedUv.y * 3.2;
    float band = exp(-diskY * diskY * 1.4);
    float turbulence = noise(vec2(lensedUv.x * 3.0 - uTime * uColorSpeed, lensedUv.y * 8.0 + uTime * uColorSpeed * 0.4));
    float brightness = band * (0.55 + 0.55 * turbulence);

    vec3 hot = vec3(1.0, 1.0, 1.0);
    vec3 warm = vec3(0.55, 0.55, 0.58);
    vec3 diskColor = mix(hot, warm, clamp(abs(lensedUv.y) * 2.2, 0.0, 1.0));
    vec3 col = diskColor * brightness;

    // Sombra do horizonte de eventos: um círculo escuro sólido.
    // (shadow = 0 dentro da esfera / bloqueado, 1 fora / totalmente visível)
    float shadowEdge = uHoleRadius;
    float shadow = smoothstep(shadowEdge * 0.92, shadowEdge, dist);
    col *= shadow;

    // Anel brilhante bem na borda do horizonte de eventos (fotosfera)
    float ringWidth = uHoleRadius * 0.12;
    float rimDist = abs(dist - shadowEdge * 1.01);
    float rim = exp(-pow(rimDist / ringWidth, 2.0));
    col += vec3(1.0, 1.0, 1.0) * rim * uGlow * 1.8;

    // Leve brilho geral (glow) ao redor de todo o disco
    col += diskColor * brightness * shadow * uGlow * 0.35;

    float alpha = clamp(brightness * shadow + rim, 0.0, 1.0);
    col = mix(uBackgroundColor, col, alpha);

    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
    return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("BlackHole shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export function BlackHole({
    width = "100%",
    height = "100%",
    className = "",
    children,
    speed = 1,
    holeRadius = 0.16,
    glow = 1,
    lensStrength = 1,
    mirrorSplits = 1,
    warpEnabled = false,
    colorSpeed = 0.25,
    backgroundColor = "#0a0a0a",
    opacity = 1,
    cursorInteraction = false,
    cursorIntensity = 1,
    style,
}: BlackHoleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    const propsRef = useRef({
        speed, holeRadius, glow, lensStrength, mirrorSplits, warpEnabled, colorSpeed,
        backgroundColor, opacity, cursorInteraction, cursorIntensity,
    });
    propsRef.current = {
        speed, holeRadius, glow, lensStrength, mirrorSplits, warpEnabled, colorSpeed,
        backgroundColor, opacity, cursorInteraction, cursorIntensity,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) {
            console.warn("BlackHole: WebGL não disponível neste navegador.");
            return;
        }

        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("BlackHole program link error:", gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uResolution = gl.getUniformLocation(program, "uResolution");
        const uTime = gl.getUniformLocation(program, "uTime");
        const uMouse = gl.getUniformLocation(program, "uMouse");
        const uHoleRadius = gl.getUniformLocation(program, "uHoleRadius");
        const uGlow = gl.getUniformLocation(program, "uGlow");
        const uLensStrength = gl.getUniformLocation(program, "uLensStrength");
        const uMirrorSplits = gl.getUniformLocation(program, "uMirrorSplits");
        const uWarpEnabled = gl.getUniformLocation(program, "uWarpEnabled");
        const uColorSpeed = gl.getUniformLocation(program, "uColorSpeed");
        const uBackgroundColor = gl.getUniformLocation(program, "uBackgroundColor");

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0;
        let h = 0;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = Math.max(rect.width, 1);
            h = Math.max(rect.height, 1);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * (rect.width / rect.height);
            const ny = -((e.clientY - rect.top) / rect.height - 0.5);
            mouseRef.current.targetX = nx * 0.4 * propsRef.current.cursorIntensity;
            mouseRef.current.targetY = ny * 0.4 * propsRef.current.cursorIntensity;
        };
        if (cursorInteraction) {
            container.addEventListener("mousemove", handleMouseMove);
        }

        let animationFrameId: number;
        let time = 0;
        let lastTs = performance.now();

        const render = (ts: number) => {
            const p = propsRef.current;
            const dt = Math.min((ts - lastTs) / 1000, 0.05);
            lastTs = ts;
            time += dt * p.speed;

            if (p.cursorInteraction) {
                mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
                mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
            } else {
                mouseRef.current.x = 0;
                mouseRef.current.y = 0;
            }

            gl.useProgram(program);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform1f(uTime, time);
            gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
            gl.uniform1f(uHoleRadius, p.holeRadius);
            gl.uniform1f(uGlow, p.glow);
            gl.uniform1f(uLensStrength, p.lensStrength);
            gl.uniform1f(uMirrorSplits, p.mirrorSplits);
            gl.uniform1f(uWarpEnabled, p.warpEnabled ? 1 : 0);
            gl.uniform1f(uColorSpeed, p.colorSpeed);
            const [r, g, b] = hexToRgb(p.backgroundColor);
            gl.uniform3f(uBackgroundColor, r, g, b);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameId = requestAnimationFrame(render);
        };

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            render(performance.now());
        } else {
            animationFrameId = requestAnimationFrame(render);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            if (cursorInteraction) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, [cursorInteraction]);

    return (
        <div
            ref={containerRef}
            className={`black-hole-container ${className}`}
            style={{ position: "relative", width, height, overflow: "hidden", opacity, ...style }}
        >
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />
            {children && (
                <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                    {children}
                </div>
            )}
        </div>
    );
}
