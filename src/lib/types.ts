// lib/types.ts

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
  status: 'Published' | 'Draft' | 'Scheduled';
  tags: string[];
  questionCount: number;
  prize: number;
  defaultTimer: number; // in seconds
  scheduledFor: string | null;
  prizeLadder: PrizeLevel[];
};

export type Lifeline = {
  '50:50': boolean;
  'Audience Poll': boolean;
  'Expert Advice': boolean;
};

export type Question = {
  id: number;
  level: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  mediaUrl?: string | null;
  status: 'Draft' | 'Published'; // ADDED
  tags: string[];                  // ADDED
  lifelines: Lifeline;             // ADDED
};