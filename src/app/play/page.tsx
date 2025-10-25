import Link from 'next/link';
import { PackageCheck, ArrowRight, ListOrdered, Zap, Users, Lightbulb, RefreshCw } from 'lucide-react';
import { activeGameConfig } from '@/lib/gameConfig';

export default function LobbyPage() {
  // --- UPDATED LOGIC ---

  // The total number of questions is now simply the number of selected banks,
  // since one question is chosen from each.
  const totalQuestions = activeGameConfig.selectedBankIds.length;

  // Get a list of the lifelines that are enabled in the config.
  const enabledLifelines = Object.entries(activeGameConfig.lifelines)
    .filter(([, value]) => value)
    .map(([key]) => key);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        
        <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <PackageCheck className="text-indigo-600" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Your Quiz Session
        </h1>
        <p className="text-slate-600 mb-8">
          Ready to test your knowledge? Good luck!
        </p>

        {/* --- Session Details Section --- */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 text-left mb-8">
          <div className="flex items-center gap-3">
            <ListOrdered className="h-6 w-6 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">Total Questions</p>
              <p className="text-sm text-slate-600">{totalQuestions} questions in this session</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Available Lifelines</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {enabledLifelines.length > 0 ? (
                  enabledLifelines.map(lifeline => (
                    <span key={lifeline} className="text-sm text-slate-600">{lifeline}</span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Link 
          href="/play/game" 
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <span>Start Game</span>
          <ArrowRight size={20} />
        </Link>
        
      </div>
    </div>
  );
}