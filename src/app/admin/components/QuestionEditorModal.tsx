'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save, Eye, CheckCircle, Upload, Lightbulb, Users, Zap, Trash2, UploadCloud } from 'lucide-react'; 
// --- 1. IMPORT THE UPDATED Question and Lifeline TYPES ---
import type { Question, Lifeline } from '@/lib/types';

// Lifeline Item Component
const QuestionLifelineItem = ({ icon: Icon, label, checked, onChange, disabled = false }: {
  icon: React.ElementType;
  label: keyof Lifeline; // Use keyof Lifeline for type safety
  checked: boolean;
  onChange: (label: keyof Lifeline, isChecked: boolean) => void;
  disabled?: boolean;
}) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors 
    ${disabled ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-300 hover:border-indigo-500'}`}>
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${disabled ? 'text-slate-400' : 'text-indigo-600'}`} />
      <label htmlFor={label} className={`${disabled ? 'text-slate-400' : 'text-slate-800'} font-medium cursor-pointer`}>{label}</label>
    </div>
    <input
      id={label}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(label, e.target.checked)}
      disabled={disabled}
      className={`h-5 w-5 rounded ${disabled ? 'text-slate-300' : 'text-indigo-600 focus:ring-indigo-500'} border-slate-300`}
    />
  </div>
);

// --- Main Modal Component ---
export const QuestionEditorModal = ({ question, onSave, onClose }: { question: Question, onSave: (question: Question) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState<Question>(question);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFormData(question); }, [question]);

  // Media Handling Logic
  const handleMediaUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, mediaUrl: objectUrl }));
    }
  };

  const handleRemoveMedia = () => {
    if (formData.mediaUrl && formData.mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.mediaUrl);
    }
    setFormData(prev => ({ ...prev, mediaUrl: null }));
  };
  
  const handleBulkImport = () => alert('Bulk import functionality is not yet implemented.');

  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'level' ? Number(value) : value }));
  };

  // --- 2. FIXED: Tags are now handled and stored as an array ---
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean); // split, trim, and remove empty strings
    setFormData(prev => ({ ...prev, tags }));
  };
  
  // --- 3. FIXED: Lifelines are now handled and stored in state ---
  const handleLifelineChange = (label: keyof Lifeline, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      lifelines: {
        ...prev.lifelines,
        [label]: isChecked,
      }
    }));
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleAnswerChange = (option: string) => {
    setFormData(prev => ({ ...prev, answer: option }));
  };
  
  // --- 4. FIXED: The status is now set on the question object before saving ---
  const handleSubmit = (e: React.FormEvent, status: 'Draft' | 'Published' = 'Draft') => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || !formData.answer) {
      alert("Please fill out the question, all four options, and select a correct answer.");
      return;
    }
    
    if (status === 'Published' && !window.confirm("Are you sure you want to publish this question?")) {
        return;
    }

    onSave({ ...formData, status });
  };

  return (
    <>
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-800 rounded-xl w-full max-w-lg text-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-center text-lg font-medium text-indigo-300 mb-4">Player Preview</h3>
              <p className="text-2xl font-bold text-center mb-8">{formData.question || 'Your question...'}</p>
              <div className="grid grid-cols-2 gap-4">
                {formData.options.map((opt, index) => (
                  <div key={index} className={`flex items-center gap-3 p-4 rounded-lg border-2 ${formData.answer === opt ? 'border-green-500 bg-green-500/20' : 'border-slate-600 bg-slate-700'}`}>
                    <span className="font-bold text-indigo-400">{String.fromCharCode(65 + index)}:</span>
                    <span>{opt || `Option ${String.fromCharCode(65 + index)}`}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} 
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" 
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-900">{question.id ? 'Edit Question' : 'Create New Question'}</h2>
            <button type="button" onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><X /></button>
          </div>
          
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 overflow-hidden">
            <form onSubmit={(e) => handleSubmit(e, 'Draft')} className="md:col-span-2 p-6 space-y-6 overflow-y-auto">
              <div>
                <label htmlFor="question" className="text-sm font-medium text-slate-800 mb-2 block">Question</label>
                <textarea id="question" name="question" value={formData.question} onChange={handleFormChange} placeholder="Type your question here..." className="w-full h-28 p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-800 mb-2 block">Media (Image/Video/Audio)</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />

                {formData.mediaUrl ? (
                  <div className="relative group w-full h-48 rounded-lg overflow-hidden border">
                    <img src={formData.mediaUrl} alt="Media preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={handleRemoveMedia} className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={handleMediaUploadClick} className="flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 hover:border-indigo-500 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-600">
                        Drag & drop or <span className="font-semibold text-indigo-600">click to upload</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800 mb-2 block">Options & Correct Answer</label>
                <div className="space-y-3">
                  {formData.options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input type="radio" name="correct-option" checked={formData.answer === opt} onChange={() => handleAnswerChange(opt)} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500" />
                      <input type="text" value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="md:col-span-1 bg-slate-50 border-l p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"><Save className="h-4 w-4"/> Save as Draft</button>
                  <button type="button" onClick={() => setIsPreviewOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"><Eye className="h-4 w-4"/> Preview</button>
                  <button type="button" onClick={handleBulkImport} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                    <UploadCloud className="h-4 w-4"/> Import Bulk
                  </button>
                  <button type="button" onClick={(e) => handleSubmit(e, 'Published')} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"><CheckCircle className="h-4 w-4"/> Publish</button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="level" className="text-sm font-medium text-slate-800 mb-2 block">Difficulty</label>
                    <input type="number" id="level" name="level" value={formData.level} onChange={handleFormChange} className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-slate-900" min="1"/>
                  </div>
                  <div>
                    <label htmlFor="tags" className="text-sm font-medium text-slate-800 mb-2 block">Category Tag(s)</label>
                    <input 
                      type="text" 
                      id="tags" 
                      name="tags"
                      value={formData.tags.join(', ')} // Display array as comma-separated string
                      onChange={handleTagsChange}
                      placeholder="e.g. Science, 90s" 
                      className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Available Lifelines</h3>
                <div className="space-y-3 text-sm">
                  <QuestionLifelineItem icon={Zap} label="50:50" checked={formData.lifelines['50:50']} onChange={handleLifelineChange} />
                  <QuestionLifelineItem icon={Users} label="Audience Poll" checked={formData.lifelines['Audience Poll']} onChange={handleLifelineChange} />
                  <QuestionLifelineItem icon={Lightbulb} label="Expert Advice" checked={formData.lifelines['Expert Advice']} onChange={handleLifelineChange} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};