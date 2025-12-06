// lib/types.ts

export interface MediaAsset {
  public_id: string;
  url: string;
  type: string;
  format: string;
}

export interface PrizeLevel {
  id: number;              // local React id
  mongoId?: string;        // <-- _id of prizeLadder subdoc from Mongo
  level: number;
  type: 'money' | 'gift';
  giftDesc?: string;
  value: number | string;
  isSafe: boolean;
  media?: MediaAsset;
}

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


export type Question = {
  _id?: string;
  id: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  media?: any;
  status: 'Draft' | 'Published';
  categories: string[];
};