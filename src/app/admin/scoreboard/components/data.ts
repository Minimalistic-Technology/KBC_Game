// ... (interfaces remain the same) ...
export interface QuestionDetail {
  text: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
}
export interface Score {
  id: string;
  playerName: string;
  questionBank: 'General Knowledge' | 'Modern History' | 'JavaScript Fundamentals';
  finalScore: number;
  date: string;
  totalTimeSeconds: number;
  lifelinesUsed: Array<'50-50' | 'Hint'>;
  questions: QuestionDetail[];
}

const mockScores: Score[] = [
  // --- New Data for Oct 15, 2025 ---
  { id: 'score_21', playerName: 'Wonder Woman', questionBank: 'Modern History', finalScore: 98, date: '2025-10-15T09:05:00Z', totalTimeSeconds: 110, lifelinesUsed: [], questions: [] },
  { id: 'score_22', playerName: 'Spider-Man', questionBank: 'General Knowledge', finalScore: 85, date: '2025-10-15T10:30:00Z', totalTimeSeconds: 150, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_23', playerName: 'Batman', questionBank: 'JavaScript Fundamentals', finalScore: 92, date: '2025-10-15T11:00:00Z', totalTimeSeconds: 130, lifelinesUsed: [], questions: [] },

  // --- Existing Data ---
  { id: 'score_1', playerName: 'Alice Johnson', questionBank: 'General Knowledge', finalScore: 90, date: '2025-10-14T10:00:00Z', totalTimeSeconds: 120, lifelinesUsed: ['50-50'], questions: [] },
  // ... (the rest of your mock data)
  { id: 'score_2', playerName: 'Bob Smith', questionBank: 'JavaScript Fundamentals', finalScore: 70, date: '2025-10-13T14:30:00Z', totalTimeSeconds: 180, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_3', playerName: 'Charlie Brown', questionBank: 'Modern History', finalScore: 85, date: '2025-10-12T09:00:00Z', totalTimeSeconds: 150, lifelinesUsed: [], questions: [] },
  { id: 'score_4', playerName: 'Deadpool', questionBank: 'General Knowledge', finalScore: 95, date: '2025-10-11T11:00:00Z', totalTimeSeconds: 110, lifelinesUsed: [], questions: [] },
  { id: 'score_5', playerName: 'flying jatt', questionBank: 'JavaScript Fundamentals', finalScore: 60, date: '2025-10-10T16:45:00Z', totalTimeSeconds: 210, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_6', playerName: 'gangadhar', questionBank: 'Modern History', finalScore: 78, date: '2025-10-09T13:20:00Z', totalTimeSeconds: 160, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_7', playerName: 'shaktiman', questionBank: 'General Knowledge', finalScore: 50, date: '2025-10-08T18:00:00Z', totalTimeSeconds: 240, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_8', playerName: 'crime master gogo', questionBank: 'JavaScript Fundamentals', finalScore: 100, date: '2025-10-07T10:10:00Z', totalTimeSeconds: 90, lifelinesUsed: [], questions: [] },
  { id: 'score_9', playerName: 'meet ', questionBank: 'Modern History', finalScore: 92, date: '2025-10-06T12:00:00Z', totalTimeSeconds: 130, lifelinesUsed: [], questions: [] },
  { id: 'score_9a', playerName: 'meet (evening)', questionBank: 'General Knowledge', finalScore: 88, date: '2025-10-06T18:00:00Z', totalTimeSeconds: 140, lifelinesUsed: [], questions: [] },
  { id: 'score_10', playerName: 'harsh jha', questionBank: 'General Knowledge', finalScore: 68, date: '2025-10-05T20:00:00Z', totalTimeSeconds: 190, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_11', playerName: 'salman khan', questionBank: 'General Knowledge', finalScore: 88, date: '2025-10-04T08:30:00Z', totalTimeSeconds: 125, lifelinesUsed: [], questions: [] },
  { id: 'score_12', playerName: 'nana patekar', questionBank: 'Modern History', finalScore: 94, date: '2025-10-03T22:00:00Z', totalTimeSeconds: 115, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_13', playerName: 'jay ', questionBank: 'JavaScript Fundamentals', finalScore: 100, date: '2025-10-02T15:00:00Z', totalTimeSeconds: 300, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_14', playerName: 'pallavi ', questionBank: 'General Knowledge', finalScore: 98, date: '2025-10-01T19:00:00Z', totalTimeSeconds: 100, lifelinesUsed: [], questions: [] },
  { id: 'score_15', playerName: "sneha ma'am", questionBank: 'JavaScript Fundamentals', finalScore: 75, date: '2025-09-30T17:00:00Z', totalTimeSeconds: 170, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_16', playerName: 'chirag yadav', questionBank: 'Modern History', finalScore: 82, date: '2025-09-29T14:15:00Z', totalTimeSeconds: 140, lifelinesUsed: [], questions: [] },
  { id: 'score_17', playerName: 'manan doshi', questionBank: 'General Knowledge', finalScore: 91, date: '2025-09-28T11:45:00Z', totalTimeSeconds: 118, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_18', playerName: 'parth doshi ', questionBank: 'JavaScript Fundamentals', finalScore: 65, date: '2025-09-27T09:05:00Z', totalTimeSeconds: 200, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_19', playerName: 'harsh ratnani', questionBank: 'Modern History', finalScore: 99, date: '2025-09-26T13:00:00Z', totalTimeSeconds: 95, lifelinesUsed: [], questions: [] },
  { id: 'score_20', playerName: 'shubham mulye', questionBank: 'JavaScript Fundamentals', finalScore: 96, date: '2025-09-25T16:30:00Z', totalTimeSeconds: 105, lifelinesUsed: ['Hint'], questions: [] },
];

interface FetchScoresParams {
  page: number;
  limit: number;
  view: 'all' | 'leaderboard' | string;
  search?: string;
  bank?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchScores = async (params: FetchScoresParams) => {
  const { page, limit, view, search, bank, startDate, endDate } = params;

  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredScores = mockScores;

  // --- LEADERBOARD LOGIC ---
  if (view === 'leaderboard') {
    const today = new Date('2025-10-15T00:00:00Z'); // Hardcoded for demonstration
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    filteredScores = mockScores
      .filter(score => {
        const scoreDate = new Date(score.date);
        return scoreDate >= startOfDay && scoreDate <= endOfDay;
      })
      .sort((a, b) => b.finalScore - a.finalScore); // Sort by score descending
  } 
  // --- STANDARD FILTERING LOGIC ---
  else {
    if (search) {
      filteredScores = filteredScores.filter(score =>
        score.playerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (bank) {
       filteredScores = filteredScores.filter(score => score.questionBank === bank);
    }
    if (startDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date(startDate);
      end.setUTCHours(23, 59, 59, 999);
      filteredScores = filteredScores.filter(score => {
          const scoreDate = new Date(score.date);
          return scoreDate >= start && scoreDate <= end;
      });
    }
  }

  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const paginatedScores = filteredScores.slice(startIdx, endIdx);

  return {
    scores: paginatedScores,
    total: filteredScores.length,
  };
};