import React from 'react';

interface MarkdownRendererProps {
    text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
    const renderLine = (line: string, index: number) => {
        // Headings
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-brand-gray-dark mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-brand-gray-dark mt-6 mb-3">{line.substring(3)}</h2>;
        }

        // Bold text with **
        const boldedLine = line.split('**').map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-gray-dark">{part}</strong> : <span key={i}>{part}</span>
        );

        // Unordered list items
        if (line.startsWith('* ')) {
            const content = line.substring(2).trim();
            if (!content) return null; // Skip empty list items
            const boldedContent = content.split('**').map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-gray-dark">{part}</strong> : <span key={i}>{part}</span>
            );
            return <li key={index} className="ml-5 list-disc mb-1">{boldedContent}</li>;
        }
        if (line.startsWith('- ')) {
            const content = line.substring(2).trim();
            if (!content) return null; // Skip empty list items
            const boldedContent = content.split('**').map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-gray-dark">{part}</strong> : <span key={i}>{part}</span>
            );
            return <li key={index} className="ml-5 list-disc mb-1">{boldedContent}</li>;
        }

        // Numbered list items
        const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
        if (numberedMatch) {
            const content = numberedMatch[2];
            const boldedContent = content.split('**').map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-gray-dark">{part}</strong> : <span key={i}>{part}</span>
            );
            return <li key={index} className="ml-5 mb-1">{boldedContent}</li>
        }

        if (line.trim() === '') {
            return <br key={index} />;
        }

        return <p key={index} className="mb-2 leading-relaxed">{boldedLine}</p>;
    };

    const lines = text.split('\n');
    const elements = [];
    let listType: 'ul' | 'ol' | null = null;
    let currentList: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        const isUl = line.startsWith('* ') || line.startsWith('- ');
        const isOl = /^\d+\.\s/.test(line);

        if (isUl && listType !== 'ul') {
            if (currentList.length > 0) elements.push(listType === 'ol' ? <ol key={`list-${index}-prev`} className="list-decimal space-y-1 my-3">{currentList}</ol> : <ul key={`list-${index}-prev`} className="list-disc space-y-1 my-3">{currentList}</ul>);
            currentList = [];
            listType = 'ul';
        } else if (isOl && listType !== 'ol') {
            if (currentList.length > 0) elements.push(listType === 'ul' ? <ul key={`list-${index}-prev`} className="list-disc space-y-1 my-3">{currentList}</ul> : <ol key={`list-${index}-prev`} className="list-decimal space-y-1 my-3">{currentList}</ol>);
            currentList = [];
            listType = 'ol';
        } else if (!isUl && !isOl && listType) {
            if (currentList.length > 0) elements.push(listType === 'ol' ? <ol key={`list-${index}-prev`} className="list-decimal space-y-1 my-3">{currentList}</ol> : <ul key={`list-${index}-prev`} className="list-disc space-y-1 my-3">{currentList}</ul>);
            currentList = [];
            listType = null;
        }

        if (isUl || isOl) {
            const listItem = renderLine(line, index);
            if (listItem !== null) {
                currentList.push(listItem);
            }
        } else {
            const element = renderLine(line, index);
            if (element !== null) {
                elements.push(element);
            }
        }
    });

    if (currentList.length > 0) {
        elements.push(listType === 'ol' ? <ol key="list-final" className="list-decimal space-y-1 my-3">{currentList}</ol> : <ul key="list-final" className="list-disc space-y-1 my-3">{currentList}</ul>);
    }

    return <div className="prose prose-slate max-w-none">{elements}</div>;
};

export default MarkdownRenderer;
