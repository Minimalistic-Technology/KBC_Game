'use client';

import React, { useState, useEffect } from 'react';
import { allQuestions } from '@/lib/data';
import type { Question } from '@/lib/types';

// We'll create these components in the next steps
// import { GameHUD } from '@/components/game/GameHUD';
// import { QuestionCard } from '@/components/game/QuestionCard';
// import { OptionsGrid } from '@/components/game/OptionsGrid';
// import { LifelineBar } from '@/components/game/LifelineBar';
// import { PrizeLadder } from '@/components/game/PrizeLadder';

export default function GamePage() {
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (questions.length > 0) {
      setActiveQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  if (!activeQuestion) {
    return (
      // UPDATED: Theme matches lobby
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p>Loading Game...</p>
      </main>
    );
  }

  return (
    // UPDATED: Theme matches lobby (background, padding)
    <main className="grid min-h-screen grid-cols-1 gap-6 bg-slate-50 p-4 lg:grid-cols-4">
      {/* Main Game Area */}
      <div className="flex flex-col gap-6 lg:col-span-3">
        {/* Placeholder for GameHUD */}
        {/* UPDATED: Styling for light theme */}
        <div className="h-16 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center text-slate-500">
          GameHUD (Progress, Bank Name)
        </div>
        
        {/* Placeholder for QuestionCard */}
        {/* UPDATED: Styling for light theme */}
        <div className="flex-grow rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center text-slate-500">
          QuestionCard (Question, Media)
        </div>
        
        {/* Placeholder for OptionsGrid and LifelineBar */}
        {/* UPDATED: Styling for light theme */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 flex flex-col items-center justify-center gap-4 text-slate-500">
            OptionsGrid & LifelineBar
        </div>
      </div>

      {/* Sidebar Area */}
      <aside className="hidden lg:block">
        {/* Placeholder for PrizeLadder */}
        {/* UPDATED: Styling for light theme */}
        <div className="h-full rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center text-slate-500">
          PrizeLadder
        </div>
      </aside>
    </main>
  );
}
