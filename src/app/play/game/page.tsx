'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Lifeline } from '@/lib/types1';
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
type LangKey = 'en' | 'hi' | 'gu';

type LangPack = {
  text: string;
  options: { text: string }[];
  categories?: string[];
};

type RawQuestion = {
  id: string;
  bankId: string;
  lang: Partial<Record<LangKey | string, LangPack>>;
  correctIndex: number;
  status?: string;
  categories?: string[];
  media?: { url: string; type: string } | null;
};

export default function GamePage() {
  const router = useRouter();

  // ---------- Language ----------
  const [lang, setLang] = useState<LangKey>('en');

  // ---------- Session / questions ----------
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<RawQuestion[]>([]);
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ---------- Lifelines & state ----------
  const [usedLifelines, setUsedLifelines] = useState<{ [key in keyof Lifeline]?: boolean }>({});
  const [usedLifelinesArr, setUsedLifelinesArr] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);

  // ---------- Modals ----------
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [pollResults, setPollResults] = useState<{ option: string; percentage: number }[]>([]);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [expertAdvice, setExpertAdvice] = useState<{ text: string; confidence: number } | null>(null);

  // ---------- Time tracking ----------
  const totalTimeRef = useRef(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const perQRef = useRef<Record<string, number>>({});

  // ---------- Helpers ----------
  const getDisplayFromRaw = (q: RawQuestion, currentLang: LangKey) => {
    const pack: LangPack | undefined =
      (q.lang && (q.lang[currentLang] as LangPack)) ||
      (q.lang && (q.lang.en as LangPack)) ||
      (q.lang && (Object.values(q.lang).find(Boolean) as LangPack | undefined));

    const options = (pack?.options ?? []).map(o => o.text);
    const questionText = pack?.text ?? '';
    const answer = options[q.correctIndex] ?? '';

    return { questionText, options, answer };
  };

  const setupGameQuestions = async (config: any) => {
    try {
      const questionsFromBackend = config?.questions || [];
      if (!questionsFromBackend.length) {
        console.error('No questions found in config:', config);
        return null;
      }

      const cleanedQuestions: RawQuestion[] = questionsFromBackend.map((q: any) => ({
        id: q._id,
        bankId: q.bankId,
        lang: q.lang || {},
        correctIndex: q.correctIndex ?? 0,
        status: q.status,
        categories: q.lang?.en?.categories ?? [],
        media: q.mediaRef ? { url: q.mediaRef.url, type: q.mediaRef.type } : null,
      }));

      const askedIds = new Set(cleanedQuestions.map((q: any) => q.id));
      return { cleanedQuestions, askedIds };
    } catch (err) {
      console.error('Error setting up game questions:', err);
      return null;
    }
  };

  const fetchActiveGameSession = async () => {
    try {
      const response = await api.get('/api/session', { withCredentials: true });
      if (response.status === 404) return null;
      return response.data.session || null;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      console.error('Error fetching active session:', err);
      throw err;
    }
  };

  const autoFlipQuestionOnResume = async (originalQuestions: RawQuestion[], questionIndex: number) => {
    try {
      const currentQuestionBankId = originalQuestions[questionIndex].bankId;
      const { data } = await api.post(
        '/api/game/flip-question',
        { currentQuestionBankId },
        { withCredentials: true }
      );

      const q = data.question || data;
      if (!q || !q._id) {
        console.error('[autoFlip] No valid question data received. Aborting auto-flip.');
        return { questions: originalQuestions };
      }

      const flippedQuestion: RawQuestion = {
        id: q._id,
        bankId: q.bankId,
        lang: q.lang || {},
        correctIndex: q.correctIndex ?? 0,
        status: q.status,
        categories: q.lang?.en?.categories ?? [],
        media: q.mediaRef ? { url: q.mediaRef.url, type: q.mediaRef.type } : null,
      };

      const updatedQuestions = [...originalQuestions];
      updatedQuestions[questionIndex] = flippedQuestion;

      await api.put('/api/session/update', {
        questions: updatedQuestions,
        currentQuestionIndex: questionIndex,
      });

      return { questions: updatedQuestions };
    } catch (error) {
      console.error('[autoFlip] Error auto-flipping question:', error);
      return { questions: originalQuestions };
    }
  };

  const startNewGameSession = async (config: any) => {
    try {
      const payload = {
        gameConfigId: config?._id || config?.gameConfigId,
        questions: config?.questions || [],
        prizeLadder: config?.prizeLadder || [],
        lifelines:
          config?.lifelines || {
            '50:50': true,
            'Audience Poll': true,
            'Expert Advice': true,
            'Flip Question': true,
          },
        lang: 'en' as LangKey,
      };

      const response = await api.post('/api/session/start', payload, { withCredentials: true });

      if (response.status === 206) {
        alert('🎉 You’ve already completed this session!');
        router.push('/play/game-over');
        return null;
      }

      return response.data.session;
    } catch (err: any) {
      console.error('Error starting/resuming session:', err);
      throw err;
    }
  };

  const fetchFlipQuestion = async (): Promise<RawQuestion | undefined> => {
    try {
      const currentQuestionBankId = questions[currentQuestionIndex].bankId;
      const { data } = await api.post(
        '/api/game/flip-question',
        { currentQuestionBankId },
        { withCredentials: true }
      );
      const q = data.question || data;

      const cleanedQuestion: RawQuestion = {
        id: q._id,
        bankId: q.bankId,
        lang: q.lang || {},
        correctIndex: q.correctIndex ?? 0,
        status: q.status,
        categories: q.lang?.en?.categories ?? [],
        media: q.mediaRef ? { url: q.mediaRef.url, type: q.mediaRef.type } : null,
      };

      return cleanedQuestion;
    } catch (error) {
      console.error('Error fetching flip question:', error);
    }
  };

  const findAndFlipQuestion = async () => {
    try {
      const flippedQuestion = await fetchFlipQuestion();
      if (!flippedQuestion) return;

      setQuestions(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = flippedQuestion;
        return updated;
      });

      setSelectedOption(null);
      setAnswerState('idle');
      setRemovedOptions([]);

      // Optional: persist latest question swap
      try {
        await api.put('/api/session/update', {
          questions: (prev => {
            const updated = [...prev];
            updated[currentQuestionIndex] = flippedQuestion;
            return updated;
          })(questions),
          currentQuestionIndex,
        });
      } catch {}
    } catch (error) {
      console.error('Error flipping question:', error);
    }
  };

  // ---------- Bootstrap session ----------
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let session = await fetchActiveGameSession();

        if (!session) {
          // Start a new session using server config
          const { data } = await api.get('/api/game/session', { withCredentials: true });
          const newSession = await startNewGameSession(data);
          if (!newSession) return;

          setActiveConfig(data);
          setUsedLifelines(data.lifelines);
          setLang((data.lang as LangKey) || 'en');

          const gameData = await setupGameQuestions(data);
          if (gameData) {
            setQuestions(gameData.cleanedQuestions);
          }
        } else if (session.isCompleted) {
          router.push('/play/game-over');
          return;
        } else {
          // Resume
          setActiveConfig(session);
          setUsedLifelines(session.lifelines);
          setLang((session.lang as LangKey) || 'en');

          const questionIndex = session.currentQuestionIndex ?? 0;
          const gameData = await setupGameQuestions(session);
          if (!gameData) {
            console.error('Failed to setup questions on resume.');
            setIsLoading(false);
            return;
          }

          const { questions: flippedQuestions } =
            await autoFlipQuestionOnResume(gameData.cleanedQuestions, questionIndex);

          setQuestions(flippedQuestions);
          setCurrentQuestionIndex(questionIndex);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Language/Question change: reset UI selection ----------
  useEffect(() => {
    setSelectedOption(null);
    setAnswerState('idle');
    setRemovedOptions([]);
  }, [lang, currentQuestionIndex]);

  // ---------- Lifelines ----------
  const handleUseLifeline = async (lifeline: keyof Lifeline) => {
    if (usedLifelines[lifeline] === false || selectedOption) return;

    const updatedLifelines = { ...usedLifelines, [lifeline]: false };
    setUsedLifelines(updatedLifelines);

    try {
      await api.put('/api/session/update', {
        lifelines: updatedLifelines,
      });

      const currentQuestionRaw = questions[currentQuestionIndex];
      const { options: displayOptions, answer: displayAnswer } = getDisplayFromRaw(currentQuestionRaw, lang);

      if (lifeline === 'Flip Question') {
        findAndFlipQuestion();
        setUsedLifelinesArr(prev => [...prev, 'Flip Question']);
      } else if (lifeline === '50:50') {
        const { data } = await api.post('/api/game/lifeline/50-50', {
          question: {
            options: displayOptions,
            answer: displayAnswer,
          },
        });
        if (data.removedOptions) {
          setRemovedOptions(data.removedOptions);
          setUsedLifelinesArr(prev => [...prev, '50:50']);
        }
      } else if (lifeline === 'Audience Poll') {
        generatePollResults();
        setIsPollOpen(true);
        setUsedLifelinesArr(prev => [...prev, 'Audience Poll']);
      } else if (lifeline === 'Expert Advice') {
        generateExpertAdvice();
        setIsAdviceOpen(true);
        setUsedLifelinesArr(prev => [...prev, 'Expert Advice']);
      }
    } catch (error) {
      console.error('Error using lifeline:', error);
    }
  };

  const generatePollResults = () => {
    const currentQuestionRaw = questions[currentQuestionIndex];
    const { options: displayOptions, answer: displayAnswer } = getDisplayFromRaw(currentQuestionRaw, lang);

    let remaining = 100;
    const correctPct = Math.floor(Math.random() * 31) + 40; // 40..70
    remaining -= correctPct;

    const results = displayOptions.map(opt => ({
      option: opt,
      percentage: opt === displayAnswer ? correctPct : 0,
    }));

    const incorrect = results.filter(r => r.percentage === 0);
    incorrect.forEach((r, idx) => {
      if (idx === incorrect.length - 1) {
        r.percentage = remaining;
      } else {
        const p = Math.floor(Math.random() * remaining);
        r.percentage = p;
        remaining -= p;
      }
    });

    setPollResults(results.sort(() => Math.random() - 0.5));
  };

  const generateExpertAdvice = () => {
    const currentQuestionRaw = questions[currentQuestionIndex];
    const { options: displayOptions, answer: displayAnswer } = getDisplayFromRaw(currentQuestionRaw, lang);

    const isCorrect = Math.random() < 0.8;
    const wrongOptions = displayOptions.filter(o => o !== displayAnswer);
    const chosenOption = isCorrect
      ? displayAnswer
      : wrongOptions.sort(() => Math.random() - 0.5)[0];
    const confidence = isCorrect ? Math.floor(Math.random() * 21) + 75 : Math.floor(Math.random() * 31) + 40;
    const text = `I'm about ${confidence}% sure the answer is "${chosenOption}".`;
    setExpertAdvice({ text, confidence });
  };

  // ---------- Ending / scoring ----------
  const endGame = async (
    prizeValue: string | number,
    prizeType: 'money' | 'gift',
    isWinner: boolean,
    finalScore: number
  ) => {
    try {
      const total = totalTimeRef.current;
      setTotalTimeSeconds(total);

      const payload = {
        gameConfigId: activeConfig?.gameConfigId,
        questions, // raw multilingual
        langUsed: lang,
        correctAnswered: isWinner ? currentQuestionIndex + 1 : currentQuestionIndex,
        isWinner,
        totalTimeSeconds: total,
        usedLifelinesArr,
        prizeLadder: activeConfig?.prizeLadder || [],
      };

      const response = await api.post('/api/score/create', payload, { withCredentials: true });
      if (response.status !== 201) {
        console.warn('⚠️ Unexpected response while saving result:', response);
      }

      router.push(
        `/play/game-over?prizeValue=${prizeValue}&prizeType=${prizeType}&winner=${isWinner}&score=${finalScore}`
      );
    } catch (error: any) {
      console.error('❌ Error saving game result:', error);
      router.push(
        `/play/game-over?prizeValue=${prizeValue}&prizeType=${prizeType}&winner=${isWinner}&score=${finalScore}`
      );
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (selectedOption || !activeConfig) return;
    setSelectedOption(option);

    setTimeout(() => {
      setAnswerState('revealed');

      setTimeout(async () => {
        const prizeLadder: PrizeLevel[] = activeConfig.prizeLadder;
        const currentQuestionRaw = questions[currentQuestionIndex];
        const { answer: displayAnswer } = getDisplayFromRaw(currentQuestionRaw, lang);

        const isCorrect = option === displayAnswer;
        const nextIndex = currentQuestionIndex + 1;
        const isLast = nextIndex >= questions.length;

        try {
          await axiosInstance.put('/api/session/update', {
            questionId: currentQuestionRaw.id,
            isCorrect,
            currentQuestionIndex: isCorrect ? nextIndex : currentQuestionIndex,
          });

          if (isCorrect && isLast) {
            await axiosInstance.put('/api/session/end');
          }
        } catch (error) {
          console.error('Error updating session:', error);
        }

        if (isCorrect) {
          const score = nextIndex;

          if (!isLast) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
            setAnswerState('idle');
            setRemovedOptions([]);
          } else {
            const finalPrizeLevel = prizeLadder[prizeLadder.length - 1];

            if (finalPrizeLevel?.type === 'gift') {
              endGame(finalPrizeLevel.value, 'gift', true, score);
            } else {
              const totalWinnings = prizeLadder
                .filter(l => l.type === 'money' && typeof l.value === 'number')
                .reduce((sum, l) => sum + (l.value as number), 0);
              endGame(totalWinnings, 'money', true, score);
            }
          }
        } else {
          const score = currentQuestionIndex;
          const lastSafeLevel = prizeLadder
            .slice(0, currentQuestionIndex)
            .reverse()
            .find((p: PrizeLevel) => p.isSafe);

          if (lastSafeLevel?.type === 'gift') {
            endGame(lastSafeLevel.value, 'gift', false, score);
          } else {
            let winnings = 0;
            if (lastSafeLevel) {
              const levelsToSum = prizeLadder.slice(0, lastSafeLevel.level);
              winnings = levelsToSum
                .filter(l => l.type === 'money' && typeof l.value === 'number')
                .reduce((sum, l) => sum + (l.value as number), 0);
            }
            endGame(winnings, 'money', false, score);
          }
        }
      }, 2000);
    }, 1500);
  };

  const handleTimeUp = () => {
    if (selectedOption || !activeConfig) return;

    setSelectedOption('__TIME_UP__');

    const DURATION = 45;
    const score = currentQuestionIndex;
    const prizeLadder: PrizeLevel[] = activeConfig.prizeLadder;

    const qid = String(questions[currentQuestionIndex].id);
    perQRef.current[qid] = DURATION;
    totalTimeRef.current += DURATION;
    setTotalTimeSeconds(totalTimeRef.current);

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
          .filter(l => l.type === 'money' && typeof l.value === 'number')
          .reduce((sum, l) => sum + (l.value as number), 0);
      }
      endGame(winnings, 'money', false, score);
    }
  };

  const handleTimeTaken = (seconds: number) => {
    const currentQuestionRaw = questions[currentQuestionIndex];
    const qid = String(currentQuestionRaw.id);
    perQRef.current[qid] = seconds;
    totalTimeRef.current += seconds;
    setTotalTimeSeconds(totalTimeRef.current);
  };

  // ---------- Derived UI values ----------
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const currentQuestionRaw = questions[currentQuestionIndex];
  if (!currentQuestionRaw) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 text-center p-4">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">🎉 Game Completed!</h2>
        <p className="text-slate-600 mb-6">Please wait while we finalize your results...</p>
      </div>
    );
  }

  const { questionText, options: displayOptions, answer: displayAnswer } = getDisplayFromRaw(
    currentQuestionRaw,
    lang
  );

  const totalQuestions = questions.length;
  const sessionPrizeLadder: PrizeLevel[] = activeConfig.prizeLadder;
  const currentBank = activeConfig.selectedBanks?.find((b: any) => b._id === currentQuestionRaw.bankId);
  const bankTitle = currentBank?.name || 'Quiz Game';

  return (
    <>
      <AudiencePollModal
        isOpen={isPollOpen}
        onClose={() => setIsPollOpen(false)}
        pollResults={pollResults}
      />
      {expertAdvice && (
        <ExpertAdviceModal
          isOpen={isAdviceOpen}
          onClose={() => setIsAdviceOpen(false)}
          advice={expertAdvice}
        />
      )}

      <motion.main
        className="grid grid-cols-1 lg:grid-cols-4 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 p-8 lg:p-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="lg:col-span-3 flex flex-col gap-4" variants={itemVariants}>
          {/* Language Switcher + HUD */}
          <div className="flex items-center justify-between">
            <GameHUD
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              bankTitle={bankTitle}
            />
            <div className="flex items-center gap-2">
              {(['en', 'hi', 'gu'] as LangKey[]).map(l => (
                <button
                  key={l}
                  onClick={async () => {
                    setLang(l);
                    try {
                      await api.put('/api/session/update', { lang: l });
                    } catch {}
                  }}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    lang === l
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                  aria-pressed={lang === l}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-grow flex flex-col gap-6 bg-white border border-slate-200 rounded-lg p-6 shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentQuestionRaw.id}-${lang}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <Timer
                  duration={45}
                  questionKey={`${currentQuestionRaw.id}-${lang}`} // re-initialize if language changes
                  isPaused={selectedOption !== null}
                  onTimeUp={handleTimeUp}
                  onTimeTaken={handleTimeTaken}
                />

                <QuestionCard
                  questionText={questionText}
                  mediaUrl={currentQuestionRaw.media?.url}
                  mediaType={currentQuestionRaw.media?.type}
                />

                <OptionsGrid
                  options={displayOptions}
                  correctAnswer={displayAnswer}
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
            lifelines={
              activeConfig?.lifelines ?? {
                '50:50': true,
                'Audience Poll': true,
                'Expert Advice': true,
                'Flip Question': true,
              }
            }
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
