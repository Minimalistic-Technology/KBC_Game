'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddNewQuestionPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [level, setLevel] = useState(1);
  const router = useRouter();

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    
    const newQuestion = {
      id: Date.now(), // Use a temporary unique ID
      question,
      options: [options.A, options.B, options.C, options.D],
      answer: options[correctAnswer as keyof typeof options],
      level,
    };

    // In a real application, you would send this data to your API/database.
    console.log('New Question Submitted:', newQuestion);
    alert('New question added successfully! (Check the console)');
    router.push('/admin/questions');
  };

  return (
    <div>
       <Link href="/admin/questions" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors">
         <ArrowLeft size={18} />
         Back to Questions List
       </Link>

      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Add New Question</h1>
        
        {/* Question Input */}
        <div className="mb-6">
          <label htmlFor="question" className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            rows={4}
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
          <div>
            <label htmlFor="optionA" className="block text-sm font-semibold text-slate-700 mb-2">Option A</label>
            <input type="text" id="optionA" name="A" value={options.A} onChange={handleOptionChange} placeholder="Option A" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label htmlFor="optionB" className="block text-sm font-semibold text-slate-700 mb-2">Option B</label>
            <input type="text" id="optionB" name="B" value={options.B} onChange={handleOptionChange} placeholder="Option B" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label htmlFor="optionC" className="block text-sm font-semibold text-slate-700 mb-2">Option C</label>
            <input type="text" id="optionC" name="C" value={options.C} onChange={handleOptionChange} placeholder="Option C" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label htmlFor="optionD" className="block text-sm font-semibold text-slate-700 mb-2">Option D</label>
            <input type="text" id="optionD" name="D" value={options.D} onChange={handleOptionChange} placeholder="Option D" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
        </div>

        {/* Correct Answer and Difficulty Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <label htmlFor="correctAnswer" className="block text-sm font-semibold text-slate-700 mb-2">Correct Answer</label>
              <select
                id="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
              </select>
            </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Add Question
            </button>
        </div>
      </form>
    </div>
  );
}