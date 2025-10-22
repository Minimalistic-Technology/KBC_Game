'use client';

import { useState } from 'react';
import { PlayerDetailModal } from './PlayerDetailModal';
import { Score } from '@/types';
import { ChevronRight } from 'lucide-react';

export const ScoreTable = ({ scores }: { scores: Score[] }) => {
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);

  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="space-y-3">
        {scores.map((score) => (
          <div
            key={score.sessionId}
            onClick={() => setSelectedScore(score)}
            className="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
          >
            <div>
              <p className="text-base font-semibold text-slate-800">{score.playerName}</p>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden text-right md:block">
                <p className="font-medium text-slate-700">{score.bankId}</p>
                <p className="text-xs text-slate-500">Question Bank</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">Prize Money</p>
                <p className="font-bold text-indigo-600">{formatPrize(score.prizeWon)}</p>
              </div>

              <div className="hidden text-right md:block">
                <p className="font-medium text-slate-700">
                  {new Date(score.timestamp).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                </p>
                <p className="text-xs text-slate-500">Date Played</p>
              </div>
              
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        ))}

        {scores.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <p>No results found.</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {selectedScore && (
        <PlayerDetailModal 
          scoreSummary={selectedScore} 
          onClose={() => setSelectedScore(null)} 
        />
      )}
    </>
  );
};