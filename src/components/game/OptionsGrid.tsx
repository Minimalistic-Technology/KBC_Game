'use client';

import { motion } from 'framer-motion';

interface OptionsGridProps {
  options: string[];
  correctAnswer?: string; // For single answer
  correctAnswers?: string[]; // For multi-answer
  selectedOption?: string | null; // For single answer
  selectedOptions?: string[]; // For multi-answer
  answerState: 'idle' | 'revealed';
  onOptionSelect: (option: string) => void;
  removedOptions: number[];
  doubleDipWrongAnswer?: string | null;
  isMultiAnswer?: boolean; // Flag to determine mode
}

export const OptionsGrid = ({
  options,
  correctAnswer,
  correctAnswers = [],
  selectedOption,
  selectedOptions = [],
  answerState,
  onOptionSelect,
  removedOptions,
  doubleDipWrongAnswer,
  isMultiAnswer = false,
}: OptionsGridProps) => {
  const getButtonClass = (option: string) => {
    const baseClass =
      'w-full text-left p-5 rounded-lg border-2 font-semibold transition-all duration-300 flex items-center gap-4 text-xl disabled:cursor-not-allowed min-h-[80px]';

    const isSelected = isMultiAnswer ? selectedOptions.includes(option) : option === selectedOption;
    const isCorrect = isMultiAnswer ? correctAnswers.includes(option) : option === correctAnswer;

    // Show first Double Dip wrong answer in red (without revealing correct answer)
    if (doubleDipWrongAnswer && option === doubleDipWrongAnswer && answerState === 'idle') {
      return `${baseClass} bg-red-500 border-red-400 text-white`;
    }

    if (answerState === 'revealed') {
      if (isCorrect)
        return `${baseClass} bg-green-500 border-green-400 text-white animate-pulse`;
      if (isSelected && !isCorrect)
        return `${baseClass} bg-red-500 border-red-400 text-white`;
      return `${baseClass} bg-slate-100 border-slate-200 text-slate-400 opacity-60`;
    }

    if (isSelected) {
      return `${baseClass} bg-gradient-to-r from-indigo-500 to-violet-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/50`;
    }

    return `${baseClass} bg-white border-slate-300 hover:bg-slate-50 hover:border-indigo-500`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => {
        const isRemoved = removedOptions.includes(index);
        const isFirstDoubleDipWrong = doubleDipWrongAnswer && option === doubleDipWrongAnswer;

        // For multi-answer: always allow clicking if not revealed and not removed
        // For single-answer: use existing Double Dip logic
        const isDisabled = isMultiAnswer
          ? (answerState === 'revealed' || isRemoved)
          : (isRemoved || isFirstDoubleDipWrong || (selectedOption !== null && !doubleDipWrongAnswer));

        return (
          <motion.button
            key={`${index}-${option}`}
            onClick={() => onOptionSelect(option)}
            disabled={isDisabled}
            className={getButtonClass(option)}
            style={{
              visibility: isRemoved ? 'hidden' : 'visible',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <span className="text-indigo-600">{optionLabels[index]}:</span>
            <span>{option}</span>
            {isMultiAnswer && selectedOptions.includes(option) && answerState === 'idle' && (
              <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">✓</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};