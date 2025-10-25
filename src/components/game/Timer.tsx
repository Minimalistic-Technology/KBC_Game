'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

export const Timer = ({ duration, onTimeUp, isPaused }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // This effect resets the timer when a new question appears (i.e., duration changes)
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onTimeUp();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp, isPaused]);

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
      <div className="text-xl font-bold text-slate-700 w-16 text-right">
        {timeLeft}s
      </div>
    </div>
  );
};