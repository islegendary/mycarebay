import React, { useState, useRef } from 'react';
import ParticleBurst from './ParticleBurst';

interface AnimatedButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    showParticles?: boolean;
    particleColor?: string;
    burstType?: 'single' | 'double';
    [key: string]: any; // Allow additional props like data-* attributes
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    showParticles = true,
    particleColor = '#0EA5E9',
    burstType = 'single',
    ...rest
}) => {
    const [isRippling, setIsRippling] = useState(false);
    const [rippleStyle, setRippleStyle] = useState({});
    const [showBurst, setShowBurst] = useState(false);
    const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const baseClasses = 'relative overflow-hidden transition-all duration-300 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-brand-blue hover:bg-brand-blue-dark text-white focus:ring-brand-blue-dark shadow-lg hover:shadow-xl transform hover:scale-105',
        secondary: 'bg-white hover:bg-slate-50 text-brand-gray-dark border border-slate-300 focus:ring-brand-blue',
        outline: 'bg-transparent hover:bg-brand-blue-light text-brand-blue border border-brand-blue focus:ring-brand-blue'
    };

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-8 py-4 text-lg'
    };

    const handleClick = (e: React.MouseEvent) => {
        if (disabled || showBurst) return; // Prevent multiple clicks during burst

        // Create ripple effect
        const button = buttonRef.current;
        if (button) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            setRippleStyle({
                width: size,
                height: size,
                left: x,
                top: y
            });
            setIsRippling(true);
        }

        // Show particle burst
        if (showParticles) {
            setClickCoords({ x: e.clientX, y: e.clientY });
            setShowBurst(true);
        }

        // Call original onClick
        if (onClick) {
            onClick(e);
        }

        // Reset ripple
        setTimeout(() => setIsRippling(false), 600);
    };

    const handleBurstComplete = () => {
        setShowBurst(false);
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...rest}
        >
            {/* Ripple effect */}
            {isRippling && (
                <span
                    className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
                    style={rippleStyle}
                />
            )}

            {/* Particle burst */}
            <ParticleBurst
                isActive={showBurst}
                onComplete={handleBurstComplete}
                color={particleColor}
                count={15}
                clickX={clickCoords.x}
                clickY={clickCoords.y}
                burstType={burstType}
            />

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center">
                {children}
            </span>
        </button>
    );
};

export default AnimatedButton;
