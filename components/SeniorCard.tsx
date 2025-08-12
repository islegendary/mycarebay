
import React from 'react';
import { Senior } from '../types';
import InitialsAvatar from './InitialsAvatar';

interface SeniorCardProps {
  senior: Senior;
  onSelect: () => void;
}

const SeniorCard: React.FC<SeniorCardProps> = ({ senior, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={onSelect}
    >
      <div className="flex items-center p-6">
        <InitialsAvatar name={senior.name} size="lg" />
        <div className="ml-5">
          <h3 className="text-xl font-bold text-brand-gray-dark">{senior.name}</h3>
          <p className="text-brand-gray-medium">{senior.relationship}</p>
        </div>
      </div>
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-brand-gray-medium mb-2">Key Info</h4>
                    <div className="flex items-center text-sm text-brand-gray-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{senior.ailments.length} Ailments</span>
        </div>
                     <div className="flex items-center text-sm text-brand-gray-dark mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 01.547-1.806z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{senior.medications.length} Medications</span>
        </div>
      </div>
    </div>
  );
};

export default SeniorCard;