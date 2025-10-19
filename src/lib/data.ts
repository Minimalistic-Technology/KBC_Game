// lib/data.ts

import { Question, QuestionBank } from './types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const initialBanks: QuestionBank[] = [
  {
    id: 'q1',
    title: 'General Knowledge Kickstart',
    slug: 'general-knowledge-kickstart',
    description: 'Easy to medium questions to warm up.',
    status: 'Published',
    tags: ['GK', 'Beginner'],
    ageGroup: 'All Ages',
    questionCount: 9,
    defaultTimer: 30,
    prizeLadder: [
      { id: 1, level: 1, type: 'money', value: 1000, isSafe: false },
      { id: 2, level: 2, type: 'money', value: 2000, isSafe: false },
      { id: 3, level: 3, type: 'money', value: 5000, isSafe: true },
    ],
  },
  {
    id: 'q2',
    title: 'Science & Technology',
    slug: 'science-and-technology',
    description: 'Challenging questions about the world of science.',
    status: 'Draft',
    tags: ['Science', 'Tech'],
    ageGroup: 'Teens (13-17)',
    questionCount: 9,
    defaultTimer: 45,
    prizeLadder: [
      { id: 1, level: 1, type: 'money', value: 5000, isSafe: false },
      { id: 2, level: 2, type: 'gift', value: 'Smartwatch', isSafe: true, media: { id: 'media_sw', url: 'https://picsum.photos/seed/smartwatch/100/100', type: 'image', fileName: 'smartwatch.jpg', derivedFormats: [] } },
    ],
  },
  {
    id: 'q3',
    title: 'Movie Buffs Trivia',
    slug: 'movie-buffs-trivia',
    description: 'Questions for film lovers, from classics to blockbusters.',
    status: 'Published',
    tags: ['Movies', 'Entertainment'],
    ageGroup: 'Adults (18+)',
    questionCount: 4,
    defaultTimer: 30,
    prizeLadder: [],
  },
  {
    id: 'q4',
    title: 'Cartoon Capers',
    slug: 'cartoon-capers',
    description: 'Fun questions about animated shows and movies.',
    status: 'Draft',
    tags: ['Cartoons', 'Kids'],
    ageGroup: 'Kids (6-12)',
    questionCount: 4,
    defaultTimer: 20,
    prizeLadder: [],
  },
];

export const allQuestions: Question[] = [
  // Question Bank 1: General Knowledge
  {
    id: 101, bankId: 'q1', question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    answer: 'Paris', status: 'Published', tags: ['Geography'],
    media: {
      id: 'media_4',
      url: 'https://picsum.photos/seed/architecture/1200/800',
      type: 'image',
      fileName: 'cityscape.jpg',
      derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }, { name: 'Medium', resolution: '600x400' }],
    }
  },
  { id: 102, bankId: 'q1', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars', status: 'Published', tags: ['Science'] },
  { id: 103, bankId: 'q1', question: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'F. Scott Fitzgerald'], answer: 'Harper Lee', status: 'Published', tags: ['Literature'] },
  { id: 201, bankId: 'q1', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific', status: 'Published', tags: ['Geography'] },
  { id: 202, bankId: 'q1', question: 'In what year did the Titanic sink?', options: ['1905', '1912', '1918', '1923'], answer: '1912', status: 'Published', tags: ['History'] },
  { id: 203, bankId: 'q1', question: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Pb', 'Fe'], answer: 'Au', status: 'Published', tags: ['Science'] },
  { id: 301, bankId: 'q1', question: 'Who was the first person to step on the moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], answer: 'Neil Armstrong', status: 'Published', tags: ['History'] },
  { id: 302, bankId: 'q1', question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 'Diamond', status: 'Published', tags: ['Science'] },
  { id: 303, bankId: 'q1', question: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'South Korea'], answer: 'Japan', status: 'Published', tags: ['Geography'] },

  // Question Bank 2: Science & Tech
  { id: 104, bankId: 'q2', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Unit', 'Control Process Unit'], answer: 'Central Processing Unit', status: 'Draft', tags: ['Tech'] },
  { id: 105, bankId: 'q2', question: 'What is the chemical formula for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], answer: 'H2O', status: 'Draft', tags: ['Science'] },
  { id: 106, bankId: 'q2', question: 'Which force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], answer: 'Gravity', status: 'Draft', tags: ['Science'] },
  { id: 204, bankId: 'q2', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'], answer: 'Mitochondrion', status: 'Draft', tags: ['Biology'] },
  { id: 205, bankId: 'q2', question: 'What does "www" stand for in a website browser?', options: ['World Wide Web', 'Web World Wide', 'World Web Wide', 'Wide World Web'], answer: 'World Wide Web', status: 'Draft', tags: ['Tech'] },
  { id: 206, bankId: 'q2', question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8', status: 'Draft', tags: ['Science'] },
  { id: 304, bankId: 'q2', question: 'Who is credited with inventing the telephone?', options: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], answer: 'Alexander Graham Bell', status: 'Draft', tags: ['History', 'Tech'] },
  { id: 305, bankId: 'q2', question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s', status: 'Draft', tags: ['Science'] },
  { id: 306, bankId: 'q2', question: 'What is the main component of the sun?', options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon'], answer: 'Hydrogen', status: 'Draft', tags: ['Science'] },

  // Question Bank 3: Movie Buffs
  { id: 401, bankId: 'q3', question: 'In "The Matrix", does Neo take the blue pill or the red pill?', options: ['Blue', 'Red', 'He takes both', 'He takes neither'], answer: 'Red', status: 'Published', tags: ['90s', 'Sci-Fi'] },
  { id: 402, bankId: 'q3', question: 'Which movie features the quote "I\'ll be back"?', options: ['The Terminator', 'Die Hard', 'RoboCop', 'Predator'], answer: 'The Terminator', status: 'Published', tags: ['80s', 'Action'] },
  { id: 403, bankId: 'q3', question: 'Who directed the movie "Pulp Fiction"?', options: ['Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino', 'James Cameron'], answer: 'Quentin Tarantino', status: 'Published', tags: ['90s', 'Indie'] },
  { id: 404, bankId: 'q3', question: 'Which film won the first-ever Academy Award for Best Picture?', options: ['The Artist', 'Sunrise', 'Metropolis', 'Wings'], answer: 'Wings', status: 'Published', tags: ['History', 'Awards'] },
  
  // Question Bank 4: Cartoon Capers
  { id: 501, bankId: 'q4', question: 'What is the name of Mickey Mouse\'s dog?', options: ['Goofy', 'Pluto', 'Donald', 'Max'], answer: 'Pluto', status: 'Draft', tags: ['Disney'] },
  { id: 502, bankId: 'q4', question: 'In "The Flintstones", what is the name of the family\'s pet dinosaur?', options: ['Dino', 'Rex', 'Spot', 'Bamm-Bamm'], answer: 'Dino', status: 'Draft', tags: ['Classic'] },
  { id: 503, bankId: 'q4', question: 'Which character lives in a pineapple under the sea?', options: ['Patrick Star', 'Squidward Tentacles', 'SpongeBob SquarePants', 'Mr. Krabs'], answer: 'SpongeBob SquarePants', status: 'Draft', tags: ['Nickelodeon'] },
  { id: 504, bankId: 'q4', question: 'What color are the Smurfs?', options: ['Green', 'Yellow', 'Blue', 'Red'], answer: 'Blue', status: 'Draft', tags: ['80s'] },
];