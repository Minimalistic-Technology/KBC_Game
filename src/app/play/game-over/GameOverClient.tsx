
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
  user?: { name?: string; email?: string };
};

export interface MediaAsset {
  public_id: string;
  url: string;
  type: string;
  format: string;
}

export interface PrizeLadderItem {
  id: number;              // local React id
  mongoId?: string;        // <-- _id of prizeLadder subdoc from Mongo
  level: number;
  type: 'money' | 'gift';
  giftDesc?: string;
  value: number | string;
  isSafe: boolean;
  media?: MediaAsset;
}

type UserGameResult = {
  _id: string;
  userId: string;
  userName: string;
  gameConfigId: string;
  correctAnswered: number;
  finalScore: number;
  isWinner: boolean;
  totalTimeSeconds?: number;
  lifelinesUsed: string[];
  prizeLadder: PrizeLadderItem[];
  questions: any[];
  createdAt: string;
  updatedAt: string;
};

function shorten(id: string) {
  if (!id) return "-";
  return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

export default function GameOverClient() {
  const searchParams = useSearchParams();

  // ✅ gameConfigId comes ONLY from search params
  const gameConfigId = searchParams.get("gameConfigId") || "";

  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [scores, setScores] = useState<ApiScore[]>([]);

  const [userResult, setUserResult] = useState<UserGameResult | null>(null);
  const [userResultError, setUserResultError] = useState<string | null>(null);
  const [loadingUserResult, setLoadingUserResult] = useState(true);

  // 🔹 Fetch leaderboard (same as before)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingLeaderboard(true);
        setLeaderboardError(null);
        const res = await axiosInstance.get("/api/score/get", {
          params: { page: 1, limit: 50 },
          withCredentials: true,
        });
        const { results = [] } = res.data ?? {};
        if (!cancelled) setScores(results as ApiScore[]);
      } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        if (!cancelled) setLeaderboardError("Could not load leaderboard.");
      } finally {
        if (!cancelled) setLoadingLeaderboard(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 Fetch current user's game result using gameConfigId from search params
  useEffect(() => {
    if (!gameConfigId) {
      setUserResultError("Missing game configuration.");
      setLoadingUserResult(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoadingUserResult(true);
        setUserResultError(null);

        const res = await axiosInstance.post(
          "/api/score/user/result",
          { gameConfigId },
          { withCredentials: true }
        );

        const { result } = res.data ?? {};
        if (!cancelled) {
          setUserResult(result || null);
        }
      } catch (e) {
        console.error("Failed to fetch user game result:", e);
        if (!cancelled) {
          setUserResultError("Could not load your game result.");
        }
      } finally {
        if (!cancelled) setLoadingUserResult(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gameConfigId]);

  // 🔹 Compute top 5 leaderboard
  const topPlayers = useMemo(() => {
    const rows = [...(scores || [])];
    rows.sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
    return rows.slice(0, 5).map((s) => ({
      name: s.userName || shorten(s.userId),
      score: Number(s.finalScore) || 0,
      id: s._id,
    }));
  }, [scores]);

  const wonPrizeLadder = useMemo(() => {
    if (!userResult || !userResult.prizeLadder?.length) return [];

    const { isWinner, correctAnswered, prizeLadder } = userResult;

    // 🟢 1) If user actually won the game, ignore safe points and show full ladder
    if (isWinner) {
      return [...prizeLadder].sort((a, b) => a.level - b.level);
    }

    // 🔵 2) If not winner, use safe checkpoints logic
    if (!correctAnswered || correctAnswered <= 0) return [];

    const safeLevels = prizeLadder.filter(
      (item) => item.isSafe && item.level <= correctAnswered
    );

    if (safeLevels.length === 0) {
      // user never reached a safe point → nothing guaranteed
      return [];
    }

    const lastSafeLevel = Math.max(...safeLevels.map((s) => s.level));

    return prizeLadder
      .filter((item) => item.level <= lastSafeLevel)
      .sort((a, b) => a.level - b.level);
  }, [userResult]);

  // 🔹 Prize to display = last safe prize from ladder
  const displayPrizeText = useMemo(() => {
    if (!wonPrizeLadder.length) return "0";

    const last = wonPrizeLadder[wonPrizeLadder.length - 1];
    if (last.type === "money") {
      const num = Number(last.value) || 0;
      return `$${num.toLocaleString()}`;
    }
    return String(last.value || "Gift");
  }, [wonPrizeLadder]);

  const finalIsWinner = userResult?.isWinner ?? false;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 py-12">
      {/* Main Game Over Card */}
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
          className={`mx-auto ${finalIsWinner ? "bg-indigo-100" : "bg-slate-100"
            } rounded-full w-20 h-20 flex items-center justify-center mb-4`}
        >
          {finalIsWinner ? (
            <PartyPopper className="text-indigo-600" size={48} />
          ) : (
            <Frown className="text-slate-600" size={48} />
          )}
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {finalIsWinner ? "Congratulations!" : "Game Over"}
        </h1>

        <p className="text-lg text-slate-600 mb-2">
          You&apos;re walking away with
        </p>

        {/* ✅ Prize from backend (wonPrizeLadder) */}
        <div className="text-5xl font-bold text-indigo-600 mb-4">
          {displayPrizeText}
        </div>

        {/* Optional: show correct answered from backend */}
        {userResult && (
          <p className="text-sm text-slate-500 mb-4">
            Correct answers:{" "}
            <span className="font-semibold">{userResult.correctAnswered}</span>
          </p>
        )}

        <Link
          href="/play"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <RotateCcw size={20} />
          <span>Play Again</span>
        </Link>
      </motion.div>

      {/* Won Prize Ladder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-8"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Won Prize Ladder
        </h2>

        {loadingUserResult && (
          <div className="text-slate-500 text-sm">Loading your result…</div>
        )}

        {userResultError && (
          <div className="text-red-600 text-sm">{userResultError}</div>
        )}

        {!loadingUserResult && !userResultError && (
          <>
            {wonPrizeLadder.length === 0 ? (
              <div className="text-slate-500 text-sm">No safe prize level reached yet.</div>
            ) : (
              <div className="space-y-3">
                {wonPrizeLadder.map((item) => {
                  const isGift = item.type === "gift";
                  const hasImage = Boolean(item.media?.url);

                  return (
                    <div
                      key={item.level}
                      className={`rounded-xl px-4 py-3 border ${item.isSafe
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-slate-50 border-slate-200"
                        }`}
                    >
                      {/* 🔹 Gift Layout */}
                      {isGift && hasImage ? (
                        <div className="flex items-center justify-between gap-4">
                          {/* Left Side: Text */}
                          <div>
                            <p className="text-sm text-slate-600 font-semibold">
                              Level {item.level} • Gift
                            </p>
                            <p className="text-lg font-bold text-slate-800 mt-1">
                              {String(item.value)}
                            </p>
                          </div>

                          {/* Right Side: Image */}
                          <img
                            src={item.media!.url}
                            alt="Gift image"
                            className="h-24 w-24 rounded-lg object-cover border border-slate-300 shadow-sm"
                          />
                        </div>
                      ) : (
                        /* 🔹 Money Layout */
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">
                            Level {item.level} • Money
                          </span>
                          <span className="font-bold text-indigo-600">
                            ${Number(item.value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </>
        )}
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
            {loadingLeaderboard ? "Loading Leaderboard…" : "Leaderboard"}
          </h2>
        </div>

        {leaderboardError && (
          <div className="text-center text-red-600">{leaderboardError}</div>
        )}

        {!loadingLeaderboard && !leaderboardError && (
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
