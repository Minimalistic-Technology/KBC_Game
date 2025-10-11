// lib/data.ts

// --- TYPES ---
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
  status: 'published' | 'draft';
  tags: string[];
  questionCount: number;
  defaultTimer: number; // in seconds
  scheduledFor: string | null;
  prizeLadder: PrizeLevel[];
};

export type Question = {
  id: number;
  level: number;
  bankId: string;
  question: string;
  options: string[];
  answer: string;
};

// --- MOCK BANK DATA ---
export const initialBanks: QuestionBank[] = [
  {
    id: 'q1',
    title: 'General Knowledge Kickstart',
    slug: 'general-knowledge-kickstart',
    description: 'Easy to medium questions to warm up.',
    status: 'published',
    tags: ['GK', 'Beginner'],
    questionCount: 9,
    defaultTimer: 30,
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    prizeLadder: [
      { id: 1, level: 1, amount: 1000, isSafe: false },
      { id: 2, level: 2, amount: 2000, isSafe: false },
      { id: 3, level: 3, amount: 5000, isSafe: true },
    ],
  },
  {
    id: 'q2',
    title: 'Science & Technology',
    slug: 'science-and-technology',
    description: 'Challenging questions about the world of science.',
    status: 'draft',
    tags: ['Science', 'Tech'],
    questionCount: 9,
    defaultTimer: 45,
    scheduledFor: null,
    prizeLadder: [
      { id: 1, level: 1, amount: 5000, isSafe: false },
      { id: 2, level: 2, amount: 10000, isSafe: true },
    ],
  },
];

// --- MOCK QUESTION DATA ---
export const allQuestions: Question[] = [ 
  // Questions for Bank 'q1' (General Knowledge)
  { id: 101, level: 1, bankId: 'q1', question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
  { id: 102, level: 1, bankId: 'q1', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars' },
  { id: 103, level: 1, bankId: 'q1', question: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'F. Scott Fitzgerald'], answer: 'Harper Lee' },
  { id: 201, level: 2, bankId: 'q1', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' },
  { id: 202, level: 2, bankId: 'q1', question: 'In what year did the Titanic sink?', options: ['1905', '1912', '1918', '1923'], answer: '1912' },
  { id: 203, level: 2, bankId: 'q1', question: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Pb', 'Fe'], answer: 'Au' },
  { id: 301, level: 3, bankId: 'q1', question: 'Who was the first person to step on the moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], answer: 'Neil Armstrong' },
  { id: 302, level: 3, bankId: 'q1', question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 'Diamond' },
  { id: 303, level: 3, bankId: 'q1', question: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'South Korea'], answer: 'Japan' },
  
  // Questions for Bank 'q2' (Science & Tech)
  { id: 104, level: 1, bankId: 'q2', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Unit', 'Control Process Unit'], answer: 'Central Processing Unit' },
  { id: 105, level: 1, bankId: 'q2', question: 'What is the chemical formula for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], answer: 'H2O' },
  { id: 106, level: 1, bankId: 'q2', question: 'Which force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], answer: 'Gravity' },
  { id: 204, level: 2, bankId: 'q2', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'], answer: 'Mitochondrion' },
  { id: 205, level: 2, bankId: 'q2', question: 'What does "www" stand for in a website browser?', options: ['World Wide Web', 'Web World Wide', 'World Web Wide', 'Wide World Web'], answer: 'World Wide Web' },
  { id: 206, level: 2, bankId: 'q2', question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8' },
  { id: 304, level: 3, bankId: 'q2', question: 'Who is credited with inventing the telephone?', options: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], answer: 'Alexander Graham Bell' },
  { id: 305, level: 3, bankId: 'q2', question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s' },
  { id: 306, level: 3, bankId: 'q2', question: 'What is the main component of the sun?', options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon'], answer: 'Hydrogen' },
];