'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Question, Lifeline } from '@/lib/types1';
import { allQuestions, initialBanks } from '@/lib/data';
import { activeGameConfig } from '@/lib/gameConfig';

import { PrizeLadder } from '@/components/game/PrizeLadder';
import { LifelineBar } from '@/components/game/LifelineBar';
import { GameHUD } from '@/components/game/GameHUD';
import { QuestionCard } from '@/components/game/QuestionCard';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { Timer } from '@/components/game/Timer';
import { AudiencePollModal } from '@/components/game/AudiencePollModal';
import { ExpertAdviceModal } from '@/components/game/ExpertAdviceModal';
import { motion, AnimatePresence } from 'framer-motion';

type AnswerState = 'idle' | 'revealed';

export default function GamePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [usedLifelines, setUsedLifelines] = useState<{ [key in keyof Lifeline]?: boolean }>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [pollResults, setPollResults] = useState<{ option: string; percentage: number }[]>([]);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [expertAdvice, setExpertAdvice] = useState<{ text: string; confidence: number } | null>(null);
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<number>>(new Set());

  const setupGameQuestions = () => {
    const { selectedBankIds } = activeGameConfig;

    const gameQuestions = selectedBankIds.map(bankId => {
        const questionsForBank = allQuestions.filter(q => q.bankId === bankId);
        if (questionsForBank.length > 0) {
            const randomIndex = Math.floor(Math.random() * questionsForBank.length);
            return questionsForBank[randomIndex];
        }
        return null;
    }).filter((q): q is Question => q !== null);

    setQuestions(gameQuestions);
    setAskedQuestionIds(new Set(gameQuestions.map(q => q.id)));
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
    const results = currentQuestion.options.map(option => ({
      option,
      percentage: option === currentQuestion.answer ? correctAnswerPercentage : 0,
    }));
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

  const findAndFlipQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const replacementPool = allQuestions.filter(q => q.bankId === currentQuestion.bankId && !askedQuestionIds.has(q.id));
    if (replacementPool.length > 0) {
      const newQuestion = replacementPool[Math.floor(Math.random() * replacementPool.length)];
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[currentQuestionIndex] = newQuestion;
        return newQuestions;
      });
      setAskedQuestionIds(prev => new Set(prev).add(newQuestion.id));
    } else {
      alert('No other questions available in this bank to flip to. The lifeline is consumed.');
    }
  };

  const handleUseLifeline = (lifeline: keyof Lifeline) => {
    if (usedLifelines[lifeline] || selectedOption) return;
    setUsedLifelines(prev => ({ ...prev, [lifeline]: true }));
    if (lifeline === 'Flip Question') findAndFlipQuestion();
    else if (lifeline === '50:50') {
      const currentQuestion = questions[currentQuestionIndex];
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
      setRemovedOptions(incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2));
    } else if (lifeline === 'Audience Poll') {
      generatePollResults();
      setIsPollOpen(true);
    } else if (lifeline === 'Expert Advice') {
      generateExpertAdvice();
      setIsAdviceOpen(true);
    }
  };

  const endGame = (prizeValue: string | number, prizeType: 'money' | 'gift', isWinner: boolean, finalScore: number) => {
    router.push(`/play/game-over?prizeValue=${prizeValue}&prizeType=${prizeType}&winner=${isWinner}&score=${finalScore}`);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setTimeout(() => {
      setAnswerState('revealed');
      setTimeout(() => {
        const prizeLadder = activeGameConfig.prizeLadder;

        if (option === questions[currentQuestionIndex].answer) {
          const score = currentQuestionIndex + 1;
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setAnswerState('idle');
            setRemovedOptions([]);
          } else {
            const finalPrizeLevel = prizeLadder[prizeLadder.length - 1];
            if (finalPrizeLevel && finalPrizeLevel.type === 'gift') {
                endGame(finalPrizeLevel.value, 'gift', true, score);
            } else {
                const totalWinnings = prizeLadder
                  .filter(level => level.type === 'money' && typeof level.value === 'number')
                  .reduce((sum, level) => sum + (level.value as number), 0);
                endGame(totalWinnings, 'money', true, score);
            }
          }
        } else {
          const score = currentQuestionIndex;
          const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
          
          if (lastSafeLevel && lastSafeLevel.type === 'gift') {
            endGame(lastSafeLevel.value, 'gift', false, score);
          } else {
            let winnings = 0;
            if (lastSafeLevel) {
                const levelsToSum = prizeLadder.slice(0, lastSafeLevel.level);
                winnings = levelsToSum
                    .filter(level => level.type === 'money' && typeof level.value === 'number')
                    .reduce((sum, level) => sum + (level.value as number), 0);
            }
            endGame(winnings, 'money', false, score);
          }
        }
      }, 2000);
    }, 1500);
  };

  const handleTimeUp = () => {
    if (selectedOption) return;
    const score = currentQuestionIndex;
    const prizeLadder = activeGameConfig.prizeLadder;
    
    const lastSafeLevel = prizeLadder.slice(0, currentQuestionIndex).reverse().find(p => p.isSafe);
    
    if (lastSafeLevel && lastSafeLevel.type === 'gift') {
        endGame(lastSafeLevel.value, 'gift', false, score);
    } else {
        let winnings = 0;
        if (lastSafeLevel) {
            const levelsToSum = prizeLadder.slice(0, lastSafeLevel.level);
            winnings = levelsToSum
                .filter(level => level.type === 'money' && typeof level.value === 'number')
                .reduce((sum, level) => sum + (level.value as number), 0);
        }
        endGame(winnings, 'money', false, score);
    }
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800">No Quizzes Configured</h2>
        <p className="text-slate-600 mt-2">There are no published question banks selected in the current game configuration.</p>
      </div>
    );
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const sessionPrizeLadder = activeGameConfig.prizeLadder;
  const currentBank = initialBanks.find(bank => bank.id === currentQuestion.bankId);
  const bankTitle = currentBank ? currentBank.title : 'Quiz Game';

  return (
    <>
      <AudiencePollModal isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} pollResults={pollResults} />
      {expertAdvice && <ExpertAdviceModal isOpen={isAdviceOpen} onClose={() => setIsAdviceOpen(false)} advice={expertAdvice} />}

      <motion.main
        className="grid grid-cols-1 lg:grid-cols-4 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 p-8 lg:p-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="lg:col-span-3 flex flex-col gap-4" variants={itemVariants}>
          <GameHUD currentQuestionIndex={currentQuestionIndex} totalQuestions={totalQuestions} bankTitle={bankTitle} />
          <div className="relative flex-grow flex flex-col gap-6 bg-white border border-slate-200 rounded-lg p-6 shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* --- UPDATED: Timer duration is now hardcoded to 45 seconds --- */}
                <Timer
                  duration={45}
                  onTimeUp={handleTimeUp}
                  isPaused={selectedOption !== null}
                />
                <QuestionCard questionText={currentQuestion.question} mediaUrl={currentQuestion.media?.url} />
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
          <LifelineBar lifelines={activeGameConfig.lifelines} usedLifelines={usedLifelines} onUseLifeline={handleUseLifeline} />
          <div className="flex-grow">
            <PrizeLadder prizeLadder={sessionPrizeLadder} currentLevel={currentQuestionIndex + 1} />
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}