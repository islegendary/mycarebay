import React, { useState, useEffect } from 'react';
import { getCareAdvice, generateFacilityChecklist } from '@/services/geminiService';
import type { CareAdvice, GroundingSource, User, Senior, ChecklistResponse } from '@/types';
import Loader from './Loader';
import MarkdownRenderer from './MarkdownRenderer';
import Checklist from './Checklist';

const defaultExamplePrompts = [
    "What are the early signs of dementia?",
    "Create a checklist for making a home safe for someone with mobility issues.",
    "Give me details about Alzheimer's Disease and key points for me to research further.",
    "How can I help a senior stay socially active?",
];

interface CareAdvisorProps {
    selectedSenior?: Senior | null;
    onBackToProfile?: () => void;
}



const CareAdvisor: React.FC<CareAdvisorProps> = ({ selectedSenior, onBackToProfile }) => {
    const [question, setQuestion] = useState<string>('');
    const [lastQuestion, setLastQuestion] = useState<string>('');
    const [advice, setAdvice] = useState<CareAdvice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checklistData, setChecklistData] = useState<ChecklistResponse | null>(null);
    const [isChecklistLoading, setIsChecklistLoading] = useState<boolean>(false);
    const [checklistError, setChecklistError] = useState<string | null>(null);

    // Refs for scrolling to answers
    const adviceRef = React.useRef<HTMLDivElement>(null);
    const checklistRef = React.useRef<HTMLDivElement>(null);



    // Generate example prompts based on senior's ailments
    const generateExamplePrompts = (): string[] => {
        if (!selectedSenior || !selectedSenior.ailments || selectedSenior.ailments.length === 0) {
            return defaultExamplePrompts;
        }

        const ailmentNames = selectedSenior.ailments.map(ailment => ailment.name);
        const seniorName = selectedSenior.name;
        const firstAilment = ailmentNames[0];

        return [
            `What are the best care practices for someone with ${ailmentNames.join(', ')}?`,
            `How can I help ${seniorName} manage their ${firstAilment} symptoms?`,
            `Give me details about ${firstAilment} and key points for me to research further.`,
            `What should I watch out for when caring for someone with ${ailmentNames.join(', ')}?`,
        ];
    };

    const examplePrompts = generateExamplePrompts();

    const handleSubmit = async (event?: React.FormEvent, prompt?: string) => {
        if (event) event.preventDefault();
        const query = prompt || question;
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setAdvice(null);
        setLastQuestion(query);
        if (!prompt) setQuestion('');

        try {
            const result = await getCareAdvice(query);
            setAdvice(result);
            // Scroll to the advice element after it's rendered
            setTimeout(() => {
                adviceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
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
        setIsChecklistLoading(true);
        setChecklistError(null);
        setChecklistData(null);

        try {
            const topic = selectedSenior?.ailments?.length > 0
                ? `Facility assessment for ${selectedSenior.name} with ${selectedSenior.ailments.map(a => a.name).join(', ')}`
                : 'General long-term care facility assessment';

            const result = await generateFacilityChecklist(topic, selectedSenior);
            setChecklistData(result);
            // Scroll to the checklist element after it's rendered
            setTimeout(() => {
                checklistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (e: any) {
            setChecklistError(e.message || "An unknown error occurred.");
        } finally {
            setIsChecklistLoading(false);
        }
    };



    return (
        <div className="max-w-4xl mx-auto">
            {selectedSenior && onBackToProfile && (
                <div className="mb-6">
                    <button
                        onClick={onBackToProfile}
                        className="flex items-center text-sm text-brand-blue hover:text-brand-blue-dark font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to {selectedSenior.name}'s Profile
                    </button>
                </div>
            )}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-brand-gray-dark">
                    {selectedSenior ? `Care Advisor for ${selectedSenior.name}` : 'Care Advisor'}
                </h1>
                <p className="mt-2 text-lg text-brand-gray-medium">
                    {selectedSenior
                        ? `AI-powered care advice and facility checklists personalized for ${selectedSenior.name}.`
                        : 'Your AI-powered assistant for senior care questions and facility visits.'
                    }
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="care-question" className="block text-sm font-medium text-brand-gray-dark mb-1">Ask a question</label>
                    <textarea
                        id="care-question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={
                            selectedSenior && selectedSenior.ailments && selectedSenior.ailments.length > 0
                                ? `e.g., How can I help ${selectedSenior.name} manage their ${selectedSenior.ailments[0].name}?`
                                : "e.g., How can I prevent falls at home?"
                        }
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                        rows={3}
                    />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className="flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><Loader /> <span className="ml-2">Getting Advice...</span></> : 'Submit Question'}
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateChecklist}
                            disabled={isChecklistLoading}
                            className="flex justify-center items-center py-3 px-4 border border-brand-blue text-brand-blue rounded-md shadow-sm text-sm font-medium bg-white hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                            {isChecklistLoading ? (
                                <>
                                    <Loader />
                                    <span className="ml-2">Generating...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Generate Facility Checklist
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Feature Description with Examples */}
            <div className="bg-gradient-to-r from-brand-blue-light to-blue-50 p-6 rounded-xl shadow-lg mb-8">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-brand-blue-dark mb-3">Two Powerful AI Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-6">
                        <div>
                            <h4 className="font-semibold text-brand-gray-dark mb-2">💬 Ask Questions</h4>
                            <p className="text-sm text-brand-gray-medium">
                                Get instant, AI-powered answers to your caregiving questions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-brand-gray-dark mb-2">📋 Facility Checklist</h4>
                            <p className="text-sm text-brand-gray-medium">
                                Generate personalized questions for visiting care facilities.
                            </p>
                        </div>
                    </div>

                    {/* Custom Examples - Only show when no advice is displayed */}
                    {!advice && !isLoading && !error && (
                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-brand-gray-dark mb-3 text-center">
                                {selectedSenior
                                    ? `Custom Questions for ${selectedSenior.name} - Clickable Below:`
                                    : 'Custom Questions - Clickable Below:'
                                }
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {examplePrompts.map(prompt => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleExampleClick(prompt)}
                                        className="p-3 bg-white rounded-lg shadow text-left text-sm text-brand-gray-dark hover:shadow-md hover:text-brand-blue-dark transition-all duration-200 cursor-pointer"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>





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
                <div ref={adviceRef} className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
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


                </div>
            )}

            {checklistError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-8">
                    <p className="font-bold">Error</p>
                    <p>{checklistError}</p>
                    <button
                        onClick={handleGenerateChecklist}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {checklistData && (
                <div ref={checklistRef} className="animate-fade-in">
                    <Checklist data={checklistData} topic={selectedSenior?.ailments?.length > 0
                        ? `Facility Checklist for ${selectedSenior.name} (${selectedSenior.ailments.map(a => a.name).join(', ')})`
                        : 'General Facility Assessment Checklist'
                    } />
                </div>
            )}

            {/* Coming Soon Section */}
            <div className="mt-8 flex items-center justify-start">
                <div className="flex items-center text-brand-gray-dark">
                    <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">Coming Soon: AI Driven Customized Audio and Video Guides</span>
                </div>
            </div>
        </div>
    );
};

export default CareAdvisor;