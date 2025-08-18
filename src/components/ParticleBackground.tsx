import React from 'react';

const ParticleBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none">
            {/* Subtle background - removed to prevent blurry overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50"></div> */}
        </div>
    );
};

export default ParticleBackground;
