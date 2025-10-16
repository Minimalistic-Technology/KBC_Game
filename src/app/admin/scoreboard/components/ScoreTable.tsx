'use client';

import { useState, useMemo } from 'react';
import { PlayerDetailModal } from './PlayerDetailModal';
import { Score } from './data';

type SortConfig = {
  key: keyof Score;
  direction: 'ascending' | 'descending';
} | null;

const SortableHeader = ({ children, onClick, sortConfig, columnKey }: any) => {
  const isSorted = sortConfig?.key === columnKey;
  const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';

  return (
    <button onClick={onClick} className="flex items-center gap-2 group">
      {children}
      <span className={`text-indigo-500 ${isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        {directionIcon}
      </span>
    </button>
  );
};

export const ScoreTable = ({ scores }: { scores: Score[] }) => {
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });

  const sortedScores = useMemo(() => {
    let sortableScores = [...scores];
    if (sortConfig !== null) {
      sortableScores.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableScores;
  }, [scores, sortConfig]);

  const requestSort = (key: keyof Score) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                <SortableHeader onClick={() => requestSort('playerName')} sortConfig={sortConfig} columnKey="playerName">Player Name</SortableHeader>
              </th>
              <th scope="col" className="px-6 py-3">Question Bank</th>
              <th scope="col" className="px-6 py-3">
                <SortableHeader onClick={() => requestSort('finalScore')} sortConfig={sortConfig} columnKey="finalScore">Final Score</SortableHeader>
              </th>
              <th scope="col" className="px-6 py-3">
                 <SortableHeader onClick={() => requestSort('date')} sortConfig={sortConfig} columnKey="date">Date</SortableHeader>
              </th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map((score) => (
              <tr key={score.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{score.playerName}</td>
                <td className="px-6 py-4">{score.questionBank}</td>
                <td className="px-6 py-4 font-semibold text-indigo-600">{score.finalScore}%</td>
                <td className="px-6 py-4">
                  {new Date(score.date).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setSelectedScore(score)} className="font-medium text-indigo-600 hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
             {scores.length === 0 && (
                <tr className="bg-white">
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No results found.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedScore && (
        <PlayerDetailModal score={selectedScore} onClose={() => setSelectedScore(null)} />
      )}
    </>
  );
};