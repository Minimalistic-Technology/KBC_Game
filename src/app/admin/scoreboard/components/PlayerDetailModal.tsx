'use client';

import { Score, QuestionResult } from '@/types';
import { X, Clock, Zap, Target, HelpCircle, Award, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// This is the basic info passed from the list
interface ScoreSummary {
  sessionId: string;
  playerName: string;
  bankId: string;
  timestamp: string;
}

export const PlayerDetailModal = ({ scoreSummary, onClose }: { scoreSummary: ScoreSummary; onClose: () => void; }) => {
  const [detailedScore, setDetailedScore] = useState<Score | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!scoreSummary.sessionId) return;
      
      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/scores/${scoreSummary.sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch score details');
        }
        
        const data: Score = await response.json();
        setDetailedScore(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [scoreSummary.sessionId]);

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
            <h3 className="text-xl font-semibold text-slate-900">{scoreSummary.playerName}'s Session</h3>
            <p className="text-sm text-slate-600">
              {scoreSummary.bankId} - {new Date(scoreSummary.timestamp).toLocaleString()}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              <p className="ml-3 text-slate-600">Loading session details...</p>
            </div>
          ) : !detailedScore ? (
             <div className="text-center text-red-600 py-10">
                Failed to load session details.
             </div>
          ) : (
            <>
              {/* --- Summary --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <Award className="mx-auto h-6 w-6 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-800 mt-2">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(detailedScore.prizeWon)}
                  </p>
                  <p className="text-xs text-slate-500">Prize Won</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <Clock className="mx-auto h-6 w-6 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-800 mt-2">{detailedScore.totalTime}s</p>
                  <p className="text-xs text-slate-500">Total Time</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <HelpCircle className="mx-auto h-6 w-6 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-800 mt-2">{detailedScore.totalQuestions}</p>
                  <p className="text-xs text-slate-500">Questions</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <Zap className="mx-auto h-6 w-6 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-800 mt-2">{detailedScore.lifelinesUsed.length}</p>
                  <p className="text-xs text-slate-500">Lifelines Used</p>
                </div>
              </div>

              {/* --- Question Timeline --- */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Question Timeline</h4>
                <div className="space-y-3">
                  {detailedScore.questionResults.length > 0 ? detailedScore.questionResults.map((q, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white border rounded-md">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${q.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-slate-800">{q.question}</p>
                        <p className="text-xs text-slate-500">Your answer: {q.selectedAnswer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-slate-700">{q.timeTaken}s</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};