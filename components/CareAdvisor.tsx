import React, { useState } from 'react';
import { generateFacilityChecklist, getCareAdvice } from '../services/geminiService';
import type { CareAdvice, ChecklistResponse, GroundingSource, User } from '../types';
import Loader from './Loader';
import MarkdownRenderer from './MarkdownRenderer';
import Checklist from './Checklist';

const examplePrompts = [
    "What are the early signs of dementia?",
    "Create a checklist for making a home safe for someone with mobility issues.",
    "Give me details about Alzheimer's Disease and a checklist I can use when I visit a long term care facility.",
    "How can I help a senior stay socially active?",
];

interface CareAdvisorProps {
    // No props needed - will get user info from context or localStorage if needed
}

const UpgradePrompt: React.FC<{feature: string}> = ({feature}) => (
    <div className="mt-6 p-4 bg-brand-blue-light rounded-lg text-center">
        <p className="font-bold text-brand-blue-dark">Upgrade to Pro to use {feature}</p>
        <p className="text-sm text-brand-gray-medium mt-1">Enhance your care planning with our most advanced AI tools.</p>
        <button className="mt-3 text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark px-4 py-2 rounded-md shadow-sm">Upgrade Now</button>
    </div>
);

const CareAdvisor: React.FC<CareAdvisorProps> = () => {
    const [question, setQuestion] = useState<string>('');
    const [lastQuestion, setLastQuestion] = useState<string>('');
    const [advice, setAdvice] = useState<CareAdvice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [checklistData, setChecklistData] = useState<ChecklistResponse | null>(null);
    const [isChecklistLoading, setIsChecklistLoading] = useState<boolean>(false);
    const [checklistError, setChecklistError] = useState<string | null>(null);

    const handleSubmit = async (event?: React.FormEvent, prompt?: string) => {
        if (event) event.preventDefault();
        const query = prompt || question;
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setAdvice(null);
        setChecklistData(null); 
        setChecklistError(null);
        setLastQuestion(query);
        if(!prompt) setQuestion('');

        try {
            const result = await getCareAdvice(query);
            setAdvice(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleExampleClick = (prompt: string) => {
        setQuestion(prompt);
        handleSubmit(undefined, prompt);
    };

    const handleGenerateChecklist = async () => {
        if (!lastQuestion) return;
        
        // Get user info from localStorage for plan check
        const storedUser = localStorage.getItem('currentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || user.plan !== 'pro') return;

        setIsChecklistLoading(true);
        setChecklistError(null);
        setChecklistData(null);
        try {
            const result = await generateFacilityChecklist(lastQuestion);
            setChecklistData(result);
        } catch(e: any) {
            setChecklistError(e.message || "An unknown error occurred.");
        } finally {
            setIsChecklistLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-brand-gray-dark">Care Advisor</h1>
                <p className="mt-2 text-lg text-brand-gray-medium">Your AI-powered assistant for senior care questions. Powered by Google.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="care-question" className="block text-sm font-medium text-brand-gray-dark mb-1">Ask a question</label>
                    <textarea
                        id="care-question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., How can I prevent falls at home?"
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                        rows={3}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <><Loader /> <span className="ml-2">Getting Advice...</span></> : 'Get Advice'}
                    </button>
                </form>
            </div>

            { !advice && !isLoading && !error && (
                 <div className="mb-8">
                    <h3 className="text-lg font-semibold text-brand-gray-dark mb-3 text-center">Or try one of these examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {examplePrompts.map(prompt => (
                            <button 
                                key={prompt} 
                                onClick={() => handleExampleClick(prompt)}
                                className="p-4 bg-white rounded-lg shadow text-left text-brand-gray-dark hover:shadow-md hover:text-brand-blue-dark transition-all duration-200"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg">
                    <Loader />
                    <p className="mt-4 text-brand-gray-dark font-medium">Consulting our AI advisor...</p>
                    <p className="text-sm text-brand-gray-medium">This may take a moment.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {advice && (
                <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                    <h2 className="text-2xl font-bold text-brand-gray-dark mb-4 border-b pb-4">AI-Powered Advice</h2>
                    <MarkdownRenderer text={advice.text} />
                    
                    {advice.sources.length > 0 && (
                        <div className="mt-8 pt-4 border-t">
                            <h3 className="text-lg font-semibold text-brand-gray-dark mb-3">Sources</h3>
                            <ul className="space-y-2">
                                {advice.sources.map((source, index) => source.web && (
                                    <li key={index} className="text-sm">
                                        <a 
                                            href={source.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-brand-blue hover:underline break-words"
                                        >
                                            {index + 1}. {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="mt-8 pt-6 border-t-2 border-dashed">
                        {(() => {
                            const storedUser = localStorage.getItem('currentUser');
                            const user = storedUser ? JSON.parse(storedUser) : null;
                            return user?.plan === 'pro' ? (
                            <>
                                {!checklistData && !isChecklistLoading && (
                                    <button
                                        onClick={handleGenerateChecklist}
                                        disabled={isChecklistLoading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
                                    >
                                        Generate Facility Questions Checklist
                                    </button>
                                )}
                            
                                {isChecklistLoading && (
                                    <div className="flex flex-col items-center justify-center p-8">
                                        <Loader />
                                        <p className="mt-4 text-brand-gray-dark font-medium">Building your Pro checklist...</p>
                                    </div>
                                )}

                                {checklistError && (
                                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                        <p className="font-bold">Checklist Error</p>
                                        <p>{checklistError}</p>
                                    </div>
                                )}

                                {checklistData && (
                                    <Checklist data={checklistData} topic={lastQuestion} />
                                )}

                                <div className="mt-8 text-center p-4 bg-slate-100 rounded-lg border">
                                    <h4 className="font-bold text-brand-gray-dark">Pro Feature Preview</h4>
                                    <p className="text-sm text-brand-gray-medium mt-1">Coming soon: Generate advice as shareable audio or video summaries.</p>
                                    <div className="flex justify-center space-x-4 mt-3">
                                        <button disabled className="text-sm font-medium bg-slate-300 text-slate-800 px-4 py-2 rounded-md shadow-sm cursor-not-allowed">Generate Audio</button>
                                        <button disabled className="text-sm font-medium bg-slate-300 text-slate-800 px-4 py-2 rounded-md shadow-sm cursor-not-allowed">Generate Video</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <UpgradePrompt feature="Facility Checklists" />
                        );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareAdvisor;