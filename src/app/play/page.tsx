import Link from 'next/link';
import { Box, Play } from 'lucide-react';
import { initialBanks } from '@/lib/data';
import type { QuestionBank } from '@/lib/types';

export default function LobbyPage() {
  const gameSessionBanks: QuestionBank[] = initialBanks;

  return (
    // UPDATED: Added bg-slate-50 for the light page background
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Box className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Your Quiz Session
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            The following topics will be covered in order. Good luck!
          </p>
        </div>
        
        <div className="my-6">
          <ul className="space-y-3">
            {gameSessionBanks.map((bank, index) => (
              <li 
                key={bank.id} 
                className="flex items-center gap-4 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-semibold text-slate-800">{bank.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <Link 
            href="/play/game" 
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span>Start Game</span>
            <Play className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}