import type { GameConfig as FrontendConfig, QuestionBank as FrontendBank } from '@/lib/types1';

// --- GameConfig Types (Existing) ---
export interface BackendConfig {
  _id: string;
  configName: string;
  isActive: boolean;
  selectedBanks: string[]; // <-- Backend uses 'selectedBanks'
  prizeLadder: any[]; 
  lifelines: any;     
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
export const backendToFrontend = (config: BackendConfig): FrontendConfig => {
  return {
    id: config._id,
    name: config.configName,
    isActive: config.isActive,
    selectedBankIds: config.selectedBanks, // <-- Map 'selectedBanks' to 'selectedBankIds'
    prizeLadder: config.prizeLadder.map((level, index) => ({
      ...level,
      id: level._id || index,
    })),
    lifelines: config.lifelines,
  };
};

export const backendListToFrontend = (config: BackendConfigListItem): FrontendConfig => {
    return {
      id: config._id,
      name: config.configName,
      isActive: config.isActive,
      selectedBankIds: [], 
      prizeLadder: [],
      lifelines: { '50:50': false, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': false },
    };
};

export const frontendToBackend = (config: FrontendConfig) => {
  // Destructure 'selectedBankIds'
  const { id, name, selectedBankIds, ...rest } = config;
  
  return {
    ...rest,
    configName: name,
    selectedBanks: selectedBankIds, // <-- Map 'selectedBankIds' to 'selectedBanks'
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