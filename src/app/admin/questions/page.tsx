'use client';

import { useState, useEffect } from 'react';
import { level1Questions, level2Questions, level3Questions, shuffleArray } from '@/lib/data';
import { Question } from '@/lib/types';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

// Combine the raw, unshuffled questions
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
  // Initialize state with unshuffled questions
  const [questions, setQuestions] = useState(allUnshuffledQuestions);
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  // Shuffle the questions on the client-side after the component mounts
  useEffect(() => {
    const shuffledData = allUnshuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(shuffledData);
  }, []); // Empty dependency array ensures this runs only once on the client

  useEffect(() => { 
    if (activeLevel === 'all') { 
      setFilteredQuestions(questions); 
    } else { 
      setFilteredQuestions(questions.filter(q => q.level === activeLevel)); 
    } 
  }, [activeLevel, questions]);

  const handleDelete = (id: number, level: number) => { 
    if (window.confirm('Are you sure you want to delete this question?')) { 
      setQuestions(prev => prev.filter(q => !(q.id === id && q.level === level))); 
      alert(`Question with id: ${id} from level: ${level} has been deleted.`); 
    } 
  };

  const levelFilters = ['all', 1, 2, 3] as const;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Question Management</h1>
          <p className="text-slate-500 mt-1">A total of {questions.length} questions in the database.</p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
          <PlusCircle size={16} /> Add New
        </button>
      </div>

      <div className="mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
        <span className="font-semibold text-slate-600 mr-2">Filter by level:</span>
        {levelFilters.map(level => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              activeLevel === level ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {level === 'all' ? 'All Levels' : `Level ${level}`}
          </button>
        ))}
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
      </motion.ul>
    </div>
  );
}