'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, FileQuestion } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QuestionListItem } from './QuestionListItem';
import { QuestionDetailSidebar } from './QuestionDetailSidebar';
import { QuestionEditorModal } from './QuestionEditorModal';
import type { Question, QuestionBank, MediaAsset } from '@/lib/types';

export default function QuestionsPageClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [activeBank, setActiveBank] = useState<QuestionBank | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const searchParams = useSearchParams();
  const bankId = searchParams.get('bankId');

  // --- Fetch Question Bank ---
  const fetchBankById = async (bankId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions/banks/${bankId}`, {
        withCredentials: true
      });
      setActiveBank(res.data);
    } catch (err) {
      console.error('Failed to fetch question bank', err);
      setActiveBank(null);
    }
  };

  // --- Fetch Questions ---
  const fetchQuestions = async (bankId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions`, {
        params: { bankId },
        withCredentials: true
      });

      // Convert backend format to frontend Question type
      const frontendQuestions: Question[] = res.data.map((q: any) => ({
        _id: q._id,
        bankId: q.bankId,
        question: q.text,
        options: q.options.map((o: any) => o.text),
        mediaRef : q.mediaRef,
        answer: q.options[q.correctIndex]?.text || '',
        status: q.status === 'draft' ? 'Draft' : 'Published',
        categories: q.categories || [],
      }));

      setQuestions(frontendQuestions);
      setSelectedQuestion(frontendQuestions.length > 0 ? frontendQuestions[0] : null);
    } catch (err) {
      console.error('Failed to fetch questions', err);
      setQuestions([]);
      setSelectedQuestion(null);
    }
  };

  useEffect(() => {
    if (bankId) {
      fetchBankById(bankId);
      fetchQuestions(bankId);
    } else {
      setActiveBank(null);
      setQuestions([]);
      setSelectedQuestion(null);
    }
  }, [bankId]);

  // --- Open Editor ---
  const handleOpenEditor = (question: Question | null) => {
    if (question) {
      setEditingQuestion(question);
    } else if (activeBank) {
      // New question
      setEditingQuestion({
        _id: undefined,
        bankId: activeBank._id || '',
        question: '',
        options: ['', '', '', ''],
        answer: '',
        status: 'Draft',
        categories: [],
      });
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  };

 

  const handleSaveQuestion = async (savedQuestion: Question, file?: File | null) => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("bankId", savedQuestion.bankId);
    formDataToSend.append("text", savedQuestion.question);
    formDataToSend.append("status", savedQuestion.status.toLowerCase());
    formDataToSend.append("categories", JSON.stringify(savedQuestion.categories));
   formDataToSend.append("options", JSON.stringify(savedQuestion.options.map(opt => ({ text: opt })),));
    formDataToSend.append("correctIndex", savedQuestion.options.indexOf(savedQuestion.answer).toString());

    if (file) formDataToSend.append("file", file);

    console.log(file)

    const url = savedQuestion._id
      ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions/${savedQuestion._id}`
      : `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions`;

    const method = savedQuestion._id ? "put" : "post";

    await axios({
      method,
      url,
      data: formDataToSend,
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (bankId) fetchQuestions(bankId);
    handleCloseEditor();
  } catch (err) {
    console.error("Failed to save question", err);
  }
};

  // --- Delete Question ---
  const handleDelete = async (_id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions/${_id}`, {
        withCredentials: true
      });
      if (bankId) fetchQuestions(bankId);
    } catch (err) {
      console.error('Failed to delete question', err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isEditorOpen && editingQuestion && (
          <QuestionEditorModal
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onClose={handleCloseEditor}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 h-full">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{activeBank?.name || 'Questions'}</h1>
            <p className="text-slate-700 mt-1">
              {activeBank ? `Manage all questions for this bank.` : 'Select a bank to view its questions.'}
            </p>
          </div>
          {activeBank && (
            <button
              onClick={() => handleOpenEditor(null)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Question
            </button>
          )}
        </div>

        {activeBank ? (
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            {/* Sidebar with questions */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-slate-900">All Questions ({questions.length})</h3>
              </div>
              {questions.length > 0 ? (
                <ul className="divide-y divide-slate-200 overflow-y-auto">
                  {questions.map(q => (
                    <QuestionListItem
                      key={q._id}
                      question={q}
                      isSelected={selectedQuestion?._id === q._id}
                      onClick={() => setSelectedQuestion(q)}
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

            {/* Details Sidebar */}
            <div className="lg:col-span-2">
              <QuestionDetailSidebar
                question={selectedQuestion}
                onEdit={() => handleOpenEditor(selectedQuestion)}
                onDelete={handleDelete}
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">No Bank Selected</h3>
            <p className="mt-1 text-slate-600">Please select a Question Bank to begin.</p>
          </div>
        )}
      </div>
    </>
  );
}
