'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, FileQuestion, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { initialBanks, allQuestions, Question, QuestionBank } from '@/lib/data'; // Adjust path as needed

// Question Detail Sidebar Component
const QuestionDetailSidebar = ({ question, onDelete }: { question: Question | null, onDelete: (id: number) => void }) => {
    if (!question) {
        return (
            <div className="hidden xl:flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <FileQuestion className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800">Select a Question</h3>
                <p className="mt-1 text-sm text-slate-500 text-center">Choose a question from the list to see its details and preview.</p>
            </div>
        );
    }

    return (
        <div className="hidden xl:flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-slate-900">Details</h3>
            </div>
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                <div>
                    <span className="text-sm font-semibold text-slate-500">Question Preview</span>
                    <p className="mt-1 text-slate-800 font-medium">{question.question}</p>
                </div>
                <div>
                    <span className="text-sm font-semibold text-slate-500">Media</span>
                    <div className="mt-2 flex items-center justify-center h-32 rounded-lg bg-slate-100 border border-dashed">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                </div>
                <div>
                    <span className="text-sm font-semibold text-slate-500">Options</span>
                    <ul className="mt-2 space-y-2">
                        {question.options.map((opt, index) => (
                            <li key={index} className={`flex items-center gap-3 text-sm p-2 rounded-md ${question.answer === opt ? 'bg-green-100 text-green-800 font-semibold' : 'text-slate-700'}`}>
                                {question.answer === opt ? <CheckCircle size={16} /> : <div className="w-4 h-4" />}
                                <span>{opt}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex gap-3">
                <Link href="/admin/questions/edit" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    <Edit size={16} /> Edit
                </Link>
                <button onClick={() => onDelete(question.id)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border h-10 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-200">
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
    );
};


//Main Page
export default function QuestionsListPage() {
  const [questions, setQuestions] = useState(allQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [activeBank, setActiveBank] = useState<QuestionBank | null | undefined>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  
  useEffect(() => {
    const bankId = searchParams.get('bankId');
    if (bankId) {
      const currentBank = initialBanks.find(b => b.id === bankId);
      setActiveBank(currentBank);
      const filtered = questions.filter(q => q.bankId === bankId);
      setFilteredQuestions(filtered);
      setSelectedQuestionId(filtered[0]?.id || null); 
    } else {
      setActiveBank(null);
      setFilteredQuestions([]);
      setSelectedQuestionId(null);
    }
  }, [searchParams, questions]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const selectedQuestion = filteredQuestions.find(q => q.id === selectedQuestionId) || null;

  if (!activeBank) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800">No Bank Selected</h3>
        <p className="mt-1 text-slate-600">Please select a Question Bank from the sidebar to begin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[calc(100vh-108px)]">
      
      {/*Question List*/}
      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 sm:p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeBank.title}</h1>
            <p className="text-slate-700 mt-1">{filteredQuestions.length} questions in this bank.</p>
          </div>
          <Link href="/admin/questions/edit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <PlusCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Add New</span>
          </Link>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {filteredQuestions.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {filteredQuestions.map(q => (
                <li key={q.id}>
                  <button 
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`w-full text-left p-6 transition-colors ${selectedQuestionId === q.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`font-semibold ${selectedQuestionId === q.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {q.question || 'Untitled Question'}
                      </p>
                      <span className={`ml-4 flex-shrink-0 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs py-1 px-3 rounded-full ${selectedQuestionId === q.id ? 'bg-indigo-100 border-indigo-200 text-indigo-800' : ''}`}>
                        Level {q.level}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-12">
                <FileQuestion className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800">This Bank is Empty</h3>
                <p className="mt-1 text-slate-600">Add a new question to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/*Details*/}
      <QuestionDetailSidebar question={selectedQuestion} onDelete={handleDelete} />
    </div>
  );
}