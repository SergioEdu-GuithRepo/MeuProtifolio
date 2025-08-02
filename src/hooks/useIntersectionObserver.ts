// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react';

interface ObserverOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useIntersectionObserver = (options: ObserverOptions = {}) => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [element, setElement] = useState<HTMLElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && triggerOnce) {
                observer.current?.disconnect();
            }
        }, { threshold, rootMargin });

        if (element) {
            observer.current.observe(element);
        }

        return () => {
            observer.current?.disconnect();
        };
    }, [element, threshold, rootMargin, triggerOnce]);

    return [setElement, isIntersecting] as const;
};