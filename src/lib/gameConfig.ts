import type { PrizeLevel, Lifeline, GameConfig } from './types1'; // Import the new GameConfig type

// --- MOCK DATABASE OF SAVED CONFIGURATIONS ---
// In a real application, this would come from a database.
export const savedGameConfigs: GameConfig[] = [
  {
    id: 'config_1',
    name: 'Standard Weekly Quiz',
    selectedBankIds: ['q1', 'q3'],
    prizeLadder: [
      { id: 1, level: 1, type: 'money', value: 1000, isSafe: false },
      { id: 2, level: 2, type: 'money', value: 5000, isSafe: true },
      { id: 3, level: 3, type: 'gift', value: 'Smartwatch', isSafe: false, media: { id: 'media_sw', url: 'https://picsum.photos/seed/smartwatch/100/100', type: 'image', fileName: 'smartwatch.jpg', derivedFormats: [] } },
      { id: 4, level: 4, type: 'money', value: 25000, isSafe: true },
    ],
    lifelines: {
      '50:50': true,
      'Audience Poll': true,
      'Expert Advice': false,
      'Flip Question': true,
    },
  },
  {
    id: 'config_2',
    name: 'Kids Cartoon Special',
    selectedBankIds: ['q4'],
    prizeLadder: [
        { id: 1, level: 1, type: 'gift', value: 'Stuffed Animal', isSafe: true },
        { id: 2, level: 2, type: 'gift', value: 'Video Game', isSafe: true },
    ],
    lifelines: {
      '50:50': true,
      'Audience Poll': true,
      'Expert Advice': true,
      'Flip Question': false,
    },
  }
];

// --- IDENTIFIER FOR THE ACTIVE CONFIG ---
// The game will use the configuration with this ID.
export const activeGameConfigId = 'config_1';


// --- DERIVED ACTIVE CONFIGURATION ---
// This finds the active config from the list and exports it for the game to use.
// This means you only need to change the activeGameConfigId above to change the live game settings.
export const activeGameConfig = savedGameConfigs.find(c => c.id === activeGameConfigId) || savedGameConfigs[0];