import React from 'react';
import { User } from '@/types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onNavigate: (view: 'dashboard' | 'advisor') => void;
    activeView: 'dashboard' | 'advisor';
}

const NavButton: React.FC<{onClick: () => void; isActive: boolean; children: React.ReactNode; disabled?: boolean}> = ({ onClick, isActive, children, disabled }) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-brand-blue-light text-brand-blue-dark";
    const inactiveClasses = "text-brand-gray-medium hover:bg-slate-100 hover:text-brand-gray-dark";
    const disabledClasses = "text-brand-gray-medium opacity-50 cursor-not-allowed";

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${disabled ? disabledClasses : isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, activeView }) => {
  const canUseAdvisor = user.plan === 'plus' || user.plan === 'pro';

  const planColors: Record<string, string> = {
      free: 'bg-slate-200 text-brand-gray-dark',
      plus: 'bg-blue-200 text-blue-800',
      pro: 'bg-purple-200 text-purple-800'
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-3">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="p-2 bg-brand-blue rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-brand-gray-dark hidden sm:block">
              MyCareBay
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <nav className="flex items-center space-x-2">
                <NavButton onClick={() => onNavigate('dashboard')} isActive={activeView === 'dashboard'}>Dashboard</NavButton>
                <NavButton onClick={() => onNavigate('advisor')} isActive={activeView === 'advisor'} disabled={!canUseAdvisor}>Care Advisor</NavButton>
            </nav>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${planColors[user.plan]}`}>{user.plan} Plan</div>
            <button onClick={onLogout} title="Logout" className="p-2 rounded-full text-brand-gray-medium hover:bg-slate-100 hover:text-brand-gray-dark transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;