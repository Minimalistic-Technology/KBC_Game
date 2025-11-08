'use client';

import { useState } from 'react';
import { PlayerDetailModal } from './PlayerDetailModal';
import { ChevronRight } from 'lucide-react';

type ApiScore = {
  _id: string;
  userName:string;
  userId: string;
  finalScore: number;
  isWinner: boolean;
  totalTimeSeconds?: number;
  createdAt: string;
  lifelinesUsed?: string[];
  questions?: unknown[]; // or your concrete question type
};

function shorten(id: string) {
  if (!id) return '-';
  return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-GB'); } catch { return iso; }
}

function formatDuration(sec?: number) {
  if (typeof sec !== 'number') return '-';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export const ScoreTable = ({ scores }: { scores: ApiScore[] }) => {
  // ✅ keep the FULL row here so the modal has all fields
  const [selectedScore, setSelectedScore] = useState<ApiScore | null>(null);

  return (
    <>
      <div className="space-y-3">
        {scores.map((row) => (
          <div
            key={row._id}
            onClick={() => setSelectedScore(row)}  // ✅ pass full row
            className="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  row.isWinner ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {row.isWinner ? 'Winner' : 'Played'}
              </span>

              <p className="text-base font-semibold text-slate-800">
                {row.userName}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden text-right md:block">
                <p className="text-xs text-slate-500">Time</p>
                <p className="font-medium text-slate-700">
                  {formatDuration(row.totalTimeSeconds)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">Score</p>
                <p className="font-bold text-indigo-600">{row.finalScore}%</p>
              </div>

              <div className="hidden text-right md:block">
                <p className="font-medium text-slate-700">
                  {formatDate(row.createdAt)}
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
          </div>
        )}
      </div>

{selectedScore && (
  <PlayerDetailModal
    score={selectedScore as ApiScore}
    onClose={() => setSelectedScore(null)}
  />
)}
    </>
  );
};
