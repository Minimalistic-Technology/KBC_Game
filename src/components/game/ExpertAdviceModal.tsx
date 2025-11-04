'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

interface ExpertAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice: {
    text: string;
    confidence: number;
  };
}

export const ExpertAdviceModal = ({ isOpen, onClose, advice }: ExpertAdviceModalProps) => {
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="text-indigo-600" />
                <h2 className="text-xl font-bold">Expert Advice</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100">
                <X />
              </button>
            </div>
            
            <div className="my-6">
              <div className="bg-indigo-600 p-4 rounded-lg rounded-bl-none relative text-white">
                <p className="text-lg italic">"{advice.text}"</p>
                <div className="absolute left-0 -bottom-4 w-0 h-0 border-l-[16px] border-l-indigo-600 border-b-[16px] border-b-transparent" />
              </div>
              <p className="text-right mt-3 text-sm text-slate-500">
                Confidence: <span className="font-bold text-indigo-600">{advice.confidence}%</span>
              </p>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};