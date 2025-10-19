'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import the Link component
import { useSearchParams } from 'next/navigation';
import { PlusCircle, FileQuestion, UploadCloud } from 'lucide-react'; // Import the UploadCloud icon
import { AnimatePresence } from 'framer-motion';
import { initialBanks, allQuestions } from '@/lib/data';
import type { QuestionBank, Question } from '@/lib/types';

import { QuestionListItem } from './QuestionListItem';
import { QuestionDetailSidebar } from './QuestionDetailSidebar';
import { QuestionEditorModal } from './QuestionEditorModal';

export default function QuestionsPageClient() {
  const [questions, setQuestions] = useState(allQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [activeBank, setActiveBank] = useState<QuestionBank | null | undefined>(null);
  
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const searchParams = useSearchParams();
  
  useEffect(() => {
    const bankId = searchParams.get('bankId');
    if (bankId) {
      const currentBank = initialBanks.find(b => b.id === bankId);
      const filtered = questions.filter(q => q.bankId === bankId);
      
      setActiveBank(currentBank);
      setFilteredQuestions(filtered);

      const newSelected = filtered.find(q => q.id === selectedQuestion?.id) || (filtered.length > 0 ? filtered[0] : null);
      setSelectedQuestion(newSelected);

    } else { 
      setActiveBank(null); 
      setFilteredQuestions([]); 
      setSelectedQuestion(null); 
    }
  }, [searchParams, questions, selectedQuestion?.id]);

  const handleOpenEditor = (question: Question | null) => {
    if (question) {
      setEditingQuestion(question);
    } else {
      setEditingQuestion({ 
        id: Date.now(), 
        bankId: activeBank?.id || '', 
        question: '', 
        options: ['', '', '', ''], 
        answer: '',
        status: 'Draft',
        tags: [],
        lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': false }
      });
    }
    setIsEditorOpen(true);
};
  
  const handleCloseEditor = () => { setIsEditorOpen(false); setEditingQuestion(null); };
  
  const handleSaveQuestion = (savedQuestion: Question) => {
    const exists = questions.some(q => q.id === savedQuestion.id);
    if (exists) {
      setQuestions(questions.map(q => q.id === savedQuestion.id ? savedQuestion : q));
    } else {
      setQuestions([savedQuestion, ...questions]);
    }
    if (selectedQuestion && savedQuestion.id === selectedQuestion.id) {
        setSelectedQuestion(savedQuestion);
    }
    handleCloseEditor();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      if (selectedQuestion?.id === id) {
          const deletedIndex = filteredQuestions.findIndex(q => q.id === id);
          const newSelection = filteredQuestions.length <= 1 ? null : (filteredQuestions[deletedIndex - 1] || filteredQuestions[deletedIndex + 1]);
          setSelectedQuestion(newSelection);
      }
    }
  };
  
  const handleEditFromSidebar = () => {
    if (selectedQuestion) {
        handleOpenEditor(selectedQuestion);
    }
  }

  return (
    <>
      <AnimatePresence>
        {isEditorOpen && editingQuestion && (<QuestionEditorModal question={editingQuestion} onSave={handleSaveQuestion} onClose={handleCloseEditor} />)}
      </AnimatePresence>
      
      <div className="flex flex-col gap-8 h-full">
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{activeBank ? activeBank.title : 'Questions'}</h1>
            <p className="text-slate-700 mt-1">{activeBank ? `Manage all questions for this bank.` : 'Select a bank to view its questions.'}</p>
          </div>
          {/* --- UPDATED: Added a flex container and the Import Bulk button --- */}
          {activeBank && (
            <div className="flex items-center gap-3">
                <Link href="/admin/import" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50">
                    <UploadCloud className="h-5 w-5" />
                    <span>Import Bulk</span>
                </Link>
                <button onClick={() => handleOpenEditor(null)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add New Question</span>
                </button>
            </div>
          )}
        </div>

        {activeBank ? (
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-bold text-slate-900">
                        All Questions ({filteredQuestions.length})
                    </h3>
                </div>
                {filteredQuestions.length > 0 ? (
                    <ul className="divide-y divide-slate-200 overflow-y-auto">
                        {filteredQuestions.map((question) => (
                            <QuestionListItem 
                                key={question.id}
                                question={question}
                                isSelected={selectedQuestion?.id === question.id}
                                onClick={() => setSelectedQuestion(question)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                        <FileQuestion className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">No Questions Found</h3>
                        <p className="mt-1 text-slate-600">This question bank is empty. Add a new question to get started.</p>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                <QuestionDetailSidebar 
                    question={selectedQuestion}
                    onEdit={handleEditFromSidebar}
                    onDelete={handleDelete}
                />
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">No Bank Selected</h3>
            <p className="mt-1 text-slate-600">Please select a Question Bank from the sidebar to begin.</p>
          </div>
        )}
      </div>
    </>
  );
}