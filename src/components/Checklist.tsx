import React, { useState, useId } from 'react';
import { ChecklistResponse } from '@/types';

interface ChecklistProps {
    data: ChecklistResponse;
    topic: string;
}

const Checklist: React.FC<ChecklistProps> = ({ data, topic }) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const componentId = useId();

    const handleCheckboxChange = (question: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [question]: !prev[question]
        }));
    };

    return (
        <div className="animate-fade-in space-y-4">
            <h2 className="text-2xl font-bold text-brand-gray-dark">
                Facility Checklist for: <span className="text-brand-blue-dark">{topic}</span>
            </h2>
            <p className="text-brand-gray-medium">Use these questions to guide your conversation with potential care facilities.</p>

            <div className="space-y-6">
                {data?.checklist?.map((category, catIndex) => (
                    <div key={`${componentId}-cat-${catIndex}`} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <h3 className="text-lg font-bold text-brand-gray-dark mb-3">{category.category}</h3>
                        <ul className="space-y-3">
                            {category?.questions?.map((question, qIndex) => {
                                const questionId = `${componentId}-q-${catIndex}-${qIndex}`;
                                const isChecked = !!checkedItems[question];
                                return (
                                    <li key={questionId} className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id={questionId}
                                            checked={isChecked}
                                            onChange={() => handleCheckboxChange(question)}
                                            className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue-dark mt-0.5 shrink-0"
                                        />
                                        <label
                                            htmlFor={questionId}
                                            className={`ml-3 text-sm text-brand-gray-dark transition-colors ${isChecked ? 'line-through text-brand-gray-medium' : ''}`}
                                        >
                                            {question}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Checklist;