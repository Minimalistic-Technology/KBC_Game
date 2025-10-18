// lib/data.ts

import { Question, QuestionBank, Question1 } from './types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const level1Questions: Question1[] = [
  { id: 1, question: 'Who was India\'s first female Prime Minister?', options: ['Indira Gandhi', 'Sarojini Naidu', 'Pratibha Patil', 'Sonia Gandhi'], answer: 'Indira Gandhi' },
  { id: 2, question: 'Which city is known as the “Manchester of India” due to its textile industry?', options: ['Ahmedabad', 'Mumbai', 'Coimbatore', 'Surat'], answer: 'Ahmedabad' },
  { id: 3, question: 'Which ancient university in India was one of the oldest in the world?', options: ['Nalanda University', 'Takshashila University', 'Vikramshila University', 'University of Calcutta'], answer: 'Nalanda University' },
  { id: 4, question: 'Which Indian city is called the “City of Joy”?', options: ['Kolkata', 'Delhi', 'Chennai', 'Bangalore'], answer: 'Kolkata' },
  { id: 5, question: 'Who is the author of “Discovery of India”?', options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Rabindranath Tagore', 'Sardar Patel'], answer: 'Jawaharlal Nehru' },
  { id: 6, question: 'Which dance form originated in Tamil Nadu?', options: ['Bharatanatyam', 'Kathak', 'Kuchipudi', 'Odissi'], answer: 'Bharatanatyam' },
  { id: 7, question: 'Which Indian scientist won the Nobel Prize in Physics in 1930?', options: ['C.V. Raman', 'Homi J. Bhabha', 'Jagadish Chandra Bose', 'S. Chandrasekhar'], answer: 'C.V. Raman' },
  { id: 8, question: 'Which Indian state is the largest producer of tea?', options: ['Assam', 'West Bengal', 'Kerala', 'Tamil Nadu'], answer: 'Assam' },
  { id: 9, question: 'Who is considered the main architect of the “Green Revolution” in India?', options: ['M.S. Swaminathan', 'Indira Gandhi', 'Verghese Kurien', 'Jawaharlal Nehru'], answer: 'M.S. Swaminathan' },
  { id: 10, question: 'Which city is home to Bollywood?', options: ['Mumbai', 'Delhi', 'Chennai', 'Kolkata'], answer: 'Mumbai' },
];

