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
        {/* Active indicator */}
        {isSelected && <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600"></div>}

        <div className="flex justify-between items-start gap-4">
          <p className={`font-medium pr-4 ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>
            {question.question || 'Untitled Question'}
          </p>
          <span className={`flex-shrink-0 bg-slate-100 border text-slate-700 font-semibold text-xs py-1 px-3 rounded-full ${isSelected ? 'bg-indigo-100 border-indigo-200 text-indigo-800' : 'border-slate-200'}`}>
            Level {question.level}
          </span>
        </div>
      </button>
    </li>
  );
};