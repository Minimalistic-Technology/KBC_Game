import type { GameConfig as FrontendConfig, QuestionBank as FrontendBank, PrizeLevel as FrontendPrizeLevel, MediaAsset as FrontendMediaAsset } from '@/lib/types1';

// --- Backend-side helper types matching your Mongoose schema ---

export interface BackendMediaAsset {
  public_id: string;
  url: string;
  type: string;
  format: string;
}

export interface BackendPrizeLevel {
  _id: string;
  level: number;
  type: 'money' | 'gift';
  value: number | string;
  isSafe: boolean;
  media?: BackendMediaAsset;
}

export interface BackendLifelines {
  '50:50': boolean;
  'Audience Poll': boolean;
  'Expert Advice': boolean;
  'Flip Question': boolean;
}

// --- GameConfig Types (Existing) ---
export interface BackendConfig {
  _id: string;
  configName: string;
  isActive: boolean;
  selectedBanks: string[];        // Backend uses 'selectedBanks'
  prizeLadder: BackendPrizeLevel[];
  lifelines: BackendLifelines;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendConfigListItem {
  _id: string;
  configName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- QuestionBank Types (Existing) ---
export interface BackendQuestionBank {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categories: string[];
  ageGroup?: string;
  defaultTimer: number;
  bankImage?: string;
  position: number;
  label: string;
  enabled: boolean;
  published: boolean;
  createdBy: string;
}

// --- GameConfig Mappers (UPDATED) ---

// Backend -> Frontend full config
export const backendToFrontend = (config: BackendConfig): FrontendConfig => {
  return {
    id: config._id,
    name: config.configName,
    isActive: config.isActive,
    selectedBankIds: config.selectedBanks, // map 'selectedBanks' -> 'selectedBankIds'
    prizeLadder: config.prizeLadder.map((pl, index): FrontendPrizeLevel => ({
      id: index + 1,              // local React id (NOT Mongo)
      mongoId: pl._id,            // Mongo subdocument _id (used for image upload)
      level: pl.level,
      type: pl.type,
      value: pl.value,
      isSafe: pl.isSafe,
      media: pl.media as FrontendMediaAsset | undefined,
    })),
    lifelines: config.lifelines,
  };
};

// Backend list item -> minimal Frontend GameConfig
export const backendListToFrontend = (config: BackendConfigListItem): FrontendConfig => {
  return {
    id: config._id,
    name: config.configName,
    isActive: config.isActive,
    selectedBankIds: [], // not loaded in list endpoint
    prizeLadder: [],
    lifelines: { '50:50': false, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': false },
  };
};

// Frontend -> Backend payload for create/update
export const frontendToBackend = (config: FrontendConfig) => {
  const { id, name, selectedBankIds, prizeLadder, ...rest } = config;

  return {
    ...rest,
    configName: name,
    selectedBanks: selectedBankIds, 
    prizeLadder: prizeLadder.map(pl => ({
      level: pl.level,
      type: pl.type,
      value: pl.value,
      isSafe: pl.isSafe,
      media: pl.media, // { public_id, url, type, format } or undefined
    })),
  };
};

// --- QuestionBank Mapper (Existing) ---
export const bankBackendToFrontend = (bank: BackendQuestionBank): FrontendBank => {
  return {
    id: bank._id,
    title: bank.name,
    slug: bank.slug,
    description: bank.description || '',
    status: bank.published ? 'Published' : 'Draft',
    tags: bank.categories,
    ageGroup: bank.ageGroup,
    questionCount: 0,
    defaultTimer: bank.defaultTimer,
    prizeLadder: [],
  };
};