import type { PrizeLevel, Lifeline, GameConfig } from './types1'; 


export const savedGameConfigs: GameConfig[] = [
  {
    id: 'config_1',
    name: 'Standard Weekly Quiz',
    isActive: true,
    selectedBankIds: ['q1', 'q3', 'q2', 'q4'],
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
    isActive: false,
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


export const activeGameConfigId = 'config_1';


export const activeGameConfig = savedGameConfigs.find(c => c.id === activeGameConfigId) || savedGameConfigs[0];