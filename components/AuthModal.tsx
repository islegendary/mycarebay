import React, { useState, useEffect } from 'react';
import { Plan, User } from '../types';

interface AuthModalProps {
    mode: 'signin' | 'signup';
    plan: Plan | null;
    onClose: () => void;
    onAuthenticate: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, plan, onClose, onAuthenticate }) => {
    const [email, setEmail] = useState('demo@mycarebay.com');
    const [password, setPassword] = useState('Demo2024!');
    const [currentMode, setCurrentMode] = useState(initialMode);

    useEffect(() => {
        // Sync mode if the prop changes (e.g., user clicks sign up then sign in)
        setCurrentMode(initialMode);
    }, [initialMode]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Create user object for authentication
        const authUser: User = {
            id: `user_${Date.now()}`,
            email,
            name: email.split('@')[0], // Use email prefix as name for demo
            plan: currentMode === 'signup' ? (plan || 'free') : 'pro',
        };
        onAuthenticate(authUser);
        onClose(); // Close modal after successful authentication
    };

    const isSigningUp = currentMode === 'signup';
    const planTitle = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Free';
    const title = isSigningUp ? `Sign Up for ${planTitle}` : 'Sign In to Your Account';
    const buttonText = isSigningUp ? 'Create Account' : 'Sign In';
    const toggleText = isSigningUp ? 'Already have an account?' : "Don't have an account?";
    const toggleLinkText = isSigningUp ? 'Sign In' : 'Sign Up';

    const handleToggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentMode(isSigningUp ? 'signin' : 'signup');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl max-w-md w-full"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-gray-dark">{title}</h2>
                    <button onClick={onClose} className="text-brand-gray-medium hover:text-brand-gray-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8">
                    <p className="text-center text-brand-gray-medium mb-6">
                        {isSigningUp
                            ? `Create an account to start your ${planTitle} plan.`
                            : 'Welcome back! Please enter your details.'
                        }
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email-auth" className="block text-sm font-medium text-brand-gray-dark">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email-auth"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password-auth" className="block text-sm font-medium text-brand-gray-dark">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password-auth"
                                    name="password"
                                    type="password"
                                    autoComplete={isSigningUp ? 'new-password' : 'current-password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark"
                            >
                                {buttonText}
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-brand-gray-medium">
                        {toggleText}{' '}
                        <a href="#" onClick={handleToggleMode} className="font-medium text-brand-blue hover:text-brand-blue-dark">
                            {toggleLinkText}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;