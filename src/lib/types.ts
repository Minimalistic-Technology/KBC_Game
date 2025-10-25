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
  id?: string;
   _id?: string;
  name: string;
  slug: string;
  description: string;
  published: boolean;
  categories: string[];
  ageGroup?: string;
  questionCount: number;
  defaultTimer: number; // in seconds
  prizeLadder: PrizeLevel[];
};

// --- ADDED THIS TYPE BACK ---
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
  id?: number;
  _id?:string;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  media?: any;
  mediaRefs?: string[];
  status: 'Draft' | 'Published';
  categories: string[];
};