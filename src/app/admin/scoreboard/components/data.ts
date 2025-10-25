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
  finalScore: number;
  date: string;
  totalTimeSeconds: number;
  lifelinesUsed: Array<'50-50' | 'Hint'>;
  questions: QuestionDetail[];
}

const mockScores: Score[] = [
  // --- Data with question details ---
  { 
    id: 'score_21', 
    playerName: 'Wonder Woman', 
    finalScore: 98, 
    date: '2025-10-15T09:05:00Z', 
    totalTimeSeconds: 110, 
    lifelinesUsed: [], 
    questions: [
        { text: "Who wrote '1984'?", selectedAnswer: 'George Orwell', correctAnswer: 'George Orwell', isCorrect: true, timeTakenSeconds: 10 },
        { text: "What is the capital of Japan?", selectedAnswer: 'Tokyo', correctAnswer: 'Tokyo', isCorrect: true, timeTakenSeconds: 8 },
        { text: "Which element has the symbol 'O'?", selectedAnswer: 'Oxygen', correctAnswer: 'Oxygen', isCorrect: true, timeTakenSeconds: 5 },
    ] 
  },
  { 
    id: 'score_22', 
    playerName: 'Spider-Man', 
    finalScore: 85, 
    date: '2025-10-15T10:30:00Z', 
    totalTimeSeconds: 150, 
    lifelinesUsed: ['50-50'], 
    questions: [
        { text: "What is the largest mammal?", selectedAnswer: 'Blue Whale', correctAnswer: 'Blue Whale', isCorrect: true, timeTakenSeconds: 12 },
        // --- CORRECTED: Incorrect answer is now the last question ---
        { text: "Who painted the Mona Lisa?", selectedAnswer: 'Vincent van Gogh', correctAnswer: 'Leonardo da Vinci', isCorrect: false, timeTakenSeconds: 25 },
    ]
  },
  { 
    id: 'score_23', 
    playerName: 'Batman', 
    finalScore: 92, 
    date: '2025-10-15T11:00:00Z', 
    totalTimeSeconds: 130, 
    lifelinesUsed: [], 
    questions: [
        { text: "What is the powerhouse of the cell?", selectedAnswer: 'Mitochondria', correctAnswer: 'Mitochondria', isCorrect: true, timeTakenSeconds: 15 },
        { text: "Which planet is closest to the sun?", selectedAnswer: 'Mercury', correctAnswer: 'Mercury', isCorrect: true, timeTakenSeconds: 7 },
    ]
  },
  { 
    id: 'score_1', 
    playerName: 'Alice Johnson', 
    finalScore: 90, 
    date: '2025-10-14T10:00:00Z', 
    totalTimeSeconds: 120, 
    lifelinesUsed: ['50-50'], 
    questions: [
        { text: "What is H2O?", selectedAnswer: 'Water', correctAnswer: 'Water', isCorrect: true, timeTakenSeconds: 6 },
        { text: "How many continents are there?", selectedAnswer: '7', correctAnswer: '7', isCorrect: true, timeTakenSeconds: 9 },
    ]
  },
  { 
    id: 'score_2', 
    playerName: 'Bob Smith', 
    finalScore: 70, 
    date: '2025-10-13T14:30:00Z', 
    totalTimeSeconds: 180, 
    lifelinesUsed: ['Hint', '50-50'], 
    questions: [
        // --- CORRECTED: Incorrect answer is the only question in this session ---
        { text: "What is the capital of Australia?", selectedAnswer: 'Sydney', correctAnswer: 'Canberra', isCorrect: false, timeTakenSeconds: 30 },
    ]
  },
  { 
    id: 'score_3', 
    playerName: 'Charlie Brown', 
    finalScore: 85, 
    date: '2025-10-12T09:00:00Z', 
    totalTimeSeconds: 150, 
    lifelinesUsed: [], 
    questions: [
        { text: "What is the tallest mountain in the world?", selectedAnswer: 'Mount Everest', correctAnswer: 'Mount Everest', isCorrect: true, timeTakenSeconds: 20 },
    ]
  },
  // --- The rest of the data with empty question arrays remains the same ---
  { id: 'score_4', playerName: 'Deadpool', finalScore: 95, date: '2025-10-11T11:00:00Z', totalTimeSeconds: 110, lifelinesUsed: [], questions: [] },
  { id: 'score_5', playerName: 'flying jatt', finalScore: 60, date: '2025-10-10T16:45:00Z', totalTimeSeconds: 210, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_6', playerName: 'gangadhar', finalScore: 78, date: '2025-10-09T13:20:00Z', totalTimeSeconds: 160, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_7', playerName: 'shaktiman', finalScore: 50, date: '2025-10-08T18:00:00Z', totalTimeSeconds: 240, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_8', playerName: 'crime master gogo', finalScore: 100, date: '2025-10-07T10:10:00Z', totalTimeSeconds: 90, lifelinesUsed: [], questions: [] },
  { id: 'score_9', playerName: 'meet ', finalScore: 92, date: '2025-10-06T12:00:00Z', totalTimeSeconds: 130, lifelinesUsed: [], questions: [] },
  { id: 'score_9a', playerName: 'meet (evening)', finalScore: 88, date: '2025-10-06T18:00:00Z', totalTimeSeconds: 140, lifelinesUsed: [], questions: [] },
  { id: 'score_10', playerName: 'harsh jha', finalScore: 68, date: '2025-10-05T20:00:00Z', totalTimeSeconds: 190, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_11', playerName: 'salman khan', finalScore: 88, date: '2025-10-04T08:30:00Z', totalTimeSeconds: 125, lifelinesUsed: [], questions: [] },
  { id: 'score_12', playerName: 'nana patekar', finalScore: 94, date: '2025-10-03T22:00:00Z', totalTimeSeconds: 115, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_13', playerName: 'jay ', finalScore: 100, date: '2025-10-02T15:00:00Z', totalTimeSeconds: 300, lifelinesUsed: ['Hint', '50-50'], questions: [] },
  { id: 'score_14', playerName: 'pallavi ', finalScore: 98, date: '2025-10-01T19:00:00Z', totalTimeSeconds: 100, lifelinesUsed: [], questions: [] },
  { id: 'score_15', playerName: "sneha ma'am", finalScore: 75, date: '2025-09-30T17:00:00Z', totalTimeSeconds: 170, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_16', playerName: 'chirag yadav', finalScore: 82, date: '2025-09-29T14:15:00Z', totalTimeSeconds: 140, lifelinesUsed: [], questions: [] },
  { id: 'score_17', playerName: 'manan doshi', finalScore: 91, date: '2025-09-28T11:45:00Z', totalTimeSeconds: 118, lifelinesUsed: ['50-50'], questions: [] },
  { id: 'score_18', playerName: 'parth doshi ', finalScore: 65, date: '2025-09-27T09:05:00Z', totalTimeSeconds: 200, lifelinesUsed: ['Hint'], questions: [] },
  { id: 'score_19', playerName: 'harsh ratnani', finalScore: 99, date: '2025-09-26T13:00:00Z', totalTimeSeconds: 95, lifelinesUsed: [], questions: [] },
  { id: 'score_20', playerName: 'shubham mulye', finalScore: 96, date: '2025-09-25T16:30:00Z', totalTimeSeconds: 105, lifelinesUsed: ['Hint'], questions: [] },
];

interface FetchScoresParams {
  page: number;
  limit: number;
  view: 'all' | 'leaderboard' | string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchScores = async (params: FetchScoresParams) => {
  const { page, limit, view, search, startDate, endDate } = params;

  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredScores = mockScores;

  if (view === 'leaderboard') {
    const today = new Date('2025-10-15T00:00:00Z');
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    filteredScores = mockScores
      .filter(score => {
        const scoreDate = new Date(score.date);
        return scoreDate >= startOfDay && scoreDate <= endOfDay;
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }
  else {
    if (search) {
      filteredScores = filteredScores.filter(score =>
        score.playerName.toLowerCase().includes(search.toLowerCase())
      );
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