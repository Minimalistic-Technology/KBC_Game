'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { level1Questions, shuffleArray } from '@/lib/data';
import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCw, Clock } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2, ease: "easeIn" } },
} as const;

const TIME_LIMIT_SECONDS = 15;

export default function QuizPage() {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(TIME_LIMIT_SECONDS);

  const startQuiz = useCallback(() => {
    const shuffledQuestions = level1Questions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    
    setCurrentQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  }, []);

  // Initialize quiz on component mount
  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  useEffect(() => {
    if (isAnswered || showResults || currentQuestions.length === 0) {
      return;
    }
    setTimer(TIME_LIMIT_SECONDS);
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsAnswered(true);
          setTimeout(() => handleNext(), 2000);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, isAnswered, showResults, handleNext, currentQuestions.length]);
  
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    const isCorrect = currentQuestions[currentQuestionIndex].answer === option;
    setSelectedOption(option);
    setIsAnswered(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };
  
  const question = currentQuestions[currentQuestionIndex];

  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-700';
    if (option === question.answer) return 'bg-green-100 border-green-500 text-green-800 cursor-not-allowed';
    if (option === selectedOption) return 'bg-red-100 border-red-500 text-red-800 cursor-not-allowed';
    return 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed';
  };

  if (currentQuestions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
        <p>Loading Quiz...</p>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 pt-24 pb-12 px-4">
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div key="results" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Quiz Complete!</h2>
                <p className="text-2xl text-slate-600 mb-8">Your final score is</p>
                <div className="mb-8"><span className="text-7xl font-bold text-indigo-600">{score}</span><span className="text-4xl text-slate-400"> / {currentQuestions.length}</span></div>
                <button onClick={startQuiz} className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all inline-flex items-center gap-2"><RotateCw size={20}/> Play Again</button>
            </motion.div>
          ) : (
            <motion.div key={currentQuestionIndex} variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="p-8 bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-slate-500 font-semibold">Question {currentQuestionIndex + 1} of {currentQuestions.length}</div>
                <div className={`flex items-center gap-2 font-bold text-lg p-2 rounded-full transition-colors ${timer <= 5 ? 'text-red-600 bg-red-100' : 'text-slate-700'}`}>
                  <Clock size={20} />
                  <span>{timer}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl mb-6 min-h-[120px] flex items-center justify-center border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-800 text-center">{question?.question}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {question?.options.map((option, index) => (
                  <button key={index} onClick={() => handleOptionSelect(option)} disabled={isAnswered} className={`p-4 rounded-lg transition-colors text-left font-semibold border-2 flex items-center justify-between ${getButtonClass(option)}`}>
                    <span><span className="font-bold mr-3">{String.fromCharCode(65 + index)}</span>{option}</span>
                    {isAnswered && option === question.answer && <CheckCircle2 className="text-green-600"/>}
                    {isAnswered && selectedOption === option && option !== question.answer && <XCircle className="text-red-600"/>}
                  </button>
                ))}
              </div>
              <div className="flex justify-end items-center">
                <button onClick={handleNext} disabled={!isAnswered} className="px-10 py-3 font-bold text-white bg-slate-800 rounded-lg hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed">
                  {currentQuestionIndex === currentQuestions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}