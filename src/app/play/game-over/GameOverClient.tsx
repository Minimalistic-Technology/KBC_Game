"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { PartyPopper, Frown, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type ApiScore = {
  _id: string;
  userId: string;
  userName: string;
  finalScore: number;
  isWinner: boolean;
  totalTimeSeconds?: number;
  createdAt: string;
  // if your API populates user:
  user?: { name?: string; email?: string };
};

function shorten(id: string) {
  if (!id) return "-";
  return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

export default function GameOverClient() {
  const searchParams = useSearchParams();

  const prizeValue = searchParams.get("prizeValue") || "0";
  const prizeType = searchParams.get("prizeType") || "money";
  const isWinner = searchParams.get("winner") === "true";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<ApiScore[]>([]);

  // 🔹 Fetch ONLY from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/api/score/get", {
          params: { page: 1, limit: 50 }, // adjust as needed
          withCredentials: true,
        });
        const { results = [] } = res.data ?? {};
        if (!cancelled) setScores(results as ApiScore[]);
      } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        if (!cancelled) setError("Could not load leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sort by score descending (if API isn't already sorted)
  const topPlayers = useMemo(() => {
    const rows = [...(scores || [])];
    rows.sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
    return rows.slice(0, 5).map((s) => ({
      name: s.userName || shorten(s.userId),
      score: Number(s.finalScore) || 0,
      id: s._id,
    }));
  }, [scores]);

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
            scale: { delay: 0.2, type: "spring", stiffness: 200 },
            rotate: { delay: 0.4, duration: 0.5 },
          }}
          className={`mx-auto bg-${isWinner ? "indigo" : "slate"}-100 rounded-full w-20 h-20 flex items-center justify-center mb-4`}
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
        <p className="text-lg text-slate-600 mb-6">You're walking away with</p>
        <div className="text-5xl font-bold text-indigo-600 mb-8">
          {prizeType === "money" ? `$${Number(prizeValue).toLocaleString()}` : prizeValue}
        </div>

        <Link
          href="/play"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <RotateCcw size={20} />
          <span>Play Again</span>
        </Link>
      </motion.div>

      {/* Leaderboard (from backend only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Trophy className="text-yellow-500" size={24} />
          <h2 className="text-2xl font-bold text-slate-800">
            {loading ? "Loading Leaderboard…" : "Leaderboard"}
          </h2>
        </div>

        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}

        {!loading && !error && (
          <>
            {topPlayers.length === 0 ? (
              <div className="text-center text-slate-500">No scores yet.</div>
            ) : (
              <div className="space-y-3">
                {topPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-500 text-lg w-6">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {player.name}
                      </span>
                    </div>
                    <span className="font-bold text-indigo-600">
                      {player.score} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
