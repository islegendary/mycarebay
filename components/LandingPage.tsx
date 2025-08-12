import React, { useState } from 'react';
import { Plan, User } from '../types';
import AuthModal from './AuthModal';

interface LandingPageProps {
    onAuthenticate: (user: User) => void;
}

const CheckIcon: React.FC = () => (
    <svg className="h-6 w-6 text-green-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticate }) => {
    const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'signin' | 'signup'; plan: Plan | null }>({
        isOpen: false,
        mode: 'signup',
        plan: 'free',
    });

    const handleOpenModal = (mode: 'signin' | 'signup', plan?: Plan) => {
        setModalState({ isOpen: true, mode, plan: plan || null });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    return (
        <div className="bg-brand-gray-light">
            {modalState.isOpen && (
                <AuthModal
                    mode={modalState.mode}
                    plan={modalState.plan}
                    onClose={handleCloseModal}
                    onAuthenticate={onAuthenticate}
                />
            )}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-blue rounded-lg">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                           </svg>
                        </div>
                        <h1 className="text-xl font-bold text-brand-gray-dark">MyCareBay</h1>
                    </div>
                    <div className="space-x-2 flex items-center">
                        <button onClick={() => handleOpenModal('signin')} className="px-3 py-2 rounded-md text-sm font-medium text-brand-gray-medium hover:bg-slate-100 transition-colors">Sign In</button>
                        <button onClick={() => handleOpenModal('signup', 'pro')} className="bg-brand-blue text-white font-medium px-4 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors text-sm">Get Started</button>
                    </div>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="bg-white text-center py-20 px-6">
                    <h2 className="text-5xl font-extrabold text-brand-gray-dark">Smarter Senior Care Starts Here</h2>
                    <p className="mt-4 text-xl text-brand-gray-medium max-w-3xl mx-auto">MyCareBay centralizes your loved one's information and provides AI-powered insights to help you make confident care decisions. Reduce stress, improve care.</p>
                    <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 bg-brand-blue text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-brand-blue-dark transition-transform hover:scale-105">
                        Choose Your Plan
                    </button>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-brand-gray-dark">Everything You Need in One Place</h3>
                            <p className="mt-2 text-lg text-brand-gray-medium">From managing medications to preparing for facility visits.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12 text-center">
                            <div>
                                <div className="flex items-center justify-center h-16 w-16 bg-brand-blue-light text-brand-blue-dark rounded-full mx-auto">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                </div>
                                <h4 className="mt-4 text-xl font-bold">Centralized Dashboard</h4>
                                <p className="mt-1 text-brand-gray-medium">Keep track of ailments, medications, appointments, and contacts, all in one secure place.</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center h-16 w-16 bg-brand-blue-light text-brand-blue-dark rounded-full mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <h4 className="mt-4 text-xl font-bold">AI Care Advisor</h4>
                                <p className="mt-1 text-brand-gray-medium">Ask complex caregiving questions and get clear, reliable answers grounded in reputable web sources.</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center h-16 w-16 bg-brand-blue-light text-brand-blue-dark rounded-full mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="mt-4 text-xl font-bold">Actionable Checklists</h4>
                                <p className="mt-1 text-brand-gray-medium">Generate tailored checklists to ensure you ask the right questions when visiting care facilities.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-brand-gray-dark">Find the Plan That's Right For You</h3>
                            <p className="mt-2 text-lg text-brand-gray-medium">Start for free, and upgrade as your needs grow.</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                            {/* Free Plan */}
                            <div className="border rounded-xl p-8 bg-white shadow-lg flex flex-col">
                                <h4 className="text-2xl font-bold text-brand-gray-dark">Free</h4>
                                <p className="mt-2 text-brand-gray-medium min-h-[48px]">For getting started with the essentials.</p>
                                <div className="mt-6"><span className="text-lg font-medium text-brand-gray-dark">/ month</span></div>
                                <ul className="mt-8 space-y-4 flex-grow">
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Manage 1 Senior Profile</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Centralized Information Hub</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Ailment Education</span>
                                    </li>
                                </ul>
                                <button onClick={() => handleOpenModal('signup', 'free')} className="mt-8 w-full border border-brand-blue text-brand-blue-dark font-bold py-3 rounded-lg hover:bg-brand-blue-light transition-colors">Choose Free</button>
                            </div>

                            {/* Plus Plan */}
                            <div className="border rounded-xl p-8 bg-white shadow-lg flex flex-col">
                                <h4 className="text-2xl font-bold text-brand-gray-dark">Plus</h4>
                                <p className="mt-2 text-brand-gray-medium min-h-[48px]">For proactive planning with AI assistance.</p>
                                <div className="mt-6"><span className="text-lg font-medium text-brand-gray-dark">/ month</span></div>
                                <ul className="mt-8 space-y-4 flex-grow">
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Manage 1 Senior Profile</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Centralized Information Hub</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Ailment Education</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">AI Care Advisor Q&A</span>
                                    </li>
                                </ul>
                                <button onClick={() => handleOpenModal('signup', 'plus')} className="mt-8 w-full border border-brand-blue text-brand-blue-dark font-bold py-3 rounded-lg hover:bg-brand-blue-light transition-colors">Choose Plus</button>
                            </div>

                            {/* Pro Plan */}
                             <div className="border-2 border-brand-blue rounded-xl p-8 bg-white shadow-2xl flex flex-col relative">
                                <span className="absolute top-0 -translate-y-1/2 bg-brand-blue text-white text-xs font-bold uppercase px-3 py-1 rounded-full left-1/2 -translate-x-1/2">Most Popular</span>
                                <h4 className="text-2xl font-bold text-brand-blue-dark">Pro</h4>
                                <p className="mt-2 text-brand-gray-medium min-h-[48px]">For comprehensive family care coordination.</p>
                                <div className="mt-6"><span className="text-lg font-medium text-brand-gray-dark">/ month</span></div>
                                <ul className="mt-8 space-y-4 flex-grow">
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">Manage up to 4 Senior Profiles</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">AI Care Advisor Q&A</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">AI-Generated Facility Checklists</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-brand-gray-dark">
                                            AI Audio & Video Summaries
                                            <span className="block text-brand-gray-medium font-normal">(Coming Soon)</span>
                                        </span>
                                    </li>
                                </ul>
                                <button onClick={() => handleOpenModal('signup', 'pro')} className="mt-8 w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-dark transition-colors">Choose Pro</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;