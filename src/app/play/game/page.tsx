'use client';

import React, { useState, useEffect } from 'react';
import type { Question, Lifeline } from '@/lib/types';
import { allQuestions, initialBanks, shuffleArray } from '@/lib/data';

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
  
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<number>>(new Set());
  const [fallbackNotice, setFallbackNotice] = useState<string>('');

  useEffect(() => {
    const gameQuestions = initialBanks.flatMap(bank => shuffleArray(allQuestions.filter(q => q.bankId === bank.id)));
    setQuestions(gameQuestions);
    if (gameQuestions.length > 0) {
      setAskedQuestionIds(new Set([gameQuestions[0].id]));
    }
    setIsLoading(false);
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
    setPollResults(shuffleArray(results));
  };

  const generateExpertAdvice = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const { options, answer } = currentQuestion;
    const isCorrect = Math.random() < 0.8;
    const chosenOption = isCorrect ? answer : shuffleArray(options.filter(o => o !== answer))[0];
    const confidence = isCorrect ? Math.floor(Math.random() * 21) + 75 : Math.floor(Math.random() * 31) + 40;
    const text = `I'm about ${confidence}% sure the answer is "${chosenOption}".`;
    setExpertAdvice({ text, confidence });
  };
  
  const findAndFlipQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    let replacement = allQuestions.find(
      q => q.bankId === currentQuestion.bankId &&
           q.level === currentQuestion.level &&
           !askedQuestionIds.has(q.id)
    );
    
    if (!replacement) {
      replacement = allQuestions.find(
        q => q.level === currentQuestion.level &&
             !askedQuestionIds.has(q.id)
      );
      if (replacement) {
        setFallbackNotice('Selected from alternate bank');
        setTimeout(() => setFallbackNotice(''), 2500);
      }
    }
    
    if (replacement) {
      const finalReplacement = replacement;
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[currentQuestionIndex] = finalReplacement;
        return newQuestions;
      });
      setAskedQuestionIds(prev => new Set(prev).add(finalReplacement.id));
    } else {
      alert('Could not find a replacement question.');
      setUsedLifelines(prev => ({ ...prev, 'Flip Question': false }));
    }
  };
  
  const handleUseLifeline = (lifeline: keyof Lifeline) => {
    if (usedLifelines[lifeline] || selectedOption || gameState === 'gameOver') return;
    setUsedLifelines(prev => ({ ...prev, [lifeline]: true }));

    if (lifeline === 'Flip Question') {
      findAndFlipQuestion();
    } else if (lifeline === '50:50') {
      const currentQuestion = questions[currentQuestionIndex];
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
      setRemovedOptions(shuffleArray(incorrectOptions).slice(0, 2));
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
    console.log(`Game Over! Winnings: $${winnings}, Winner: ${winner}`);
    setFinalWinnings(winnings);
    setIsWinner(winner);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setQuestions(shuffleArray(questions));
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
            const nextQuestionIndex = currentQuestionIndex + 1;
            setAskedQuestionIds(prev => new Set(prev).add(questions[nextQuestionIndex].id));
            
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedOption(null);
            setAnswerState('idle');
            setRemovedOptions([]);
          } else {
            const finalPrize = prizeLadder[prizeLadder.length - 1].amount;
            endGame(finalPrize, true);
          }
        } else {
          const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
          endGame(lastSafeLevel ? lastSafeLevel.amount : 0, false);
        }
      }, 2000);
    }, 1500);
  };
  
  const handleTimeUp = () => {
    if (gameState === 'gameOver' || selectedOption) return;
    const prizeLadder = initialBanks[0].prizeLadder;
    const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
    endGame(lastSafeLevel ? lastSafeLevel.amount : 0, false);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <p className="text-xl">Loading your game...</p>
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
  const sessionPrizeLadder = initialBanks[0].prizeLadder;
  const currentBank = initialBanks.find(bank => bank.id === currentQuestion.bankId);
  const bankTitle = currentBank ? currentBank.title : 'Alternate Bank';

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
            
            <AnimatePresence>
              {fallbackNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full z-20"
                >
                  {fallbackNotice}
                </motion.div>
              )}
            </AnimatePresence>

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
                  duration={60}
                  onTimeUp={handleTimeUp}
                  isPaused={selectedOption !== null}
                />
                <QuestionCard 
                  questionText={currentQuestion.question}
                  mediaUrl={currentQuestion.mediaUrl}
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