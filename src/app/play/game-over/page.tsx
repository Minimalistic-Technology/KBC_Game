import { Suspense } from 'react';
import GameOverClient from './GameOverClient';

// A simple loading component to show while waiting for search params
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <p className="text-xl font-semibold text-slate-700">Loading results...</p>
  </div>
);

export default function GameOverPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameOverClient />
    </Suspense>
  );
}