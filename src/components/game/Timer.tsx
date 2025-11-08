'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;               // true when user selected an option
  onTimeTaken?: (secs: number) => void; // called on pause or timeout
  questionKey?: string | number;   // change this per question to reset (e.g., question.id)
}

export const Timer = ({ duration, onTimeUp, isPaused, onTimeTaken, questionKey }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const firedRef = useRef(false);           // prevents multiple onTimeUp fires
  const prevPausedRef = useRef(isPaused);   // detect running -> paused transition

  // Reset for new question
  useEffect(() => {
    setTimeLeft(duration);
    firedRef.current = false;
    prevPausedRef.current = false;
  }, [duration, questionKey]);

  // Countdown / timeout
  useEffect(() => {
  if (isPaused || firedRef.current) return;

  if (timeLeft <= 0) {
    firedRef.current = true;
    onTimeUp();
    return;
  }

  const id = setInterval(() => {
    setTimeLeft(t => Math.max(0, t - 1));
  }, 1000);
  return () => clearInterval(id);

// ⬇️ remove onTimeTaken from deps
}, [timeLeft, isPaused, onTimeUp, duration]);

  // Detect answer selection: running -> paused
  useEffect(() => {
    const wasRunning = !prevPausedRef.current;
    const nowPaused = isPaused;

    if (wasRunning && nowPaused && !firedRef.current) {
      firedRef.current = true;
      const spent = Math.min(duration, Math.max(0, duration - timeLeft));
      onTimeTaken?.(spent);
    }
    prevPausedRef.current = isPaused;
  }, [isPaused, duration, timeLeft, onTimeTaken]);

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