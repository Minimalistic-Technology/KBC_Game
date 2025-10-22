import { Filters } from './components/Filters';
import { ScoreTable } from './components/ScoreTable';
import { fetchScores } from './components/data';
import { PaginationControls } from './components/PaginationControls';
import { Trophy } from 'lucide-react';

export default async function ScoreboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const view = typeof searchParams.view === 'string' ? searchParams.view : 'all';

  const { scores, total } = await fetchScores({ page, limit, search, startDate, endDate });
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scoreboard</h1>
        <p className="text-slate-700 mt-1">
          {view === 'leaderboard' ? 'Top players for today. 🏆' : 'Review and analyze all player performance.'}
        </p>
      </div>

      <Filters />

      <div className="rounded-xl border bg-white shadow-sm">
        <ScoreTable scores={scores} />
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