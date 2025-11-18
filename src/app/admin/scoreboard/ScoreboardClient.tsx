"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { ScoreTable } from "./components/ScoreTable";
import { PaginationControls } from "./components/PaginationControls";
import { useAtomValue } from "jotai";
import { authHydratedAtom, isAdminAtom } from "@/state/auth";

export function ScoreboardClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [scores, setScores] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const isAdmin = useAtomValue(isAdminAtom);

  // Redirect non-admins
  useEffect(() => {
    if (!hydrated) return; // wait for auth to load

    if (!isAdmin) {
      router.replace("/auth/login");
    }
  }, [hydrated, isAdmin, router]);

  // Fetch scores ONLY when admin + hydrated
  useEffect(() => {
    if (!hydrated) return;
    if (!isAdmin) return;

    const fetchScores = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/score/admin/get", {
          params: { page, limit },
          withCredentials: true,
        });

        const { results = [], total = 0 } = res.data || {};
        setScores(results);
        setTotal(total);
      } catch (error) {
        console.error("❌ Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [page, limit, hydrated, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Loading scores…
        </h2>
        <p className="text-slate-600 mt-2">Please wait.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Scoreboard
            </h1>
            <p className="text-slate-600 mt-1">
              Showing {scores.length} of {total} results.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <ScoreTable scores={scores} />
        </div>
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        hasPrevPage={page > 1}
        hasNextPage={page < totalPages}
      />
    </div>
  );
}
