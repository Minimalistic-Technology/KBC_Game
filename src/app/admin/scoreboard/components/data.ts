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
  { 
    id: 'score_21', playerName: 'Wonder Woman', questionBank: 'Modern History', finalScore: 98, date: '2025-10-15T09:05:00Z', totalTimeSeconds: 110, lifelinesUsed: [], 
    questions: [
      { text: "Who wrote '1984'?", selectedAnswer: 'George Orwell', correctAnswer: 'George Orwell', isCorrect: true, timeTakenSeconds: 10 },
      { text: "What is the capital of Japan?", selectedAnswer: 'Tokyo', correctAnswer: 'Tokyo', isCorrect: true, timeTakenSeconds: 8 },
    ] 
  },
  { 
    id: 'score_22', playerName: 'Spider-Man', questionBank: 'General Knowledge', finalScore: 85, date: '2025-10-15T10:30:00Z', totalTimeSeconds: 150, lifelinesUsed: ['50-50'], 
    questions: [
      { text: "What is the largest mammal?", selectedAnswer: 'Blue Whale', correctAnswer: 'Blue Whale', isCorrect: true, timeTakenSeconds: 12 },
      { text: "Who painted the Mona Lisa?", selectedAnswer: 'Vincent van Gogh', correctAnswer: 'Leonardo da Vinci', isCorrect: false, timeTakenSeconds: 25 },
    ]
  },
  { id: 'score_23', playerName: 'Batman', questionBank: 'JavaScript Fundamentals', finalScore: 92, date: '2025-10-15T11:00:00Z', totalTimeSeconds: 130, lifelinesUsed: [], questions: [] },
  { id: 'score_1', playerName: 'Alice Johnson', questionBank: 'General Knowledge', finalScore: 90, date: '2025-10-14T10:00:00Z', totalTimeSeconds: 120, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_2', playerName: 'Bob Smith', questionBank: 'JavaScript Fundamentals', finalScore: 70, date: '2025-10-13T14:30:00Z', totalTimeSeconds: 180, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_3', playerName: 'Charlie Brown', questionBank: 'Modern History', finalScore: 85, date: '2025-10-12T09:00:00Z', totalTimeSeconds: 150, lifelinesUsed: [], questions: [] },
  { id: 'score_4', playerName: 'Deadpool', questionBank: 'General Knowledge', finalScore: 95, date: '2025-10-11T11:00:00Z', totalTimeSeconds: 110, lifelinesUsed: [], questions: [] },
  { id: 'score_5', playerName: 'flying jatt', questionBank: 'JavaScript Fundamentals', finalScore: 60, date: '2025-10-10T16:45:00Z', totalTimeSeconds: 210, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_6', playerName: 'gangadhar', questionBank: 'Modern History', finalScore: 78, date: '2025-10-09T13:20:00Z', totalTimeSeconds: 160, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_7', playerName: 'shaktiman', questionBank: 'General Knowledge', finalScore: 50, date: '2025-10-08T18:00:00Z', totalTimeSeconds: 240, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_8', playerName: 'crime master gogo', questionBank: 'JavaScript Fundamentals', finalScore: 100, date: '2025-10-07T10:10:00Z', totalTimeSeconds: 90, lifelinesUsed: [], questions: [] },
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

  if (view === 'leaderboard') {
    const today = new Date('2025-10-15T00:00:00Z'); // Hardcoded for demonstration
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    filteredScores = mockScores
      .filter(score => {
        const scoreDate = new Date(score.date);
        return scoreDate >= startOfDay && scoreDate <= endOfDay;
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  } else {
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