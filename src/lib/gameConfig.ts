import type { PrizeLevel, Lifeline } from './types';

// This is a mock configuration that simulates what an admin would save.
// The lobby page will use this data to display session details.
export const activeGameConfig = {
  // Array of Question Bank IDs selected by the admin (in order)
  selectedBankIds: ['q1','q3','q2','q4'],

  // The prize ladder created by the admin
  prizeLadder: [
    { id: 1, level: 1, type: 'money', value: 1000, isSafe: false },
    { id: 2, level: 2, type: 'money', value: 5000, isSafe: true },
    { id: 3, level: 3, type: 'gift', value: 'Smartwatch', isSafe: false },
    { id: 4, level: 4, type: 'money', value: 25000, isSafe: true },
  ] as PrizeLevel[],

  // The lifelines enabled by the admin
  lifelines: {
    '50:50': true,
    'Audience Poll': true,
    'Expert Advice': false,
    'Flip Question': true,
  } as Lifeline,
};