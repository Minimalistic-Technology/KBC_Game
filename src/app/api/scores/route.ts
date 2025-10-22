import { NextRequest, NextResponse } from 'next/server';
import { Score } from '@/types';

// --- MOCK DATABASE with expanded data ---
const mockDatabase: Score[] = [
    // Previously existing data
    { sessionId: 'sess_1', playerName: 'Alice Johnson', bankId: 'General Knowledge', prizeWon: 100000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['50-50'], totalQuestions: 10, totalTime: 120, timestamp: '2025-10-14T10:00:00Z' },
    { sessionId: 'sess_2', playerName: 'Bob Smith', bankId: 'JavaScript Fundamentals', prizeWon: 5000, safeCheckpointReached: false, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 5, totalTime: 180, timestamp: '2025-10-13T14:30:00Z' },
    { sessionId: 'sess_3', playerName: 'Charlie Brown', bankId: 'Modern History', prizeWon: 80000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 8, totalTime: 150, timestamp: '2025-10-12T09:00:00Z' },
    
    // New data with your requested names
    { sessionId: 'sess_4', playerName: 'Deadpool', bankId: 'General Knowledge', prizeWon: 500000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 12, totalTime: 110, timestamp: '2025-10-11T11:00:00Z' },
    { sessionId: 'sess_5', playerName: 'flying jatt', bankId: 'JavaScript Fundamentals', prizeWon: 10000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 7, totalTime: 210, timestamp: '2025-10-10T16:45:00Z' },
    { sessionId: 'sess_6', playerName: 'gangadhar', bankId: 'Modern History', prizeWon: 320000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['50-50'], totalQuestions: 11, totalTime: 160, timestamp: '2025-10-09T13:20:00Z' },
    { sessionId: 'sess_7', playerName: 'shaktiman', bankId: 'General Knowledge', prizeWon: 1000, safeCheckpointReached: false, questionResults: [], lifelinesUsed: ['Hint', '50-50'], totalQuestions: 15, totalTime: 240, timestamp: '2025-10-08T18:00:00Z' },
    { sessionId: 'sess_8', playerName: 'crime master gogo', bankId: 'JavaScript Fundamentals', prizeWon: 1000000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 10, totalTime: 90, timestamp: '2025-10-07T10:10:00Z' },
    { sessionId: 'sess_9', playerName: 'meet', bankId: 'Modern History', prizeWon: 640000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 13, totalTime: 130, timestamp: '2025-10-06T12:00:00Z' },
    { sessionId: 'sess_10', playerName: 'harsh jha', bankId: 'General Knowledge', prizeWon: 20000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 9, totalTime: 190, timestamp: '2025-10-05T20:00:00Z' },
    { sessionId: 'sess_11', playerName: 'salman khan', bankId: 'General Knowledge', prizeWon: 40000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 10, totalTime: 125, timestamp: '2025-10-04T08:30:00Z' },
    { sessionId: 'sess_12', playerName: 'nana patekar', bankId: 'Modern History', prizeWon: 1250000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['50-50'], totalQuestions: 14, totalTime: 115, timestamp: '2025-10-03T22:00:00Z' },
    { sessionId: 'sess_13', playerName: 'jay', bankId: 'JavaScript Fundamentals', prizeWon: 10000000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint', '50-50'], totalQuestions: 15, totalTime: 300, timestamp: '2025-10-02T15:00:00Z' },
    { sessionId: 'sess_14', playerName: 'pallavi', bankId: 'General Knowledge', prizeWon: 5000000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 12, totalTime: 100, timestamp: '2025-10-01T19:00:00Z' },
    { sessionId: 'sess_15', playerName: "sneha ma'am", bankId: 'JavaScript Fundamentals', prizeWon: 80000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 8, totalTime: 170, timestamp: '2025-09-30T17:00:00Z' },
    { sessionId: 'sess_16', playerName: 'chirag yadav', bankId: 'Modern History', prizeWon: 160000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 9, totalTime: 140, timestamp: '2025-09-29T14:15:00Z' },
    { sessionId: 'sess_17', playerName: 'manan doshi', bankId: 'General Knowledge', prizeWon: 640000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['50-50'], totalQuestions: 13, totalTime: 118, timestamp: '2025-09-28T11:45:00Z' },
    { sessionId: 'sess_18', playerName: 'parth doshi', bankId: 'JavaScript Fundamentals', prizeWon: 10000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 7, totalTime: 200, timestamp: '2025-09-27T09:05:00Z' },
    { sessionId: 'sess_19', playerName: 'harsh ratnani', bankId: 'Modern History', prizeWon: 5000000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: [], totalQuestions: 12, totalTime: 95, timestamp: '2025-09-26T13:00:00Z' },
    { sessionId: 'sess_20', playerName: 'shubham mulye', bankId: 'JavaScript Fundamentals', prizeWon: 2500000, safeCheckpointReached: true, questionResults: [], lifelinesUsed: ['Hint'], totalQuestions: 11, totalTime: 105, timestamp: '2025-09-25T16:30:00Z' },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const playerName = searchParams.get('playerName');
  const bankId = searchParams.get('bankId');
  // --- FIX: Read 'startDate' and 'endDate' to match the client ---
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || process.env.PAGINATION_DEFAULT_LIMIT || '10', 10);

  let filteredScores = mockDatabase;

  if (playerName) {
    filteredScores = filteredScores.filter(score =>
      score.playerName.toLowerCase().includes(playerName.toLowerCase())
    );
  }

  if (bankId) {
    filteredScores = filteredScores.filter(score => score.bankId === bankId);
  }

  if (startDate) {
    const effectiveEndDate = endDate || startDate;
    filteredScores = filteredScores.filter(score => {
      const scoreDateStr = score.timestamp.substring(0, 10); // 'YYYY-MM-DD'
      return scoreDateStr >= startDate && scoreDateStr <= effectiveEndDate;
    });
  }

  filteredScores.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const total = filteredScores.length;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const paginatedScores = filteredScores.slice(startIdx, endIdx);

  return NextResponse.json({
    scores: paginatedScores,
    total: total,
  });
}