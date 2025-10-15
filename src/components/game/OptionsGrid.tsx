'use client';

import { motion } from 'framer-motion';

interface OptionsGridProps {
  options: string[];
  correctAnswer: string;
  selectedOption: string | null;
  answerState: 'idle' | 'revealed';
  onOptionSelect: (option: string) => void;
  removedOptions: string[];
}

export const OptionsGrid = ({ 
  options, 
  correctAnswer, 
  selectedOption, 
  answerState,
  onOptionSelect,
  removedOptions,
}: OptionsGridProps) => {

  const getButtonClass = (option: string) => {
    const baseClass = "w-full text-left p-5 rounded-lg border-2 font-semibold transition-all duration-300 flex items-center gap-4 text-xl disabled:cursor-not-allowed min-h-[80px]";
    
    if (answerState === 'revealed') {
      if (option === correctAnswer) return `${baseClass} bg-green-500 border-green-400 text-white animate-pulse`;
      if (option === selectedOption) return `${baseClass} bg-red-500 border-red-400 text-white`;
      return `${baseClass} bg-slate-100 border-slate-200 text-slate-400 opacity-60`;
    }

    if (option === selectedOption) {
      return `${baseClass} bg-gradient-to-r from-indigo-500 to-violet-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/50`;
    }

    return `${baseClass} bg-white border-slate-300 hover:bg-slate-50 hover:border-indigo-500`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <motion.button
          key={option}
          onClick={() => onOptionSelect(option)}
          disabled={selectedOption !== null}
          className={getButtonClass(option)}
          style={{
            visibility: removedOptions.includes(option) ? 'hidden' : 'visible'
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <span className="text-indigo-600">{optionLabels[index]}:</span>
          <span>{option}</span>
        </motion.button>
      ))}
    </div>
  );
};