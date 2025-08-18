import React, { useEffect, useRef } from 'react';

interface ParticleBurstProps {
    isActive: boolean;
    onComplete: () => void;
    color?: string;
    count?: number;
    clickX?: number;
    clickY?: number;
    burstType?: 'single' | 'double';
}

const ParticleBurst: React.FC<ParticleBurstProps> = ({
    isActive,
    onComplete,
    color = '#FF6B6B',
    count = 40,
    clickX,
    clickY,
    burstType = 'single'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const particles: HTMLDivElement[] = [];

        // Create particles with different colors for a firework effect
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

        const createBurst = (burstCount: number, delay: number, speed: number, pattern: 'circle' | 'spiral' | 'random') => {
            const burstParticles: HTMLDivElement[] = [];

            for (let i = 0; i < burstCount; i++) {
                const particle = document.createElement('div');
                const particleColor = colors[i % colors.length];

                particle.className = 'fixed rounded-full pointer-events-none';
                particle.style.backgroundColor = particleColor;

                // Position relative to click coordinates if provided, otherwise center
                if (clickX !== undefined && clickY !== undefined) {
                    particle.style.left = `${clickX}px`;
                    particle.style.top = `${clickY}px`;
                } else {
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                }

                particle.style.transform = 'translate(-50%, -50%)';
                particle.style.transition = `all ${speed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                particle.style.boxShadow = `0 0 20px ${particleColor}, 0 0 40px ${particleColor}`;
                particle.style.zIndex = '99999';
                particle.style.opacity = '1';

                // Make particles much larger for better visibility
                const size = 8 + Math.random() * 24;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                document.body.appendChild(particle);
                burstParticles.push(particle);
            }

            // Animate particles based on pattern
            setTimeout(() => {
                burstParticles.forEach((particle, index) => {
                    let x, y;

                    switch (pattern) {
                        case 'circle':
                            const angle = (index / burstCount) * 2 * Math.PI + (Math.random() * 0.5 - 0.25);
                            const distance = 80 + Math.random() * 120;
                            x = Math.cos(angle) * distance;
                            y = Math.sin(angle) * distance;
                            break;
                        case 'spiral':
                            const spiralAngle = (index / burstCount) * 4 * Math.PI;
                            const spiralDistance = 60 + (index * 8) + Math.random() * 40;
                            x = Math.cos(spiralAngle) * spiralDistance;
                            y = Math.sin(spiralAngle) * spiralDistance;
                            break;
                        case 'random':
                        default:
                            const randomAngle = Math.random() * 2 * Math.PI;
                            const randomDistance = 60 + Math.random() * 140;
                            x = Math.cos(randomAngle) * randomDistance;
                            y = Math.sin(randomAngle) * randomDistance;
                            break;
                    }

                    // Add some randomness to the final position
                    const randomX = x + (Math.random() * 40 - 20);
                    const randomY = y + (Math.random() * 40 - 20);

                    particle.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px)) scale(0)`;
                    particle.style.opacity = '0';
                });
            }, delay);

            // Cleanup this burst
            setTimeout(() => {
                burstParticles.forEach(particle => particle.remove());
            }, delay + speed * 1000);

            return burstParticles;
        };

        //  if (burstType === 'single') {
        // Single burst at much faster speed
        const singleBurst = createBurst(count, 50, 0.6, 'circle');
        particles.push(...singleBurst);

        // Complete after single burst
        setTimeout(() => {
            onComplete();
        }, 600);
        /*  } else {
              // Double burst with different patterns
              const firstBurst = createBurst(Math.floor(count * 0.6), 50, 1.2, 'circle');
              const secondBurst = createBurst(Math.floor(count * 0.4), 400, 1.0, 'spiral');
  
              particles.push(...firstBurst, ...secondBurst);
  
              // Complete after both bursts
              setTimeout(() => {
                  onComplete();
              }, 1450);
          } */

        return () => {
            particles.forEach(particle => particle.remove());
        };
    }, [isActive, onComplete, color, count, clickX, clickY, burstType]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 99999 }}
        />
    );
};

export default ParticleBurst;
