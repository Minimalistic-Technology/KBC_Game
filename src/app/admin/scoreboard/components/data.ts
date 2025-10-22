import { Score } from '@/types';

interface FetchScoresResponse {
  scores: Score[];
  total: number;
}

interface FetchScoresParams {
  page: number;
  limit: number;
  search?: string;
  bankId?: string; // <-- Changed for consistency
  startDate?: string;
  endDate?: string;
}

export const fetchScores = async (params: FetchScoresParams): Promise<FetchScoresResponse> => {
  const { page, limit, search, bankId, startDate, endDate } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.append('playerName', search);
  if (bankId) query.append('bankId', bankId); // <-- Changed for consistency
  if (startDate) query.append('startDate', startDate);
  if (endDate) query.append('endDate', endDate);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/scores?${query.toString()}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch scores: ${response.statusText}`);
    }

    const data: FetchScoresResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching scores:", error);
    return { scores: [], total: 0 };
  }
};