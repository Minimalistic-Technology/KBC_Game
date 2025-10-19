import { Filters } from './components/Filters';
import { ScoreTable } from './components/ScoreTable';
import { fetchScores } from './components/data'; // Updated import
import { PaginationControls } from './components/PaginationControls';

export default async function ScoreboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search as string | undefined;
  // --- FIX: Read 'bank' from the URL ---
  const bank = searchParams.bank as string | undefined;
  const startDate = searchParams.startDate as string | undefined;
  const endDate = searchParams.endDate as string | undefined;
  // A view parameter can be added if you want to switch between all scores and leaderboard
  const view = (searchParams.view as string) || 'all'; 

  // Pass the corrected parameters to the fetch function
  const { scores, total } = await fetchScores({ page, limit, search, bank, startDate, endDate, view });
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Scoreboard</h1>
                <p className="text-slate-600 mt-1">Showing {scores.length} of {total} results.</p>
            </div>
             <Filters />
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