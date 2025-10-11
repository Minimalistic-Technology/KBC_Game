export interface Question1 {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export type PrizeLevel = {
  id: number;
  level: number;
  amount: number;
  isSafe: boolean;
};

export type QuestionBank = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'published' | 'draft';
  tags: string[];
  questionCount: number;
  defaultTimer: number; // in seconds
  scheduledFor: string | null;
  prizeLadder: PrizeLevel[];
};

export type Question = {
  id: number;
  level: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
};