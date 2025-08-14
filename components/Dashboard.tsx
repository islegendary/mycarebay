import React from 'react';
import { Senior, User } from '../types';
import SeniorCard from './SeniorCard';

interface DashboardProps {
  seniors: Senior[];
  onSelectSenior: (id: string) => void;
  onAddSenior: () => void;
  onNavigateToAdvisor: () => void;
}

const CareAdvisorCard: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => {
  const content = (
    <>
      <div className="p-3 bg-brand-blue rounded-full text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-brand-blue-dark mt-4">Care Advisor</h3>
      <p className="text-brand-gray-medium mt-1">Get instant, AI-powered answers to your caregiving questions.</p>
    </>
  );

  if (disabled) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="opacity-40">{content}</div>
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="font-bold text-brand-blue-dark">Available on Plus & Pro</div>
          <button className="mt-2 inline-flex items-center text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-brand-blue-light border-2 border-dashed border-brand-blue rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-100 hover:border-brand-blue-dark transition-all duration-300"
      onClick={onClick}
    >
      {content}
    </div>
  );
};



const Dashboard: React.FC<DashboardProps> = ({ seniors, onSelectSenior, onAddSenior, onNavigateToAdvisor }) => {
  // Get user info from localStorage for plan checks
  const storedUser = localStorage.getItem('currentUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const canUseAdvisor = user?.plan === 'plus' || user?.plan === 'pro';

  const canAddSenior = (user?.plan === 'free' && seniors.length < 1) ||
    (user?.plan === 'plus' && seniors.length < 1) || // Assuming plus also has 1
    (user?.plan === 'pro' && seniors.length < 4);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-brand-gray-dark">Your Circle</h2>
        <button
          onClick={onAddSenior}
          disabled={!canAddSenior}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-slate-400 disabled:cursor-not-allowed"
          title={!canAddSenior ? "Upgrade to Pro to add more profiles" : "Add Senior Profile"}
        >
          Add Senior
        </button>
      </div>

      <p className="text-brand-gray-medium mb-8">Select a person to view their care plan, or ask the Care Advisor for help.</p>

      {seniors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seniors.map(senior => (
            <SeniorCard
              key={senior.id}
              senior={senior}
              onSelect={() => onSelectSenior(senior.id)}
            />
          ))}
          <CareAdvisorCard onClick={onNavigateToAdvisor} disabled={!canUseAdvisor} />
        </div>
      ) : (
        <div className="text-center py-16 px-8 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 12a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-brand-gray-dark">No one in your circle yet</h3>
          <p className="mt-1 text-sm text-brand-gray-medium">Add a senior to start managing their care plan.</p>
          <button
            onClick={onAddSenior}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            Add Your First Senior Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;