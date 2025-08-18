import React, { useState, useEffect } from 'react';
import { getAilmentEducation } from '@/services/geminiService';
import Loader from './Loader';
import MarkdownRenderer from './MarkdownRenderer';

interface AilmentInfoModalProps {
  ailmentName: string;
  onClose: () => void;
}

const AilmentInfoModal: React.FC<AilmentInfoModalProps> = ({ ailmentName, onClose }) => {
  const [educationInfo, setEducationInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEducation = async () => {
      setIsLoading(true);
      const info = await getAilmentEducation(ailmentName);
      setEducationInfo(info);
      setIsLoading(false);
    };

    fetchEducation();
  }, [ailmentName]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-white border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-gray-dark">Understanding: {ailmentName}</h2>
          <button onClick={onClose} className="text-brand-gray-medium hover:text-brand-gray-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader />
              <p className="mt-4 text-brand-gray-medium">Fetching AI-powered insights...</p>
            </div>
          ) : (
            <MarkdownRenderer text={educationInfo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AilmentInfoModal;