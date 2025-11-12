'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, FileQuestion } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QuestionListItem } from './QuestionListItem';
import { QuestionDetailSidebar } from './QuestionDetailSidebar';
import { QuestionEditorModal } from './QuestionEditorModal';
import type { Question, QuestionBank } from '@/lib/types';
import { BulkExcelUpload } from './BulkExcelUpload';

export default function QuestionsPageClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [activeBank, setActiveBank] = useState<QuestionBank | null>(null);
const [initialLang, setInitialLang] = useState<any | null>(null);
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

  // --- Fetch Questions (new schema aware) ---
  const fetchQuestions = async (bankId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions`, {
        params: { bankId },
        withCredentials: true
      });

      const pickLangBlock = (q: any) => {
        // New shape
        const lang = q?.lang || {};
        const block = lang.en || lang.hi || lang.gu;
        if (block && (block.text || block.options)) return block;

        // Legacy shape fallback
        if (q?.text || q?.options) {
          return {
            text: q.text,
            options: q.options,
            categories: q.categories || []
          };
        }
        return null;
      };

      const frontendQuestions: Question[] = res.data.map((q: any) => {
        const block = pickLangBlock(q) || { text: '', options: [], categories: [] };
        const opts = Array.isArray(block.options)
          ? block.options.map((o: any) => (typeof o === 'string' ? o : o?.text ?? ''))
          : ['', '', '', ''];

        return {
          _id: q._id,
          bankId: q.bankId,
          question: block.text || '',
          options: opts,
          answer: opts[q.correctIndex] ?? '',
          status: q.status === 'published' ? 'Published' : 'Draft',
          categories: block.categories || [],
          mediaRef: q.mediaRef
            ? {
                public_id: q.mediaRef.public_id,
                url: q.mediaRef.url,
                type: q.mediaRef.type,
                format: q.mediaRef.format
              }
            : undefined,

            lang: q.lang || {},
        };
      });

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
 const handleOpenEditor = async (q: Question | null) => {
  if (q?._id) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions/byId/${q._id}`,
        { withCredentials: true }
      );
      setInitialLang(res.data?.lang || null);   // <-- pass full langs
    } catch (e) {
      console.error("Failed to fetch full question (langs)", e);
      setInitialLang(null);
    }
    setEditingQuestion(q);
  } else if (activeBank) {
    setInitialLang(null);
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

  // --- Save (new schema: send lang JSON) ---
 const handleSaveQuestion = async (
  savedQuestion: Question,
  file?: File | null,
  langPayload?: any              // <-- accept from modal
) => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append("bankId", savedQuestion.bankId);
    formDataToSend.append("status", (savedQuestion.status || "Draft").toLowerCase());

    // ✅ use langPayload from modal (contains en and optional hi/gu)
    formDataToSend.append("lang", JSON.stringify(
      langPayload ?? {
        en: {
          text: savedQuestion.question,
          options: (savedQuestion.options || []).slice(0, 4).map(t => ({ text: t || "" })),
          categories: savedQuestion.categories || []
        }
      }
    ));

    const correctIndex = Math.max(
      0,
      (savedQuestion.options || []).findIndex(t => t === savedQuestion.answer)
    );
    formDataToSend.append("correctIndex", String(correctIndex));

    if (file) formDataToSend.append("file", file);

    const url = savedQuestion._id
      ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions/${savedQuestion._id}`
      : `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/questions`;
    const method = savedQuestion._id ? "put" : "post";

    await axios({
      method,
      url,
      data: formDataToSend,
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
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
  {isEditorOpen ? (
    editingQuestion ? (
      <QuestionEditorModal
        question={editingQuestion}     // now narrowed to Question
        onSave={handleSaveQuestion}
        onClose={handleCloseEditor}
        initialLang={initialLang}
      />
    ) : null
  ) : null}
</AnimatePresence>

      <div className="flex flex-col gap-8 h-full">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {activeBank?.name || 'Questions'}
            </h1>
            <p className="text-slate-700 mt-1">
              {activeBank
                ? 'Manage all questions for this bank.'
                : 'Select a bank to view its questions.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeBank && (
              <>
                <BulkExcelUpload
                  bankId={activeBank._id as string}
                  onUploaded={() => bankId && fetchQuestions(bankId)}
                />
                <button
                  onClick={() => handleOpenEditor(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add New Question
                </button>
              </>
            )}
          </div>
        </div>

        {activeBank ? (
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            {/* Sidebar with questions */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-slate-900">
                  All Questions ({questions.length})
                </h3>
              </div>
              {questions.length > 0 ? (
                <ul className="divide-y divide-slate-200 overflow-y-auto">
                  {questions.map((q) => (
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
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    No Questions Found
                  </h3>
                  <p className="mt-1 text-slate-600">
                    This question bank is empty. Add a new question to get started.
                  </p>
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
            <p className="mt-1 text-slate-600">
              Please select a Question Bank to begin.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
