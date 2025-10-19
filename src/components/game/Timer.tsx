'use client';

import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

export const Timer = ({ duration, onTimeUp, isPaused }: TimerProps) => {
  useEffect(() => {
    // If the timer is paused, do nothing.
    if (isPaused) {
      return;
    }

    const timer = setTimeout(() => {
      onTimeUp();
    }, duration * 1000);

    // This cleanup function will run when the component re-renders
    // (e.g., when isPaused becomes true), clearing the old timeout.
    return () => clearTimeout(timer);
  }, [duration, onTimeUp, isPaused]); // Add isPaused to the dependency array

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg p-3 h-16 flex items-center gap-4">
      <Clock className="text-indigo-600" size={24} />
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-4 rounded-full origin-left"
          style={{
            animation: `shrink ${duration}s linear forwards`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  );
};