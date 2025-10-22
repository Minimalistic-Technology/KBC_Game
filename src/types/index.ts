// This interface defines the structure for a single question's result
export interface QuestionResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

// This is the main Score model for your database and API
export interface Score {
  sessionId: string;
  playerName: string;
  bankId: string; // This would be a foreign key in a real DB
  prizeWon: number;
  safeCheckpointReached: boolean;
  questionResults: QuestionResult[];
  lifelinesUsed: Array<'50-50' | 'Hint' | 'Audience Poll'>;
  totalQuestions: number;
  totalTime: number; // in seconds
  timestamp: string; // ISO 8601 date string
}