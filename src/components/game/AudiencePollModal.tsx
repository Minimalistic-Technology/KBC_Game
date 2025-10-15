'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';

interface PollResult {
  option: string;
  percentage: number;
}

interface AudiencePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollResults: PollResult[];
}

export const AudiencePollModal = ({ isOpen, onClose, pollResults }: AudiencePollModalProps) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-800 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" />
                <h2 className="text-xl font-bold">Audience Poll</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100">
                <X />
              </button>
            </div>
            
            <div className="flex justify-around items-end h-64 gap-4 px-4">
              {pollResults.map((result, index) => (
                <div key={result.option} className="flex flex-col items-center flex-1 h-full">
                  <span className="font-bold text-lg mb-2">{result.percentage}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${result.percentage}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="w-full bg-indigo-500 rounded-t-md"
                  />
                  <span className="mt-3 font-bold text-xl text-indigo-600">{optionLabels[index]}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};