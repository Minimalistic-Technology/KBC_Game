'use client';

import { useSearchParams } from 'next/navigation';
import { PartyPopper, Frown, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock leaderboard data for demonstration purposes
const mockLeaderboard = [
  { rank: 1, name: 'Wonder Woman', score: 98 },
  { rank: 2, name: 'Batman', score: 92 },
  { rank: 3, name: 'Alice Johnson', score: 90 },
  { rank: 4, name: 'Spider-Man', score: 85 },
  { rank: 5, name: 'Charlie Brown', score: 85 },
];

export default function GameOverPage() {
  const searchParams = useSearchParams();

  const prizeValue = searchParams.get('prizeValue') || '0';
  const prizeType = searchParams.get('prizeType') || 'money';
  const isWinner = searchParams.get('winner') === 'true';
  const playerScore = Number(searchParams.get('score')) || 0;

  // Combine player's score with the leaderboard and sort to find their rank
  const currentPlayer = { name: 'You', score: playerScore };
  const combinedLeaderboard = [...mockLeaderboard, currentPlayer]
    .sort((a, b) => b.score - a.score);
  
  const playerRank = combinedLeaderboard.findIndex(p => p.name === 'You') + 1;

  // --- NEW LOGIC TO DETERMINE WHAT TO DISPLAY ---
  const topPlayers = combinedLeaderboard.slice(0, 5);
  const isPlayerInTop5 = topPlayers.some(p => p.name === 'You');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center"
      >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
            transition={{
                scale: { delay: 0.2, type: 'spring', stiffness: 200 },
                rotate: { delay: 0.4, duration: 0.5 }
            }}
            className={`mx-auto bg-${isWinner ? 'indigo' : 'slate'}-100 rounded-full w-20 h-20 flex items-center justify-center mb-4`}
        >
          {isWinner ? (
            <PartyPopper className="text-indigo-600" size={48} />
          ) : (
            <Frown className="text-slate-600" size={48} />
          )}
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isWinner ? "Congratulations!" : "Game Over"}
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          You're walking away with
        </p>
        <div className="text-5xl font-bold text-indigo-600 mb-8">
          {prizeType === 'money' ? `$${Number(prizeValue).toLocaleString()}` : prizeValue}
        </div>

        <Link
          href="/play"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <RotateCcw size={20} />
          <span>Play Again</span>
        </Link>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Today's Leaderboard</h2>
        </div>
        <div className="space-y-3">
            {topPlayers.map((player, index) => (
                <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${player.name === 'You' ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-slate-50'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-500 text-lg w-6">{index + 1}</span>
                        <span className="font-semibold text-slate-800">{player.name}</span>
                    </div>
                    <span className="font-bold text-indigo-600">{player.score} pts</span>
                </div>
            ))}

            {/* --- NEW: Display player's rank if they are not in the top 5 --- */}
            {!isPlayerInTop5 && (
                <>
                    <div className="text-center text-slate-400 font-bold py-2">...</div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-100 border-2 border-indigo-300">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-500 text-lg w-6">{playerRank}</span>
                            <span className="font-semibold text-slate-800">You</span>
                        </div>
                        <span className="font-bold text-indigo-600">{playerScore} pts</span>
                    </div>
                </>
            )}
        </div>
      </motion.div>
    </div>
  );
}