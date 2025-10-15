import Link from 'next/link';
import { initialBanks } from '@/lib/data';
import { PackageCheck, ArrowRight } from 'lucide-react';

export default function LobbyPage() {
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
          The following topics will be covered in order. Good luck!
        </p>

        <div className="text-left bg-slate-50 border rounded-lg p-4 mb-8">
          <ol className="space-y-3">
            {initialBanks.map((bank, index) => (
              <li key={bank.id} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-sm">
                  {index + 1}
                </span>
                <span className="font-medium text-slate-800">{bank.title}</span>
              </li>
            ))}
          </ol>
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