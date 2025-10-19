'use client';

import React, { useState, useEffect } from 'react';
import type { Question, Lifeline } from '@/lib/types';
import { allQuestions, initialBanks } from '@/lib/data';

import { PrizeLadder } from '@/components/game/PrizeLadder';
import { LifelineBar } from '@/components/game/LifelineBar';
import { GameHUD } from '@/components/game/GameHUD';
import { QuestionCard } from '@/components/game/QuestionCard';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { Timer } from '@/components/game/Timer';
import { AudiencePollModal } from '@/components/game/AudiencePollModal';
import { ExpertAdviceModal } from '@/components/game/ExpertAdviceModal';
import { GameOverModal } from '@/components/game/GameOverModal';
import { motion, AnimatePresence } from 'framer-motion';

type AnswerState = 'idle' | 'revealed';
type GameState = 'playing' | 'gameOver';

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [usedLifelines, setUsedLifelines] = useState<{ [key in keyof Lifeline]?: boolean }>({});

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);

  const [gameState, setGameState] = useState<GameState>('playing');
  const [finalWinnings, setFinalWinnings] = useState(0);
  const [isWinner, setIsWinner] = useState(false);

  const [isPollOpen, setIsPollOpen] = useState(false);
  const [pollResults, setPollResults] = useState<{ option: string; percentage: number }[]>([]);

  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [expertAdvice, setExpertAdvice] = useState<{ text: string; confidence: number } | null>(null);
  
  const setupGameQuestions = () => {
    // --- NEW LOGIC: Selects one random question from each published bank ---

    // 1. Filter for banks that are actually published.
    const publishedBanks = initialBanks.filter(bank => bank.status === 'Published');

    // 2. For each published bank, get its questions, pick one randomly, and collect them.
    const gameQuestions = publishedBanks.map(bank => {
        const questionsForBank = allQuestions.filter(q => q.bankId === bank.id);
        if (questionsForBank.length > 0) {
            const randomIndex = Math.floor(Math.random() * questionsForBank.length);
            return questionsForBank[randomIndex];
        }
        return null; // Return null if a bank has no questions
    }).filter((q): q is Question => q !== null); // Filter out any nulls

    setQuestions(gameQuestions);
    setIsLoading(false);
  };

  useEffect(() => {
    setupGameQuestions();
  }, []);

  const generatePollResults = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let remainingPercentage = 100;

    const correctAnswerPercentage = Math.floor(Math.random() * 31) + 40;
    remainingPercentage -= correctAnswerPercentage;

    const results = currentQuestion.options.map(option => {
      if (option === currentQuestion.answer) {
        return { option, percentage: correctAnswerPercentage };
      }
      return { option, percentage: 0 };
    });

    const incorrectOptions = results.filter(r => r.percentage === 0);
    incorrectOptions.forEach((result, index) => {
      if (index === incorrectOptions.length - 1) {
        result.percentage = remainingPercentage;
      } else {
        const randomPercentage = Math.floor(Math.random() * remainingPercentage);
        result.percentage = randomPercentage;
        remainingPercentage -= randomPercentage;
      }
    });
    setPollResults(results.sort(() => Math.random() - 0.5));
  };

  const generateExpertAdvice = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const { options, answer } = currentQuestion;
    const isCorrect = Math.random() < 0.8;
    const chosenOption = isCorrect ? answer : options.filter(o => o !== answer).sort(() => Math.random() - 0.5)[0];
    const confidence = isCorrect ? Math.floor(Math.random() * 21) + 75 : Math.floor(Math.random() * 31) + 40;
    const text = `I'm about ${confidence}% sure the answer is "${chosenOption}".`;
    setExpertAdvice({ text, confidence });
  };

  const handleUseLifeline = (lifeline: keyof Lifeline) => {
    if (usedLifelines[lifeline] || selectedOption || gameState === 'gameOver') return;
    setUsedLifelines(prev => ({ ...prev, [lifeline]: true }));

    if (lifeline === '50:50') {
      const currentQuestion = questions[currentQuestionIndex];
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
      const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
      setRemovedOptions(shuffled.slice(0, 2));
    } else if (lifeline === 'Audience Poll') {
      generatePollResults();
      setIsPollOpen(true);
    } else if (lifeline === 'Expert Advice') {
      generateExpertAdvice();
      setIsAdviceOpen(true);
    }
  };

  const endGame = (winnings: number, winner: boolean) => {
    if (gameState === 'gameOver') return;
    setFinalWinnings(winnings);
    setIsWinner(winner);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    // Re-run the same setup logic for a new game
    setupGameQuestions();
    
    // Reset all game state
    setCurrentQuestionIndex(0);
    setUsedLifelines({});
    setSelectedOption(null);
    setAnswerState('idle');
    setRemovedOptions([]);
    setFinalWinnings(0);
    setIsWinner(false);
    setGameState('playing');
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption || gameState === 'gameOver') return;
    setSelectedOption(option);
    setTimeout(() => {
      setAnswerState('revealed');
      setTimeout(() => {
        const currentQuestion = questions[currentQuestionIndex];
        const prizeLadder = initialBanks[0].prizeLadder;

        if (option === currentQuestion.answer) {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setAnswerState('idle');
            setRemovedOptions([]);
          } else {
            const finalPrize = prizeLadder[prizeLadder.length - 1]?.amount || 0;
            endGame(finalPrize, true);
          }
        } else {
          const bankDetails = initialBanks.find(b => b.id === currentQuestion.bankId);
          if (bankDetails?.onlySafePoints) {
            const currentPrize = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe)?.amount || prizeLadder[currentQuestionIndex-1]?.amount || 0;
            endGame(currentPrize, false);
          } else {
            const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
            endGame(lastSafeLevel ? lastSafeLevel.amount : 0, false);
          }
        }
      }, 2000);
    }, 1500);
  };

  const handleTimeUp = () => {
    if (gameState === 'gameOver' || selectedOption) return;
    const currentQuestion = questions[currentQuestionIndex];
    const prizeLadder = initialBanks[0].prizeLadder;
    const bankDetails = initialBanks.find(b => b.id === currentQuestion.bankId);

    if (bankDetails?.onlySafePoints) {
        const currentPrize = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe)?.amount || prizeLadder[currentQuestionIndex-1]?.amount || 0;
        endGame(currentPrize, false);
    } else {
        const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
        endGame(lastSafeLevel ? lastSafeLevel.amount : 0, false);
    }
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800">No Published Quizzes</h2>
        <p className="text-slate-600 mt-2">There are no published question banks available to play right now. Please check back later.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const sessionPrizeLadder = initialBanks.find(b => b.id === currentQuestion.bankId)?.prizeLadder || initialBanks[0].prizeLadder;
  const currentBank = initialBanks.find(bank => bank.id === currentQuestion.bankId);
  const bankTitle = currentBank ? currentBank.title : 'Quiz Game';

  return (
    <>
      <GameOverModal isOpen={gameState === 'gameOver'} onRestart={handleRestart} winnings={finalWinnings} isWinner={isWinner} />
      <AudiencePollModal isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} pollResults={pollResults} />
      {expertAdvice && <ExpertAdviceModal isOpen={isAdviceOpen} onClose={() => setIsAdviceOpen(false)} advice={expertAdvice} />}

      <motion.main
        className="grid grid-cols-1 lg:grid-cols-4 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 p-8 lg:p-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="lg:col-span-3 flex flex-col gap-4" variants={itemVariants}>
          <GameHUD
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            bankTitle={bankTitle}
          />
          <div className="relative flex-grow flex flex-col gap-6 bg-white border border-slate-200 rounded-lg p-6 shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <Timer
                  duration={currentBank?.defaultTimer || 60}
                  onTimeUp={handleTimeUp}
                  isPaused={selectedOption !== null}
                />
                <QuestionCard
                  questionText={currentQuestion.question}
                  mediaUrl={currentQuestion.media?.url}
                />
                <OptionsGrid
                  options={currentQuestion.options}
                  correctAnswer={currentQuestion.answer}
                  selectedOption={selectedOption}
                  answerState={answerState}
                  onOptionSelect={handleOptionSelect}
                  removedOptions={removedOptions}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-1 flex flex-col gap-6" variants={itemVariants}>
          <LifelineBar
            lifelines={currentQuestion.lifelines}
            usedLifelines={usedLifelines}
            onUseLifeline={handleUseLifeline}
          />
          <div className="flex-grow">
            <PrizeLadder
              prizeLadder={sessionPrizeLadder}
              currentLevel={currentQuestionIndex + 1}
            />
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}