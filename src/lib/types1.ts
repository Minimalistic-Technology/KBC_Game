// lib/types.ts

export type PrizeLevel = {
  id: number;
  level: number;
  type: 'money' | 'gift';
  value: string | number;
  media?: MediaAsset;
  isSafe: boolean;
};

export type QuestionBank = {
  _id? : string;
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'Published' | 'Draft';
  tags: string[];
  ageGroup?: string;
  questionCount: number;
  defaultTimer: number; // in seconds
  prizeLadder: PrizeLevel[];
};

export type Lifeline = {
  '50:50': boolean;
  'Audience Poll': boolean;
  'Expert Advice': boolean;
  'Flip Question': boolean;
};

export type GameConfig = {
  id: string;
  name: string;
  isActive: boolean; // <-- ADDED THIS
  selectedBankIds: string[];
  prizeLadder: PrizeLevel[];
  lifelines: Lifeline;
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
  _id?: string;
  id: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  media?: MediaAsset;
  status: 'Draft' | 'Published';
  tags: string[];
};