export const level2Questions: Question1[] = [
    { id: 1, question: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], answer: 'Canberra' },
    { id: 2, question: 'Who painted the Mona Lisa?', options: ['Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso', 'Michelangelo'], answer: 'Leonardo da Vinci' },
    { id: 3, question: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Gd', 'Go'], answer: 'Au' },
    { id: 4, question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Jupiter', 'Venus', 'Saturn'], answer: 'Mars' },
    { id: 5, question: 'In which year did the Titanic sink?', options: ['1912', '1905', '1898', '1920'], answer: '1912' },
    { id: 6, question: 'Who wrote \'Romeo and Juliet\'?', options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'], answer: 'William Shakespeare' },
    { id: 7, question: 'What is the largest ocean on Earth?', options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean' },
    { id: 8, question: 'What is the currency of Japan?', options: ['Yen', 'Won', 'Yuan', 'Ringgit'], answer: 'Yen' },
    { id: 9, question: 'Which country is famous for its pyramids?', options: ['Egypt', 'Mexico', 'Peru', 'Sudan'], answer: 'Egypt' },
    { id: 10, question: 'Who was the first person to walk on the moon?', options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'], answer: 'Neil Armstrong' },
    { id: 11, question: 'What is the hardest natural substance on Earth?', options: ['Diamond', 'Quartz', 'Graphene', 'Tungsten'], answer: 'Diamond' },
    { id: 12, question: 'How many continents are there?', options: ['7', '5', '6', '8'], answer: '7' },
    { id: 13, question: 'Which element is most abundant in the Earth\'s atmosphere?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Argon'], answer: 'Nitrogen' },
    { id: 14, question: 'Who invented the telephone?', options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Guglielmo Marconi'], answer: 'Alexander Graham Bell' },
    { id: 15, question: 'What is the main ingredient in guacamole?', options: ['Avocado', 'Tomato', 'Onion', 'Lime'], answer: 'Avocado' },
    { id: 16, question: 'What is the name of the galaxy we live in?', options: ['Milky Way', 'Andromeda', 'Triangulum', 'Whirlpool'], answer: 'Milky Way' },
    { id: 17, question: 'How many bones are in the adult human body?', options: ['206', '201', '212', '198'], answer: '206' },
    { id: 18, question: 'Which country is known as the Land of the Rising Sun?', options: ['Japan', 'China', 'South Korea', 'Thailand'], answer: 'Japan' },
    { id: 19, question: 'What is the smallest country in the world?', options: ['Vatican City', 'Monaco', 'Nauru', 'San Marino'], answer: 'Vatican City' },
    { id: 20, question: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Marie Curie', 'Louis Pasteur', 'Robert Koch'], answer: 'Alexander Fleming' },
];

export const level3Questions: Question1[] = [
    { id: 1, question: 'In what year did the French Revolution begin?', options: ['1789', '1776', '1812', '1799'], answer: '1789' },
    { id: 2, question: 'What is the approximate speed of light in a vacuum?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s' },
    { id: 3, question: 'Who wrote \'One Hundred Years of Solitude\'?', options: ['Gabriel García Márquez', 'Jorge Luis Borges', 'Isabel Allende', 'Mario Vargas Llosa'], answer: 'Gabriel García Márquez' },
    { id: 4, question: 'What is the most spoken language by number of native speakers?', options: ['Mandarin Chinese', 'Spanish', 'English', 'Hindi'], answer: 'Mandarin Chinese' },
    { id: 5, question: 'The \'Ring of Fire\' is a string of volcanoes in which ocean?', options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean' },
    { id: 6, question: 'What does \'CPU\' stand for in computing?', options: ['Central Processing Unit', 'Central Program Unit', 'Computer Personal Unit', 'Control Processing Unit'], answer: 'Central Processing Unit' },
    { id: 7, question: 'Who developed the theory of general relativity?', options: ['Albert Einstein', 'Isaac Newton', 'Stephen Hawking', 'Galileo Galilei'], answer: 'Albert Einstein' },
    { id: 8, question: 'What is the capital of Brazil?', options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], answer: 'Brasília' },
    { id: 9, question: 'Which artist is known for co-founding the Cubist movement?', options: ['Pablo Picasso', 'Salvador Dalí', 'Claude Monet', 'Henri Matisse'], answer: 'Pablo Picasso' },
    { id: 10, question: 'What is considered the \'powerhouse\' of the cell?', options: ['Mitochondrion', 'Nucleus', 'Ribosome', 'Endoplasmic Reticulum'], answer: 'Mitochondrion' },
    { id: 11, question: 'What is the primary gas that makes up the Sun?', options: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], answer: 'Hydrogen' },
    { id: 12, question: 'In Greek mythology, who was the king of the gods?', options: ['Zeus', 'Poseidon', 'Hades', 'Apollo'], answer: 'Zeus' },
    { id: 13, question: 'What is the longest river in the world?', options: ['The Nile', 'The Amazon', 'The Yangtze', 'The Mississippi'], answer: 'The Nile' },
    { id: 14, question: 'Which philosopher is famous for the quote "I think, therefore I am"?', options: ['René Descartes', 'Socrates', 'Plato', 'Aristotle'], answer: 'René Descartes' },
    { id: 15, question: 'What is \'cynophobia\'?', options: ['Fear of dogs', 'Fear of spiders', 'Fear of heights', 'Fear of cats'], answer: 'Fear of dogs' },
    { id: 16, question: 'In which country was the game of chess believed to have originated?', options: ['India', 'China', 'Persia', 'Egypt'], answer: 'India' },
    { id: 17, question: 'What is the main component of the Earth\'s core?', options: ['Iron', 'Nickel', 'Gold', 'Lead'], answer: 'Iron' },
    { id: 18, question: 'Who was the first woman to win a Nobel Prize?', options: ['Marie Curie', 'Rosalind Franklin', 'Ada Lovelace', 'Jane Goodall'], answer: 'Marie Curie' },
    { id: 19, question: 'What is the term for a word that is spelled the same forwards and backwards?', options: ['Palindrome', 'Anagram', 'Onomatopoeia', 'Antonym'], answer: 'Palindrome' },
    { id: 20, question: 'Which element has the atomic number 1?', options: ['Hydrogen', 'Helium', 'Oxygen', 'Lithium'], answer: 'Hydrogen' },
    { id: 21, question: 'Who composed the famous classical music piece \'The Four Seasons\'?', options: ['Antonio Vivaldi', 'Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Johann Sebastian Bach'], answer: 'Antonio Vivaldi' },
    { id: 22, question: 'The ancient city of Petra is located in which modern-day country?', options: ['Jordan', 'Egypt', 'Syria', 'Israel'], answer: 'Jordan' },
    { id: 23, question: 'What is the study of earthquakes called?', options: ['Seismology', 'Geology', 'Meteorology', 'Volcanology'], answer: 'Seismology' },
    { id: 24, question: 'Which Roman emperor was famously succeeded by his son Commodus?', options: ['Marcus Aurelius', 'Julius Caesar', 'Augustus', 'Nero'], answer: 'Marcus Aurelius' },
    { id: 25, question: 'What is the largest desert in the world (including polar deserts)?', options: ['Antarctic Polar Desert', 'Sahara Desert', 'Arctic Polar Desert', 'Gobi Desert'], answer: 'Antarctic Polar Desert' },
    { id: 26, question: 'What does the \'E\' in E=mc² stand for?', options: ['Energy', 'Electricity', 'Element', 'Equation'], answer: 'Energy' },
    { id: 27, question: 'Who is the author of \'The Art of War\'?', options: ['Sun Tzu', 'Confucius', 'Laozi', 'Zhuge Liang'], answer: 'Sun Tzu' },
    { id: 28, question: 'What is the boiling point of water at sea level in Celsius?', options: ['100°C', '90°C', '110°C', '120°C'], answer: '100°C' },
    { id: 29, question: 'Which two countries share the longest international border?', options: ['Canada and USA', 'Russia and China', 'Chile and Argentina', 'India and Bangladesh'], answer: 'Canada and USA' },
    { id: 30, question: 'In computing, what does \'URL\' stand for?', options: ['Uniform Resource Locator', 'Universal Record Link', 'Uniform Record Locator', 'Universal Resource Link'], answer: 'Uniform Resource Locator' },
];

// --- MOCK BANK DATA ---
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
    prize: '5,000',
    onlySafePoints: false, // --- ADDED THIS LINE ---
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
    status: 'Draft',
    tags: ['Science', 'Tech'],
    ageGroup: 'Teens (13-17)',
    questionCount: 9,
    prize: '10,000',
    onlySafePoints: true, // --- ADDED THIS LINE ---
    defaultTimer: 45,
    scheduledFor: null,
    prizeLadder: [
      { id: 1, level: 1, amount: 5000, isSafe: false },
      { id: 2, level: 2, amount: 10000, isSafe: true },
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
    prize: 'Movie Night Gift Basket',
    onlySafePoints: false, // --- ADDED THIS LINE ---
    prizeMedia: { 
        id: 'prize_media_3', 
        url: 'https://picsum.photos/seed/movies/400/225', 
        type: 'image', 
        fileName: 'movie_prize.jpg', 
        derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }] 
    },
    defaultTimer: 30,
    scheduledFor: null,
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
    prize: 'A Giant Teddy Bear',
    onlySafePoints: true, // --- ADDED THIS LINE ---
    prizeMedia: { 
        id: 'prize_media_4', 
        url: 'https://picsum.photos/seed/cartoons/400/225', 
        type: 'image', 
        fileName: 'cartoon_prize.jpg', 
        derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }] 
    },
    defaultTimer: 20,
    scheduledFor: null,
    prizeLadder: [],
  },
];

