'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { level1Questions, level2Questions, level3Questions, shuffleArray } from '@/lib/data';
import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, RotateCw, Lock, Sparkles, AlertTriangle, Clock } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2, ease: "easeIn" } },
} as const;

const PASSING_SCORES = {
  1: 10,
  2: 20,
};

const TIME_LIMIT_SECONDS = 15;

export default function QuizPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [newLevelUnlocked, setNewLevelUnlocked] = useState<number | null>(null);
  const [timer, setTimer] = useState(TIME_LIMIT_SECONDS);

  // Load unlocked levels from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizUnlockedLevels');
    if (savedProgress) {
      setUnlockedLevels(JSON.parse(savedProgress));
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  // --- Refactored Timer Logic ---
  useEffect(() => {
    if (isAnswered || showResults) {
      return; // Stop the timer if an answer is selected or the quiz is over
    }

    // Reset timer for the new question
    setTimer(TIME_LIMIT_SECONDS);

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsAnswered(true); // Time's up, lock the answer
          setTimeout(() => handleNext(), 2000); // Wait 2s, then move on
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [currentQuestionIndex, isAnswered, showResults, handleNext]);
  
  // Check for new level unlock when results are shown
  useEffect(() => {
    if (showResults && selectedLevel) {
      const passingScore = PASSING_SCORES[selectedLevel as keyof typeof PASSING_SCORES];
      const nextLevel = selectedLevel + 1;

      if (score >= passingScore && !unlockedLevels.includes(nextLevel) && nextLevel <= 3) {
        const newUnlockedLevels = [...unlockedLevels, nextLevel];
        setUnlockedLevels(newUnlockedLevels);
        localStorage.setItem('quizUnlockedLevels', JSON.stringify(newUnlockedLevels));
        setNewLevelUnlocked(nextLevel);
      } else {
        setNewLevelUnlocked(null);
      }
    }
  }, [showResults, score, selectedLevel, unlockedLevels]);

  const handleLevelSelect = (level: number) => {
    if (!unlockedLevels.includes(level)) return;
    
    let questionsToSet: Question[] = [];
    if (level === 1) questionsToSet = level1Questions;
    if (level === 2) questionsToSet = level2Questions;
    if (level === 3) questionsToSet = level3Questions;

    const shuffledQuestions = questionsToSet.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    
    setCurrentQuestions(shuffledQuestions);
    setSelectedLevel(level);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };
  
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    const isCorrect = currentQuestions[currentQuestionIndex].answer === option;
    setSelectedOption(option);
    setIsAnswered(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };
  
  const resetQuiz = () => {
    setSelectedLevel(null);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };
  
  const question = currentQuestions[currentQuestionIndex];

  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-700';
    if (option === question.answer) return 'bg-green-100 border-green-500 text-green-800 cursor-not-allowed';
    if (option === selectedOption) return 'bg-red-100 border-red-500 text-red-800 cursor-not-allowed';
    return 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed';
  };

  const LevelButton = ({ level, title, color, questionsCount }: { level: number, title: string, color: string, questionsCount: number }) => {
    const isLocked = !unlockedLevels.includes(level);
    const baseColor = `text-${color}-800 bg-${color}-100 border-${color}-200`;
    const hoverColor = `hover:bg-${color}-200`;
    
    return (
      <button
        onClick={() => handleLevelSelect(level)}
        disabled={isLocked}
        className={`w-full p-5 text-lg font-bold rounded-xl border-2 transition-all flex justify-between items-center ${
          isLocked ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed' : `${baseColor} ${hoverColor}`
        }`}
      >
        <span>{title} ({questionsCount} Questions)</span>
        {isLocked && <Lock size={24} />}
      </button>
    );
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 pt-24 pb-12 px-4">
        <AnimatePresence mode="wait">
          {!selectedLevel ? (
            <motion.div key="level-select" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Select a Difficulty</h1>
              {/* <p className="text-slate-500 mb-8">You must pass a level with 70% to unlock the next.</p> */}
              <div className="space-y-4">
                <LevelButton level={1} title="Level 1: Easy" color="green" questionsCount={10} />
                <LevelButton level={2} title="Level 2: Medium" color="yellow" questionsCount={20} />
                <LevelButton level={3} title="Level 3: Hard" color="red" questionsCount={30} />
              </div>
            </motion.div>
          ) : showResults ? (
            <motion.div key="results" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Quiz Complete!</h2>
                {newLevelUnlocked && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="p-4 my-6 bg-green-100 text-green-800 rounded-lg flex items-center justify-center gap-3">
                    <Sparkles />
                    <span className="font-semibold">Congratulations! You've unlocked Level {newLevelUnlocked}!</span>
                  </motion.div>
                )}
                {selectedLevel && score < PASSING_SCORES[selectedLevel as keyof typeof PASSING_SCORES] && selectedLevel < 3 && (
                   <div className="p-4 my-6 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center gap-3">
                      <AlertTriangle />
                      <span className="font-semibold">Almost there! You need {PASSING_SCORES[selectedLevel as keyof typeof PASSING_SCORES]} points to pass.</span>
                   </div>
                )}
                <p className="text-2xl text-slate-600 mb-8">Your final score is</p>
                <div className="mb-8"><span className="text-7xl font-bold text-indigo-600">{score}</span><span className="text-4xl text-slate-400"> / {currentQuestions.length}</span></div>
                <button onClick={resetQuiz} className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all inline-flex items-center gap-2"><RotateCw size={20}/> Play Again</button>
            </motion.div>
          ) : (
            <motion.div key={currentQuestionIndex} variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="p-8 bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
              <div className="flex justify-between items-center mb-6">
                <button onClick={resetQuiz} className="flex items-center gap-2 font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} /> Back to Levels</button>
                <div className={`flex items-center gap-2 font-bold text-lg p-2 rounded-full transition-colors ${timer <= 5 ? 'text-red-600 bg-red-100' : 'text-slate-700'}`}>
                  <Clock size={20} />
                  <span>{timer}</span>
                </div>
                <h2 className="text-xl font-bold text-indigo-600 bg-indigo-100 px-4 py-1 rounded-full">Level {selectedLevel}</h2>
              </div>
              <div className="text-sm text-slate-500 mb-4 text-center font-semibold">Question {currentQuestionIndex + 1} of {currentQuestions.length}</div>
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