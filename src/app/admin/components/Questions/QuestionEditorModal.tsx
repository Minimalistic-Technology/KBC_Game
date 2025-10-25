'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save, Eye, CheckCircle, Library } from 'lucide-react';
import type { Question, MediaAsset, DerivedFormat } from '@/lib/types';
import { MediaUploader } from '../Media/MediaUploader';
import { MediaLibraryModal } from '../Media/MediaLibraryModal';
import { MediaPreview } from '../Media/MediaPreview';

export const QuestionEditorModal = ({
  question,
  onSave,
  onClose
}: {
  question: Question;
 onSave: (question: Question, file?: File | null) => void;
  onClose: () => void;
}) => {
  // Ensure categories is always an array
  const [formData, setFormData] = useState<Question>(question);
  const [tagsInput, setTagsInput] = useState(question.categories.join(', '));

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
const [rawFile, setRawFile] = useState<File | null>(null);

const handleMediaUploadComplete = (asset: MediaAsset, file?: File) => {
  setFormData(prev => ({ ...prev, media: asset }));
  if (file) setRawFile(file);
};

  useEffect(() => {
    setFormData(question);
    setTagsInput(question.categories.join(', '));
  }, [question]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    setFormData(prev => ({
      ...prev,
      categories: value.split(',').map(tag => tag.trim()).filter(Boolean),
    }));
  };

  

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    setFormData(prev => ({ ...prev, media: asset }));
    setIsLibraryOpen(false);
  };

  const handleRemoveMedia = () => {
    setFormData(prev => ({ ...prev, media: undefined }));
  };

  const handleDefaultFormatChange = (format: DerivedFormat) => {
    if (formData.media) {
      setFormData(prev => ({ ...prev, media: { ...prev.media!, defaultFormat: format } }));
    }
  };

  // --- Form handlers ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


const handleOptionChange = (index: number, value: string) => {
  const newOptions = [...formData.options];
  newOptions[index] = value; 
  setFormData(prev => ({ ...prev, options: newOptions }));
};

  const handleAnswerChange = (option: string) => {
    setFormData(prev => ({ ...prev, answer: option }));
  };

const handleSubmit = (e: React.FormEvent, status: 'Draft' | 'Published' = 'Draft') => {
  e.preventDefault();
  if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || !formData.answer) {
    alert("Please fill out the question, all options, and select a correct answer.");
    return;
  }
  if (status === 'Published' && !window.confirm("Are you sure you want to publish this question?")) return;

  // Pass both the data and the file to parent
  onSave({ ...formData, status }, rawFile);
};

  return (
    <>
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-slate-800 rounded-xl w-full max-w-lg text-white p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}>
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

        {isLibraryOpen && (
          <MediaLibraryModal onClose={() => setIsLibraryOpen(false)} onSelect={handleSelectFromLibrary} filter="all" />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}>

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
                {formData.media ? (
                  <MediaPreview asset={formData.media} onRemove={handleRemoveMedia} onDefaultFormatChange={handleDefaultFormatChange} />
                ) : (
                  <div className="space-y-3">
                    <MediaUploader
                      onUploadComplete={handleMediaUploadComplete}
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                        'video/*': ['.mp4', '.mov'],
                        'audio/*': ['.mp3', '.wav']
                      }}
                    />
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-slate-300"></div>
                      <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
                      <div className="flex-grow border-t border-slate-300"></div>
                    </div>
                    <button type="button" onClick={() => setIsLibraryOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-11 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                      <Library className="h-4 w-4" /> Choose from Library
                    </button>
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
                  <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"><Save className="h-4 w-4" /> Save as Draft</button>
                  <button type="button" onClick={() => setIsPreviewOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"><Eye className="h-4 w-4" /> Preview</button>
                  <button type="button" onClick={(e) => handleSubmit(e, 'Published')} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"><CheckCircle className="h-4 w-4" /> Publish</button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tags" className="text-sm font-medium text-slate-800 mb-2 block">Category Tag(s)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={tagsInput}
                      onChange={handleTagsChange}
                      placeholder="e.g. Science, Math, History"
                      className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </>
  );
};