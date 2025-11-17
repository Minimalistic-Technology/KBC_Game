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

export type GameConfig = {
  id: string;
  name: string;
  isActive: boolean; // <-- ADDED THIS
  selectedBankIds: string[];
  prizeLadder: PrizeLevel[];
  lifelines: Lifeline;
};

export type DerivedFormat = {
  name: string;        // e.g. "Thumbnail", "HD", "MP3"
  resolution: string;  // e.g. "300x200", "720p", "128kbps"
  url?: string;        // optional – if you later generate real URLs
};

export type MediaAsset = {
  // Local/client id for React lists, etc.
  id: string;

  // Main file info
  url: string;                          // object URL or real URL
  type: 'image' | 'video' | 'audio';
  fileName: string;

  // Optional backend/meta fields
  public_id?: string;                   // e.g. Cloudinary public_id
  format?: string;                      // extension/format like "jpg", "mp4"

  // Available versions / qualities
  derivedFormats: DerivedFormat[];
};
export type Question = {
  id?: number;
  _id?:string;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
  media?: any;
  mediaRef?: any;
  status: 'Draft' | 'Published';
  categories: string[];
};