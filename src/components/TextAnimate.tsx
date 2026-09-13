// src/components/TextAnimate.tsx
// Adaptado de https://magicui.design/docs/components/text-animate
// Diferenças em relação ao original: usa `framer-motion` (já instalado no projeto)
// em vez de `motion/react`, e classes de CSS puro em vez de utilitários Tailwind.
"use client";

import { memo, type CSSProperties, type ComponentType } from "react";
import { AnimatePresence, motion, type Variants, type MotionProps } from "framer-motion";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
    | "fadeIn"
    | "blurIn"
    | "blurInUp"
    | "blurInDown"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleUp"
    | "scaleDown";

const motionElements = {
    div: motion.div,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    p: motion.p,
    span: motion.span,
} as const;

type MotionElementType = keyof typeof motionElements;

interface TextAnimateProps extends Omit<MotionProps, "children"> {
    /** O texto a ser animado */
    children: string;
    /** Classe aplicada ao elemento raiz */
    className?: string;
    /** Estilo inline aplicado ao elemento raiz */
    style?: CSSProperties;
    /** Classe aplicada a cada "pedaço" do texto (palavra, letra, linha) */
    segmentClassName?: string;
    /** Atraso antes da animação começar (segundos) */
    delay?: number;
    /** Duração total da animação (segundos) */
    duration?: number;
    /** Variantes de animação customizadas do framer-motion */
    variants?: Variants;
    /** Elemento HTML a ser renderizado */
    as?: MotionElementType;
    /** Como dividir o texto */
    by?: AnimationType;
    /** Se a animação começa quando o elemento entra na viewport */
    startOnView?: boolean;
    /** Se a animação roda só uma vez */
    once?: boolean;
    /** Preset de animação */
    animation?: AnimationVariant;
    /** Se renderiza um rótulo acessível para leitores de tela */
    accessible?: boolean;
}

const staggerTimings: Record<AnimationType, number> = {
    text: 0.06,
    word: 0.05,
    character: 0.03,
    line: 0.06,
};

const defaultContainerVariants: Variants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { delayChildren: 0, staggerChildren: 0.05 },
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

const defaultItemAnimationVariants: Record<
    AnimationVariant,
    { container: Variants; item: Variants }
> = {
    fadeIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
        },
    },
    blurIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: "blur(10px)" },
            show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.3 } },
            exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
        },
    },
    blurInUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
            show: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
            exit: {
                opacity: 0,
                filter: "blur(10px)",
                y: 20,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
        },
    },
    blurInDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
            show: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
        },
    },
    slideUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: -20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideLeft: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: 20, opacity: 0 },
            show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideRight: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: -20, opacity: 0 },
            show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    scaleUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 0.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, scale: { type: "spring", damping: 15, stiffness: 300 } },
            },
            exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    scaleDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 1.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, scale: { type: "spring", damping: 15, stiffness: 300 } },
            },
            exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
        },
    },
};

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const TextAnimateBase = ({
    children,
    delay = 0,
    duration = 0.3,
    variants,
    className,
    segmentClassName,
    as = "p",
    startOnView = true,
    once = false,
    by = "word",
    animation = "fadeIn",
    accessible = true,
    ...props
}: TextAnimateProps) => {
    const MotionComponent = motionElements[as] as unknown as ComponentType<
        MotionProps & { className?: string; style?: CSSProperties; [key: string]: unknown }
    >;

    let segments: string[] = [];
    switch (by) {
        case "word":
            segments = children.split(/(\s+)/);
            break;
        case "character":
            segments = children.split("");
            break;
        case "line":
            segments = children.split("\n");
            break;
        case "text":
        default:
            segments = [children];
            break;
    }

    const finalVariants = variants
        ? {
              container: {
                  hidden: { opacity: 0 },
                  show: {
                      opacity: 1,
                      transition: {
                          opacity: { duration: 0.01, delay },
                          delayChildren: delay,
                          staggerChildren: duration / segments.length,
                      },
                  },
                  exit: {
                      opacity: 0,
                      transition: { staggerChildren: duration / segments.length, staggerDirection: -1 },
                  },
              },
              item: variants,
          }
        : {
              container: {
                  ...defaultItemAnimationVariants[animation].container,
                  show: {
                      ...defaultItemAnimationVariants[animation].container.show,
                      transition: { delayChildren: delay, staggerChildren: duration / segments.length },
                  },
                  exit: {
                      ...defaultItemAnimationVariants[animation].container.exit,
                      transition: { staggerChildren: duration / segments.length, staggerDirection: -1 },
                  },
              },
              item: defaultItemAnimationVariants[animation].item,
          };

    return (
        <AnimatePresence mode="popLayout">
            <MotionComponent
                variants={finalVariants.container as Variants}
                initial="hidden"
                whileInView={startOnView ? "show" : undefined}
                animate={startOnView ? undefined : "show"}
                exit="exit"
                className={cx("text-animate", className)}
                viewport={{ once }}
                aria-label={accessible ? children : undefined}
                {...props}
            >
                {accessible && <span className="sr-only">{children}</span>}
                {segments.map((segment, i) => (
                    <motion.span
                        key={`${by}-${segment}-${i}`}
                        variants={finalVariants.item}
                        custom={i * staggerTimings[by]}
                        className={cx(
                            by === "line" ? "text-animate-line" : "text-animate-segment",
                            segmentClassName
                        )}
                        aria-hidden={accessible ? true : undefined}
                    >
                        {segment}
                    </motion.span>
                ))}
            </MotionComponent>
        </AnimatePresence>
    );
};

// Versão memoizada, como no componente original
export const TextAnimate = memo(TextAnimateBase);
