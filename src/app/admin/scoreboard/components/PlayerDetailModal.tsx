'use client';

import { X, Clock, Zap, Target, HelpCircle, Award } from 'lucide-react';

// --- UPDATED TYPE DEFINITION ---
export interface QuestionDetail {
  text: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
}
export interface Score {
  id: string;
  playerName: string;
  questionBank: 'General Knowledge' | 'Modern History' | 'JavaScript Fundamentals';
  finalScore: number;
  date: string;
  totalTimeSeconds: number;
  lifelinesUsed: Array<'50-50' | 'Hint'>;
  questions: QuestionDetail[];
}

export const PlayerDetailModal = ({ score, onClose }: { score: Score; onClose: () => void; }) => {
  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all"
      >
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{score.playerName}'s Session</h3>
            <p className="text-sm text-slate-600">
              {score.questionBank} - {new Date(score.date).toLocaleString()} {/* --- FIX: Use 'questionBank' and 'date' --- */}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 bg-transparent rounded-lg hover:bg-slate-200 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* --- Summary --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <Award className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">
                 {score.finalScore} {/* --- FIX: Use 'finalScore' --- */}
              </p>
              <p className="text-xs text-slate-500">Final Score</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Clock className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{score.totalTimeSeconds}s</p> {/* --- FIX: Use 'totalTimeSeconds' --- */}
              <p className="text-xs text-slate-500">Total Time</p>
            </div>
             <div className="p-4 bg-slate-50 rounded-lg">
              <HelpCircle className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{score.questions.length}</p> {/* --- FIX: Use 'questions.length' --- */}
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Zap className="mx-auto h-6 w-6 text-indigo-600" />
              <p className="text-2xl font-bold text-slate-800 mt-2">{score.lifelinesUsed.length}</p>
              <p className="text-xs text-slate-500">Lifelines Used</p>
            </div>
          </div>

          {/* --- Question Timeline --- */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Question Timeline</h4>
            <div className="space-y-3">
              {score.questions.length > 0 ? score.questions.map((q, index) => ( // --- FIX: Use 'questions' ---
                <div key={index} className="flex items-center gap-4 p-3 bg-white border rounded-md">
                   <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${q.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {index + 1}
                   </div>
                   <div className="flex-grow">
                     <p className="font-medium text-slate-800">{q.text}</p> {/* --- FIX: Use 'text' --- */}
                     <p className="text-xs text-slate-500">Your answer: {q.selectedAnswer}</p>
                     <p className="text-xs text-slate-500">Correct answer: {q.correctAnswer}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-semibold text-sm text-slate-700">{q.timeTakenSeconds}s</p> {/* --- FIX: Use 'timeTakenSeconds' --- */}
                      <p className="text-xs text-slate-500">Time Taken</p>
                   </div>
                </div>
              )) : (
                <div className="text-center text-slate-500 py-6">
                    No detailed question data available for this session.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};