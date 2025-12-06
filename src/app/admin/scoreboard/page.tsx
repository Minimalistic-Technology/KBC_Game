// 🚫 no "use client" here

import { Suspense } from "react";
import { ScoreboardClient } from "./ScoreboardClient";

export default function ScoreboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center">
          <h2 className="text-2xl font-semibold text-slate-800">
            Loading scores…
          </h2>
          <p className="text-slate-600 mt-2">Please wait.</p>
        </div>
      }
    >
      <ScoreboardClient />
    </Suspense>
  );
}
