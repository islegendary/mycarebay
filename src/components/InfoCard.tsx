
import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-brand-gray-dark">{title}</h3>
      </div>
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
