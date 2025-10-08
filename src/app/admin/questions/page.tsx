'use client';

import { useState, useEffect } from 'react';
import { level1Questions, level2Questions, level3Questions, shuffleArray } from '@/lib/data';
import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, CheckCircle, X, Plus, KeyRound } from 'lucide-react';

// The initial data is still loaded for the first 3 levels.
const allUnshuffledQuestions = [ 
  ...level1Questions.map(q => ({ ...q, level: 1 })), 
  ...level2Questions.map(q => ({ ...q, level: 2 })), 
  ...level3Questions.map(q => ({ ...q, level: 3 })), 
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function AdminQuestionsPage() {
  // State for password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const CORRECT_PASSWORD = '1234';

  const [questions, setQuestions] = useState(allUnshuffledQuestions);
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  
  const [levels, setLevels] = useState([1, 2, 3]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('A');
  const [newLevel, setNewLevel] = useState(1);

  // Removed the useEffect that checked sessionStorage to ensure password is required every time.

  useEffect(() => {
    const shuffledData = allUnshuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(shuffledData);
  }, []);

  useEffect(() => { 
    if (activeLevel === 'all') { 
      setFilteredQuestions(questions); 
    } else { 
      setFilteredQuestions(questions.filter(q => q.level === activeLevel)); 
    } 
  }, [activeLevel, questions]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      // Removed sessionStorage.setItem to stop remembering the session.
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleDelete = (id: number, level: number) => { 
    setQuestions(prev => prev.filter(q => !(q.id === id && q.level === level))); 
  };
  
  const handleAddNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || Object.values(newOptions).some(opt => !opt.trim())) {
      alert('Please fill out all fields.');
      return;
    }
    
    const newQuestion = {
      id: Math.floor(1000 + Math.random() * 9000),
      level: newLevel,
      question: newQuestionText,
      options: [newOptions.A, newOptions.B, newOptions.C, newOptions.D],
      answer: newOptions[newCorrectAnswer as keyof typeof newOptions],
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
    
    setIsFormVisible(false);
    setNewQuestionText('');
    setNewOptions({ A: '', B: '', C: '', D: '' });
    setNewCorrectAnswer('A');
    setNewLevel(1);
  };
  
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLevel = () => {
    const nextLevel = Math.max(...levels) + 1;
    setLevels(prevLevels => [...prevLevels, nextLevel]);
  };

  // If not authenticated, show the password prompt
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm">
          <form 
            onSubmit={handlePasswordSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center"
          >
            <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <KeyRound className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Protected</h2>
            <p className="text-slate-500 mb-6">Enter the 4-digit password to continue.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={4}
              autoFocus
              className="w-full px-4 py-3 text-center text-2xl tracking-[1em] bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="****"
            />
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If authenticated, show the main questions page
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Question Management</h1>
          <p className="text-slate-500 mt-1">A total of {questions.length} questions in the database.</p>
        </div>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className={`px-4 py-2 font-semibold text-white rounded-lg transition-colors inline-flex items-center gap-2 ${
            isFormVisible ? 'bg-slate-500 hover:bg-slate-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isFormVisible ? <X size={16} /> : <PlusCircle size={16} />}
          <span className="hidden sm:inline">{isFormVisible ? 'Cancel' : 'Add New'}</span>
        </button>
      </div>
      
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: '24px' }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddNewQuestion} className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Add New Question</h2>
              <div className="mb-6">
                <label htmlFor="question" className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
                <textarea id="question" value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} placeholder="Enter the question..." className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 placeholder:text-slate-400" rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div>
                  <label htmlFor="optionA" className="block text-sm font-semibold text-slate-700 mb-2">Option A</label>
                  <input type="text" id="optionA" name="A" value={newOptions.A} onChange={handleOptionChange} placeholder="Option A" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 placeholder:text-slate-400" />
                </div>
                <div>
                  <label htmlFor="optionB" className="block text-sm font-semibold text-slate-700 mb-2">Option B</label>
                  <input type="text" id="optionB" name="B" value={newOptions.B} onChange={handleOptionChange} placeholder="Option B" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 placeholder:text-slate-400" />
                </div>
                <div>
                  <label htmlFor="optionC" className="block text-sm font-semibold text-slate-700 mb-2">Option C</label>
                  <input type="text" id="optionC" name="C" value={newOptions.C} onChange={handleOptionChange} placeholder="Option C" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 placeholder:text-slate-400" />
                </div>
                <div>
                  <label htmlFor="optionD" className="block text-sm font-semibold text-slate-700 mb-2">Option D</label>
                  <input type="text" id="optionD" name="D" value={newOptions.D} onChange={handleOptionChange} placeholder="Option D" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 placeholder:text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <div>
                    <label htmlFor="correctAnswer" className="block text-sm font-semibold text-slate-700 mb-2">Correct Answer</label>
                    <select id="correctAnswer" value={newCorrectAnswer} onChange={(e) => setNewCorrectAnswer(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white text-slate-900">
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="level" className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                    <select id="level" value={newLevel} onChange={(e) => setNewLevel(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white text-slate-900">
                      {levels.map(level => (
                        <option key={level} value={level}>Level {level}</option>
                      ))}
                    </select>
                  </div>
              </div>
              <div className="flex justify-end">
                  <button type="submit" className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Add Question</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-slate-600 mr-2">Filter by level:</span>
        <button
            onClick={() => setActiveLevel('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              activeLevel === 'all' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Levels
        </button>
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              activeLevel === level ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {`Level ${level}`}
          </button>
        ))}
        <button 
          onClick={handleAddLevel}
          title="Add New Level"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-200"
      >
        {filteredQuestions.map((q) => (
          <motion.li variants={itemVariants} key={`${q.level}-${q.id}`} className="p-5 hover:bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="text-xs font-semibold text-indigo-500 mb-1">LEVEL {q.level} - Q{q.id}</p>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{q.question}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                  {q.options.map((option, idx) => (
                     <p key={idx} className={`flex items-center ${option === q.answer ? 'text-green-600 font-bold' : ''}`}>
                       {option === q.answer ? (<CheckCircle size={16} className="mr-2 flex-shrink-0" />) : (<span className="block w-4 mr-2 flex-shrink-0"></span>)}
                       <span className="mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>{option}
                     </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 ml-4 mt-1">
                <button
                  onClick={() => handleDelete(q.id, q.level)}
                  aria-label="Delete question"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
         {filteredQuestions.length === 0 && (
          <li className="p-8 text-center text-slate-500">
            No questions found for this level.
          </li>
        )}
      </motion.ul>
    </div>
  );
}