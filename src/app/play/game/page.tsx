'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Question, Lifeline } from '@/lib/types1';
import { PrizeLevel } from '@/lib/types1';
import { PrizeLadder } from '@/components/game/PrizeLadder';
import { LifelineBar } from '@/components/game/LifelineBar';
import { GameHUD } from '@/components/game/GameHUD';
import { QuestionCard } from '@/components/game/QuestionCard';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { Timer } from '@/components/game/Timer';
import { AudiencePollModal } from '@/components/game/AudiencePollModal';
import { ExpertAdviceModal } from '@/components/game/ExpertAdviceModal';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import axiosInstance from '@/utils/axiosInstance';

type AnswerState = 'idle' | 'revealed';

export default function GamePage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<any>(null);
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


  const setupGameQuestions = async (config: any) => {
    try {
      const questionsFromBackend = config?.questions || [];

      if (!questionsFromBackend.length) {
        console.error("No questions found in config:", config);
        setIsLoading(false);
        return;
      }

      const cleanedQuestions = questionsFromBackend.map((q: any) => ({
        id: q._id,
        bankId: q.bankId,
        question: q.text || q.question,
        options: q.options?.map((opt: any) => opt.text) || [],
        answer:
          q.answer ||
          (q.correctIndex != null && q.options?.[q.correctIndex]
            ? q.options[q.correctIndex].text
            : null),
        media: q.mediaRef
          ? {
            url: q.mediaRef.url,
            type: q.mediaRef.type,
          }
          : null,
      }));

      setAllQuestions(cleanedQuestions);
      console.log("Cleaned Questions: ", cleanedQuestions);
      setQuestions(cleanedQuestions);
      setAskedQuestionIds(new Set(cleanedQuestions.map((q: any) => q.id)));
      setIsLoading(false);
    } catch (err) {
      console.error("Error setting up game questions:", err);
      setIsLoading(false);
    }
  };


  const fetchActiveGameSession = async () => {
    try {
      const response = await api.get("/api/session", { withCredentials: true });
      // If session not found
      if (response.status === 404) return null;

      return response.data.session || null;
    } catch (err: any) {
      if (err.response?.status === 404) return null; // no active session
      console.error("Error fetching active session:", err);
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        let session = await fetchActiveGameSession();

        if (!session) {
          console.log("🎮 No session found — starting new game");
          const { data } = await api.get("/api/game/session", { withCredentials: true });
          const newSession = await startNewGameSession(data);

          if (!newSession) return; // user had completed game
          setActiveConfig(data);
          setUsedLifelines(data.lifelines); 
          setupGameQuestions(data);
        } else if (session.isCompleted) {
          console.log("✅ Session completed — redirecting");
          router.push("/play/game-over");
          return;
        } else {
          setActiveConfig(session);
          setupGameQuestions(session);
           setUsedLifelines(session.lifelines); 
          setCurrentQuestionIndex(session.currentQuestionIndex);
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const startNewGameSession = async (config: any) => {
    try {
      const payload = {
        gameConfigId: config?._id || config?.gameConfigId,
        questions: config?.questions || [],
        prizeLadder: config?.prizeLadder || [],
        lifelines: config?.lifelines || {
          "50:50": true,
          "Audience Poll": true,
          "Expert Advice": true,
          "Flip Question": true,
        },
      };

      const response = await api.post("/api/session/start", payload, { withCredentials: true });

      // handle status 206 from backend
      if (response.status === 206) {
        alert("🎉 You’ve already completed this session!");
        router.push("/play/game-over");
        return null;
      }

      return response.data.session;
    } catch (err: any) {
      console.error("Error starting/resuming session:", err);
      throw err;
    }
  };


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
    const chosenOption = isCorrect
      ? answer
      : options.filter(o => o !== answer).sort(() => Math.random() - 0.5)[0];
    const confidence = isCorrect
      ? Math.floor(Math.random() * 21) + 75
      : Math.floor(Math.random() * 31) + 40;
    const text = `I'm about ${confidence}% sure the answer is "${chosenOption}".`;
    setExpertAdvice({ text, confidence });
  };



  const fetchFlipQuestion = async () => {
    try {
      const currentQuestionBankId = questions[currentQuestionIndex].bankId;

      const { data } = await api.post(
        "/api/game/flip-question",
        {
          currentQuestionBankId,
          askedQuestionIds: Array.from(askedQuestionIds || []),
        },
        { withCredentials: true }
      );

      // The backend wraps actual question data inside "data.question"
      const q = data.question || data;

      const cleanedQuestion = {
        id: q._id,
        bankId: q.bankId,
        question: q.text || q.question,
        options: q.options?.map((opt: any) => opt.text) || [],
        status: q.status,
        categories: q.categories,
        answer:
          q.answer ||
          (q.correctIndex != null && q.options?.[q.correctIndex]
            ? q.options[q.correctIndex].text
            : null),
        media: q.mediaRef
          ? {
            url: q.mediaRef.url,
            type: q.mediaRef.type,
          }
          : null,
      };

      return cleanedQuestion;
    } catch (error) {
      console.error("Error fetching flip question:", error);
    }
  };

  const findAndFlipQuestion = async () => {
    try {
      const flippedQuestion = await fetchFlipQuestion();
      if (!flippedQuestion) return;

      // Replace the current question in the array
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentQuestionIndex] = flippedQuestion;
        return updatedQuestions;
      });

      // Add the flipped question ID to askedQuestionIds (so it won’t repeat later)
      setAskedQuestionIds((prev) => new Set([...prev, flippedQuestion.id]));

      // Optional: Reset any UI states
      setSelectedOption(null);
      setAnswerState('idle');
      setRemovedOptions([]);

      console.log("Flipped Question:", flippedQuestion);
    } catch (error) {
      console.error("Error flipping question:", error);
    }
  };

