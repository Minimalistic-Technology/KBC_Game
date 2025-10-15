'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Frown, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
  winnings: number;
  isWinner: boolean;
}

export const GameOverModal = ({ isOpen, onRestart, winnings, isWinner }: GameOverModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-8 text-slate-800 shadow-xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
              // --- CORRECTED TRANSITION ---
              // We define separate transitions for scale (spring) and rotate (default tween)
              transition={{
                scale: { delay: 0.2, type: 'spring', stiffness: 200 },
                rotate: { delay: 0.4, duration: 0.5 }
              }}
              className={`mx-auto bg-${isWinner ? 'indigo' : 'slate'}-100 rounded-full w-20 h-20 flex items-center justify-center mb-4`}
            >
              {isWinner ? (
                <PartyPopper className="text-indigo-600" size={48} />
              ) : (
                <Frown className="text-slate-600" size={48} />
              )}
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isWinner ? "Congratulations!" : "Game Over"}
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              You're walking away with
            </p>
            <p className="text-5xl font-bold text-indigo-600 mb-8">
              ${winnings.toLocaleString()}
            </p>

            <button
              onClick={onRestart}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
            >
              <RotateCcw size={20} />
              <span>Play Again</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};