// --- MOCK QUESTION DATA FOR ADMIN PAGE ---
export const allQuestions: Question[] = [
  // Bank 1: General Knowledge
  {
    id: 101, level: 1, bankId: 'q1', question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    answer: 'Paris', status: 'Published', tags: ['Geography'],
    lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false },
    media: {
      id: 'media_4',
      url: 'https://picsum.photos/seed/architecture/1200/800',
      type: 'image',
      fileName: 'cityscape.jpg',
      derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }, { name: 'Medium', resolution: '600x400' }],
    }
  },
  { id: 102, level: 1, bankId: 'q1', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars', status: 'Published', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 103, level: 1, bankId: 'q1', question: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'F. Scott Fitzgerald'], answer: 'Harper Lee', status: 'Published', tags: ['Literature'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 201, level: 2, bankId: 'q1', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific', status: 'Published', tags: ['Geography'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 202, level: 2, bankId: 'q1', question: 'In what year did the Titanic sink?', options: ['1905', '1912', '1918', '1923'], answer: '1912', status: 'Published', tags: ['History'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 203, level: 2, bankId: 'q1', question: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Pb', 'Fe'], answer: 'Au', status: 'Published', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 301, level: 3, bankId: 'q1', question: 'Who was the first person to step on the moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], answer: 'Neil Armstrong', status: 'Published', tags: ['History'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': true } },
  { id: 302, level: 3, bankId: 'q1', question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 'Diamond', status: 'Published', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': true } },
  { id: 303, level: 3, bankId: 'q1', question: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'South Korea'], answer: 'Japan', status: 'Published', tags: ['Geography'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': true } },

  // Bank 2: Science & Tech
  { id: 104, level: 1, bankId: 'q2', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Unit', 'Control Process Unit'], answer: 'Central Processing Unit', status: 'Draft', tags: ['Tech'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 105, level: 1, bankId: 'q2', question: 'What is the chemical formula for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], answer: 'H2O', status: 'Draft', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 106, level: 1, bankId: 'q2', question: 'Which force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], answer: 'Gravity', status: 'Draft', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 204, level: 2, bankId: 'q2', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'], answer: 'Mitochondrion', status: 'Draft', tags: ['Biology'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 205, level: 2, bankId: 'q2', question: 'What does "www" stand for in a website browser?', options: ['World Wide Web', 'Web World Wide', 'World Web Wide', 'Wide World Web'], answer: 'World Wide Web', status: 'Draft', tags: ['Tech'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 206, level: 2, bankId: 'q2', question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8', status: 'Draft', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 304, level: 3, bankId: 'q2', question: 'Who is credited with inventing the telephone?', options: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], answer: 'Alexander Graham Bell', status: 'Draft', tags: ['History', 'Tech'], lifelines: { '50:50': true, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': true } },
  { id: 305, level: 3, bankId: 'q2', question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s', status: 'Draft', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': true } },
  { id: 306, level: 3, bankId: 'q2', question: 'What is the main component of the sun?', options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon'], answer: 'Hydrogen', status: 'Draft', tags: ['Science'], lifelines: { '50:50': true, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': true } },

  // Bank 3: Movie Buffs
  { id: 401, level: 1, bankId: 'q3', question: 'In "The Matrix", does Neo take the blue pill or the red pill?', options: ['Blue', 'Red', 'He takes both', 'He takes neither'], answer: 'Red', status: 'Published', tags: ['90s', 'Sci-Fi'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 402, level: 1, bankId: 'q3', question: 'Which movie features the quote "I\'ll be back"?', options: ['The Terminator', 'Die Hard', 'RoboCop', 'Predator'], answer: 'The Terminator', status: 'Published', tags: ['80s', 'Action'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': false } },
  { id: 403, level: 2, bankId: 'q3', question: 'Who directed the movie "Pulp Fiction"?', options: ['Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino', 'James Cameron'], answer: 'Quentin Tarantino', status: 'Published', tags: ['90s', 'Indie'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 404, level: 3, bankId: 'q3', question: 'Which film won the first-ever Academy Award for Best Picture?', options: ['The Artist', 'Sunrise', 'Metropolis', 'Wings'], answer: 'Wings', status: 'Published', tags: ['History', 'Awards'], lifelines: { '50:50': true, 'Audience Poll': false, 'Expert Advice': false, 'Flip Question': true } },
  
  // Bank 4: Cartoon Capers
  { id: 501, level: 1, bankId: 'q4', question: 'What is the name of Mickey Mouse\'s dog?', options: ['Goofy', 'Pluto', 'Donald', 'Max'], answer: 'Pluto', status: 'Draft', tags: ['Disney'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': false } },
  { id: 502, level: 1, bankId: 'q4', question: 'In "The Flintstones", what is the name of the family\'s pet dinosaur?', options: ['Dino', 'Rex', 'Spot', 'Bamm-Bamm'], answer: 'Dino', status: 'Draft', tags: ['Classic'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': false } },
  { id: 503, level: 2, bankId: 'q4', question: 'Which character lives in a pineapple under the sea?', options: ['Patrick Star', 'Squidward Tentacles', 'SpongeBob SquarePants', 'Mr. Krabs'], answer: 'SpongeBob SquarePants', status: 'Draft', tags: ['Nickelodeon'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
  { id: 504, level: 2, bankId: 'q4', question: 'What color are the Smurfs?', options: ['Green', 'Yellow', 'Blue', 'Red'], answer: 'Blue', status: 'Draft', tags: ['80s'], lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': true, 'Flip Question': true } },
];