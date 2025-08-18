import React from 'react';
import { getInitials, getNameColor } from '@/hooks/initials';

interface InitialsAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  className = ''
}) => {
  const initials = getInitials(name);
  const colorClass = getNameColor(name);

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-24 h-24 text-2xl'
  };

  const baseClasses = 'rounded-full flex items-center justify-center font-bold text-white border-4 border-white shadow-lg drop-shadow-md';

  return (
    <div
      className={`${colorClass} ${sizeClasses[size]} ${baseClasses} ${className}`}
      title={name}
      style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
