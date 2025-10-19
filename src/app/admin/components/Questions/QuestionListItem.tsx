'use client';

import type { Question } from '@/lib/types';

interface ListItemProps {
  question: Question;
  isSelected: boolean;
  onClick: () => void;
}

export const QuestionListItem = ({ question, isSelected, onClick }: ListItemProps) => {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`w-full text-left p-6 transition-colors relative ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
      >
        {isSelected && <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600"></div>}

        <p className={`font-medium ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>
          {question.question || 'Untitled Question'}
        </p>
      </button>
    </li>
  );
};