const handleUseLifeline = async (lifeline: keyof Lifeline) => {
  if (usedLifelines[lifeline] === false || selectedOption) return;

  // 🟢 Clone current lifelines & mark the used one as false (disabled)
  const updatedLifelines = { ...usedLifelines, [lifeline]: false };
  setUsedLifelines(updatedLifelines);
  console.log(lifeline)
  try {
    // Step 2: Update backend session using your existing endpoint
    await api.put("/api/session/update", {
      lifelines: updatedLifelines,
    });

    // Step 3: Continue with lifeline logic
    if (lifeline === "Flip Question") {
      findAndFlipQuestion();
    } else if (lifeline === "50:50") {
      const currentQuestion = questions[currentQuestionIndex];
      const { data } = await api.post("/api/game/lifeline/50-50", {
        question: {
          options: currentQuestion.options,
          answer: currentQuestion.answer,
        },
      });
      if (data.removedOptions) {
        setRemovedOptions(data.removedOptions);
      }
    } else if (lifeline === "Audience Poll") {
      generatePollResults();
      setIsPollOpen(true);
    } else if (lifeline === "Expert Advice") {
      generateExpertAdvice();
      setIsAdviceOpen(true);
    }
  } catch (error) {
    console.error("Error using lifeline:", error);
  }
};


  // --- Game Logic ---
  const endGame = (prizeValue: string | number, prizeType: 'money' | 'gift', isWinner: boolean, finalScore: number) => {
    router.push(`/play/game-over?prizeValue=${prizeValue}&prizeType=${prizeType}&winner=${isWinner}&score=${finalScore}`);
  };
  const handleOptionSelect = async (option: string) => {
    if (selectedOption || !activeConfig) return;
    setSelectedOption(option);

    setTimeout(() => {
      setAnswerState("revealed");

      setTimeout(async () => {
        const prizeLadder = activeConfig.prizeLadder;
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = currentQuestion?.answer;
        const isCorrect = option === correctAnswer;
        const nextIndex = currentQuestionIndex + 1;
        const isLast = nextIndex >= questions.length;

        try {
          // 🧠 1️⃣ Update backend session progress
          await axiosInstance.put("/api/session/update", {
            questionId: currentQuestion?._id,
            isCorrect,
            currentQuestionIndex: isCorrect ? nextIndex : currentQuestionIndex,
          });

          // 🏁 2️⃣ If last question and correct → mark as completed
          if (isCorrect && isLast) {
            await axiosInstance.put("/api/session/end");
          }
        } catch (error) {
          console.error("Error updating session:", error);
        }

        // 🧩 3️⃣ Frontend logic
        if (isCorrect) {
          const score = nextIndex;

          if (!isLast) {
            // Move to next question safely
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
            setAnswerState("idle");
            setRemovedOptions([]);
          } else {
            // 🚫 Stay on last question to avoid undefined access
            const finalPrizeLevel = prizeLadder[prizeLadder.length - 1];

            if (finalPrizeLevel?.type === "gift") {
              endGame(finalPrizeLevel.value, "gift", true, score);
            } else {
              const totalWinnings = prizeLadder
                .filter(
                  (level: PrizeLevel) =>
                    level.type === "money" && typeof level.value === "number"
                )
                .reduce(
                  (sum: number, level: PrizeLevel) =>
                    sum + (level.value as number),
                  0
                );
              endGame(totalWinnings, "money", true, score);
            }
          }
        } else {
          // ❌ Wrong answer logic
          const score = currentQuestionIndex;
          const lastSafeLevel = prizeLadder
            .slice(0, currentQuestionIndex)
            .reverse()
            .find((p: PrizeLevel) => p.isSafe);

          if (lastSafeLevel?.type === "gift") {
            endGame(lastSafeLevel.value, "gift", false, score);
          } else {
            let winnings = 0;
            if (lastSafeLevel) {
              const levelsToSum = prizeLadder.slice(0, lastSafeLevel.level);
              winnings = levelsToSum
                .filter(
                  (level: PrizeLevel) =>
                    level.type === "money" && typeof level.value === "number"
                )
                .reduce(
                  (sum: number, level: PrizeLevel) =>
                    sum + (level.value as number),
                  0
                );
            }
            endGame(winnings, "money", false, score);
          }
        }
      }, 2000);
    }, 1500);
  };


  const handleTimeUp = () => {
    if (selectedOption || !activeConfig) return;
    const score = currentQuestionIndex;
    const prizeLadder = activeConfig.prizeLadder;
    const lastSafeLevel = prizeLadder
      .slice(0, currentQuestionIndex)
      .reverse()
      .find((p: PrizeLevel) => p.isSafe);


    if (lastSafeLevel && lastSafeLevel.type === 'gift') {
      endGame(lastSafeLevel.value, 'gift', false, score);
    } else {
      let winnings = 0;
      if (lastSafeLevel) {
        const levelsToSum = prizeLadder.slice(0, lastSafeLevel.level);
        winnings = levelsToSum
          .filter((level: PrizeLevel) => level.type === 'money' && typeof level.value === 'number')
          .reduce((sum: number, level: PrizeLevel) => sum + (level.value as number), 0);
      }
      endGame(winnings, 'money', false, score);
    }
  };

  if (isLoading || !activeConfig || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800">No Quizzes Configured</h2>
        <p className="text-slate-600 mt-2">
          There are no published question banks selected in the current game configuration.
        </p>
      </div>
    );
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 text-center p-4">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">🎉 Game Completed!</h2>
        <p className="text-slate-600 mb-6">
          Please wait while we finalize your results...
        </p>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const sessionPrizeLadder = activeConfig.prizeLadder;
  const currentBank = activeConfig.selectedBanks?.find(
    (b: any) => b._id === currentQuestion.bankId
  );

  const bankTitle = currentBank?.name || 'Quiz Game';

  return (
    <>
      <AudiencePollModal isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} pollResults={pollResults} />
      {expertAdvice && (
        <ExpertAdviceModal isOpen={isAdviceOpen} onClose={() => setIsAdviceOpen(false)} advice={expertAdvice} />
      )}

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
                <Timer duration={45} onTimeUp={handleTimeUp} isPaused={selectedOption !== null} />
                <QuestionCard questionText={currentQuestion.question} mediaUrl={currentQuestion.media?.url} mediaType={currentQuestion.media?.type} />
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
            lifelines={activeConfig?.lifelines ?? {
              '50:50': true,
              'Audience Poll': true,
              'Expert Advice': true,
              'Flip Question': true,
            }}
            usedLifelines={usedLifelines}
            onUseLifeline={handleUseLifeline}
          />
          <div className="flex-grow">
            <PrizeLadder prizeLadder={sessionPrizeLadder} currentLevel={currentQuestionIndex + 1} />
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}