'use client';

import { ListOrdered, Package } from 'lucide-react';

interface GameHUDProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  bankTitle: string;
}

export const GameHUD = ({ currentQuestionIndex, totalQuestions, bankTitle }: GameHUDProps) => {
  return (
    <div className="flex items-center justify-between text-sm px-2">
      <div className="flex items-center gap-2 text-slate-500">
        <ListOrdered size={16} />
        <span className="font-semibold">
          Question {currentQuestionIndex + 1}
          <span className="text-slate-400"> / {totalQuestions}</span>
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-md">
        <Package size={14} />
        <span>{bankTitle}</span>
      </div>
    </div>
  );
};