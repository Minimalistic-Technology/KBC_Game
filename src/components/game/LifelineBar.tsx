'use client';

import type { Lifeline } from '@/lib/types1';
import { Zap, Users, Lightbulb, RefreshCw } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

interface LifelineBarProps {
  lifelines: Lifeline;
  usedLifelines: { [key in keyof Lifeline]?: boolean };
  onUseLifeline: (lifelineName: keyof Lifeline) => void;
}

interface LifelineButtonProps {
  icon: React.ElementType;
  label: keyof Lifeline;
  isAvailable: boolean;
  isUsed?: boolean;
  onClick: () => void;
}

const LifelineButton = ({ icon: Icon, label, isAvailable, isUsed, onClick }: LifelineButtonProps) => {
  if (!isAvailable) return null;

  const isButtonDisabled = isUsed ?? false;

  return (
    <motion.button
      onClick={onClick}
      disabled={isButtonDisabled}
      className="relative flex flex-col items-center justify-center bg-white border-2 border-slate-200 rounded-full w-16 h-16 md:w-20 md:h-20 transition-all duration-300 disabled:cursor-not-allowed group"
      whileHover={isButtonDisabled ? {} : { scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
      whileTap={isButtonDisabled ? {} : { scale: 0.95 }}
    >
      <Icon 
        size={24}
        className={`transition-colors ${isButtonDisabled ? 'text-slate-300' : 'text-indigo-600 group-hover:text-indigo-500'}`} 
      />
      <span 
        className={`text-[10px] font-bold mt-1 transition-colors ${isButtonDisabled ? 'text-slate-300' : 'text-slate-600 group-hover:text-indigo-500'}`}
      >
        {label === 'Audience Poll' ? 'Poll' : label === 'Expert Advice' ? 'Advice' : label === 'Flip Question' ? 'Flip' : label}
      </span>
      {isButtonDisabled && (
        <div className="absolute top-1/2 left-1/2 w-[120%] h-1 bg-red-500/80 transform -translate-x-1/2 -translate-y-1/2 rotate-[30deg] rounded-full" />
      )}
    </motion.button>
  );
};

export const LifelineBar = ({ lifelines, usedLifelines, onUseLifeline }: LifelineBarProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2 md:p-4 shadow-md">
      <div className="grid grid-cols-4 gap-1 md:gap-2">
        <LifelineButton
          label="50:50"
          icon={Zap}
          isAvailable={lifelines['50:50']}
          isUsed={usedLifelines['50:50']}
          onClick={() => onUseLifeline('50:50')}
        />
        <LifelineButton
          label="Audience Poll"
          icon={Users}
          isAvailable={lifelines['Audience Poll']}
          isUsed={usedLifelines['Audience Poll']}
          onClick={() => onUseLifeline('Audience Poll')}
        />
        <LifelineButton
          label="Expert Advice"
          icon={Lightbulb}
          isAvailable={lifelines['Expert Advice']}
          isUsed={usedLifelines['Expert Advice']}
          onClick={() => onUseLifeline('Expert Advice')}
        />
        <LifelineButton
          label="Flip Question"
          icon={RefreshCw}
          isAvailable={lifelines['Flip Question']}
          isUsed={usedLifelines['Flip Question']}
          onClick={() => onUseLifeline('Flip Question')}
        />
      </div>
    </div>
  );
};