import React, { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
    count?: number;
    className?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    count = 20,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const particles: HTMLDivElement[] = [];

        // Create particles
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full pointer-events-none opacity-20';
            particle.style.backgroundColor = '#0EA5E9';
            particle.style.width = `${Math.random() * 4 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(particle);
            particles.push(particle);
        }

        // Cleanup
        return () => {
            particles.forEach(particle => particle.remove());
        };
    }, [count]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden ${className}`}
            style={{ zIndex: -1 }}
        />
    );
};

export default FloatingParticles;
