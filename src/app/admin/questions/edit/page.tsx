'use client';

import { useState } from 'react';
import {
  CheckCircle,
  CloudUpload,
  Eye,
  PlusCircle,
  Save,
  ThumbsUp,
  Users,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FormInput = ({ label, id, children, description }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-800 mb-1">{label}</label>
    {children}
    {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
  </div>
);

const IconButton = ({ icon: Icon, children, ...props }: any) => (
  <button {...props} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
    <Icon className="h-4 w-4" />
    <span>{children}</span>
  </button>
);

export default function QuestionEditorPage() {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <>
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-800 rounded-xl w-full max-w-lg text-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-center text-lg font-medium text-indigo-300 mb-4">Player Preview</h3>
              <p className="text-2xl font-bold text-center mb-8">{questionText || 'Your question will appear here...'}</p>
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt, index) => (
                  <div key={index} className={`flex items-center gap-3 p-4 rounded-lg border-2 ${correctOption === index ? 'border-green-500 bg-green-500/20' : 'border-slate-600 bg-slate-700'}`}>
                    <span className="font-bold text-indigo-400">{String.fromCharCode(65 + index)}:</span>
                    <span>{opt || `Option ${String.fromCharCode(65 + index)}`}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Question Editor</h1>
            <p className="text-slate-700 mt-1">Create a new question or edit an existing one.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-50">Import Bulk</button>
            <IconButton icon={PlusCircle}>Create New</IconButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <FormInput label="Question" id="question">
                <div className="mt-2 p-4 border rounded-lg bg-slate-50 text-slate-800 focus-within:ring-2 focus-within:ring-indigo-500">
                  <textarea
                    id="question"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Type your question here... (Supports rich text)"
                    className="w-full h-24 bg-transparent border-none focus:outline-none resize-none"
                  />
                </div>
              </FormInput>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-800 mb-2">Options</h3>
              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct-option"
                      checked={correctOption === index}
                      onChange={() => setCorrectOption(index)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-800 mb-2">Media (Optional)</h3>
              <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10">
                <div className="text-center">
                  <CloudUpload className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600">Drag & drop an image or video, or <span className="font-semibold text-indigo-600">click to upload</span></p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-6">

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Save className="h-4 w-4"/> Save as Draft
                </button>
                <button onClick={() => setIsPreviewOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Eye className="h-4 w-4"/> Preview
                </button>
                <IconButton icon={CheckCircle}>Publish Now</IconButton>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Available Lifelines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-700">50:50</span> <Zap size={16} className="text-yellow-500"/></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-700">Audience Poll</span> <Users size={16} className="text-blue-500"/></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-700">Expert Advice</span> <ThumbsUp size={16} className="text-green-500"/></div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Version History</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-slate-800">Published by Admin</p>
                    <p className="text-xs text-slate-500">Oct 10, 2025, 7:30 PM</p>
                  </div>
                  <button className="text-xs font-semibold text-indigo-600 hover:underline">Revert</button>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-slate-800">Draft created by Admin</p>
                    <p className="text-xs text-slate-500">Oct 09, 2025, 11:15 AM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}