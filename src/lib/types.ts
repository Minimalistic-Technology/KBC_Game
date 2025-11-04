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
  status: 'Published' | 'Draft'; // --- UPDATED THIS LINE ---
  tags: string[];
  ageGroup?: string;
  questionCount: number;
  prize: string;
  prizeMedia?: MediaAsset;
  onlySafePoints?: boolean;
  defaultTimer: number; // in seconds
  // --- REMOVED scheduledFor ---
  prizeLadder: PrizeLevel[];
};

export type Lifeline = {
  '50:50': boolean;
  'Audience Poll': boolean;
  'Expert Advice': boolean;
  'Flip Question': boolean;
};

export type DerivedFormat = {
  name: string;
  resolution: string;
};

export type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  fileName: string;
  derivedFormats: DerivedFormat[];
  defaultFormat?: DerivedFormat;
};

export type Question = {
  id: number;
  level: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  media?: MediaAsset;
  status: 'Draft' | 'Published';
  tags: string[];
  lifelines: Lifeline;
};