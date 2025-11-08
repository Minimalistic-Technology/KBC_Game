'use client';

import { X, Clock, Zap, Award, CheckCircle2 } from 'lucide-react';

type QuestionLite = {
  id: string;
  question: string;
  options: string[];
  answer: string | null;
  media?: { url: string; type: string } | null;
  categories?: string[];
};

type ApiScore = {
  _id: string;
  userId: string;
  finalScore: number;
  isWinner: boolean;
  totalTimeSeconds?: number;
  createdAt: string;
  lifelinesUsed?: string[];
  questions?: unknown[]; // or your concrete question type
};

export const PlayerDetailModal = ({
  score,
  onClose,
}: {
  score: ApiScore  ;
  onClose: () => void;
}) => {
  const displayName = score.userId
    ? (score.userId.length > 12
        ? `${score.userId.slice(0, 6)}…${score.userId.slice(-4)}`
        : score.userId)
    : 'Player';

  const dateStr = (() => {
    try { return new Date(score.createdAt).toLocaleString(); } catch { return score.createdAt; }
  })();

  const durationStr = (() => {
    const sec = typeof score.totalTimeSeconds === 'number' ? score.totalTimeSeconds : undefined;
    if (sec === undefined) return '-';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  })();

  const lifelineCount = Array.isArray(score.lifelinesUsed) ? score.lifelinesUsed.length : 0;
  const questions: QuestionLite[] = Array.isArray(score.questions) ? score.questions as QuestionLite[] : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all"
      >
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{displayName}&apos;s Session</h3>
            <p className="text-sm text-slate-600">Played on {dateStr}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 bg-transparent rounded-lg hover:bg-slate-200 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <Award className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{score.finalScore}%</p>
              <p className="text-xs text-slate-500">Final Score</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Clock className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{durationStr}</p>
              <p className="text-xs text-slate-500">Total Time</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <CheckCircle2 className={`mx-auto h-6 w-6 ${score.isWinner ? 'text-green-600' : 'text-slate-500'}`} />
              <p className="text-2xl font-bold text-slate-800 mt-2">{score.isWinner ? 'Winner' : 'Played'}</p>
              <p className="text-xs text-slate-500">Result</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Zap className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{lifelineCount}</p>
              <p className="text-xs text-slate-500">Lifelines Used</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">
              Questions ({questions.length})
            </h4>

            {questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id ?? idx} className="flex items-start gap-4 p-3 bg-white border rounded-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-indigo-500">
                      {idx + 1}
                    </div>

                    <div className="flex-grow">
                      <p className="font-medium text-slate-800">{q.question}</p>

                      {/* Options */}
                      {Array.isArray(q.options) && q.options.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {q.options.map((opt, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                                q.answer === opt
                                  ? 'border-green-500 text-green-700'
                                  : 'border-slate-200 text-slate-600'
                              }`}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Correct answer */}
                      <p className="text-xs text-slate-500 mt-1">
                        Correct answer: <span className="font-medium text-slate-700">{q.answer ?? '-'}</span>
                      </p>

                      {/* Media (optional) */}
                      {q.media?.url && (
                        <a
                          href={q.media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs text-indigo-600 underline"
                        >
                          View media ({q.media.type || 'asset'})
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-6">
                No detailed question data available for this session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
