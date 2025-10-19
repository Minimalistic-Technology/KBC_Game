'use client';

import type { PrizeLevel } from '@/lib/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrizeLadderProps {
  prizeLadder: PrizeLevel[];
  currentLevel: number;
}

export const PrizeLadder = ({ prizeLadder, currentLevel }: PrizeLadderProps) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg p-4 h-full flex flex-col shadow-md">
      <h2 className="text-center text-lg font-bold text-indigo-600 mb-4">Prize Money</h2>
      <ol className="relative flex flex-col-reverse justify-end flex-grow gap-1">
        {prizeLadder.map((item) => {
          const isCurrent = item.level === currentLevel;
          const isAchieved = item.level < currentLevel;
          
          return (
            <li
              key={item.id}
              className={`relative flex items-center justify-between p-3 rounded-md text-sm transition-all duration-300 z-10
                ${item.isSafe ? 'font-bold text-slate-800' : 'text-slate-500'}
                ${isAchieved ? 'text-indigo-600' : ''}
                ${isCurrent ? 'text-white' : ''}
              `}
            >
              {isCurrent && (
                <motion.div
                  layoutId="currentLevelHighlight"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-md shadow-lg z-0 shadow-indigo-500/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <span className="relative w-6 text-left">{item.level}</span>
              <span className="relative flex-grow text-center tracking-wider">${item.amount.toLocaleString()}</span>
              <span className="relative w-6 text-right">
                {item.isSafe && <Star size={16} className={isAchieved || isCurrent ? 'text-white' : 'text-slate-400'} />}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};