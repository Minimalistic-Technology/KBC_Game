'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save, Eye, CheckCircle, Library } from 'lucide-react';
import type { Question, MediaAsset, DerivedFormat } from '@/lib/types';
import { MediaUploader } from '../Media/MediaUploader';
import { MediaPreview } from '../Media/MediaPreview';

type LangKey = 'en' | 'hi' | 'gu';
type LangBlock = { text: string; options: string[]; categories: string[] };

const emptyBlock = (): LangBlock => ({
  text: '',
  options: ['', '', '', ''],
  categories: [],
});

export const QuestionEditorModal = ({
  question,
  onSave,
  onClose,
  initialLang,
}: {
  question: Question;
  onSave: (question: Question, file?: File | null, langPayload?: any) => void;
  onClose: () => void;
  initialLang?: any;
}) => {
  const [formData, setFormData] = useState<Question>(question);
  const [tagsInput, setTagsInput] = useState(question.categories.join(', '));

  const [activeLang, setActiveLang] = useState<LangKey>('en');
  const [blocks, setBlocks] = useState<Record<LangKey, LangBlock>>({
    en: {
      text: question.question || '',
      options: question.options || ['', '', '', ''],
      categories: question.categories || []
    },
    hi: emptyBlock(),
    gu: emptyBlock(),
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);

  // Single correct answer index (0-3)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleMediaUploadComplete = (asset: MediaAsset, file?: File) => {
    setFormData((prev) => ({ ...prev, media: asset }));
    if (file) setRawFile(file);
  };

  useEffect(() => {
    setFormData(question);
    setTagsInput(question.categories.join(', '));

    const toTextArray4 = (arr: any): string[] => {
      const list = Array.isArray(arr) ? arr.map((o: any) => (typeof o === 'string' ? o : o?.text ?? '')) : [];
      return list.slice(0, 4).concat(['', '', '', '']).slice(0, 4);
    };

    const enBlock = {
      text: question.question || '',
      options: toTextArray4(question.options || []),
      categories: question.categories || [],
    };

    const hiBlock = initialLang?.hi
      ? {
        text: initialLang.hi.text || '',
        options: toTextArray4(initialLang.hi.options),
        categories: initialLang.hi.categories || [],
      }
      : emptyBlock();

    const guBlock = initialLang?.gu
      ? {
        text: initialLang.gu.text || '',
        options: toTextArray4(initialLang.gu.options),
        categories: initialLang.gu.categories || [],
      }
      : emptyBlock();

    setBlocks({ en: enBlock, hi: hiBlock, gu: guBlock });

    // Initialize selectedIndex
    if (typeof question.correctIndex === 'number') {
      setSelectedIndex(question.correctIndex);
    } else if (question.correctIndices && Array.isArray(question.correctIndices)) {
      // Legacy multi-answer - take first index
      setSelectedIndex(question.correctIndices[0] ?? 0);
    } else {
      // Fallback logic for legacy single answer
      const idx = question.options?.indexOf(question.answer || '');
      setSelectedIndex(idx >= 0 ? idx : 0);
    }
  }, [question, initialLang]);

  const cur = blocks[activeLang];

  const setCur = (patch: Partial<LangBlock>) => {
    setBlocks((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        ...patch,
      },
    }));
  };

  const handleLangTab = (k: LangKey) => setActiveLang(k);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCur({ text: value });
    if (activeLang === 'en') {
      setFormData((p) => ({ ...p, question: value }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const next = [...cur.options];
    next[index] = value;
    setCur({ options: next });
    if (activeLang === 'en') {
      setFormData((p) => {
        const mirrored = [...p.options];
        mirrored[index] = value;
        return { ...p, options: mirrored };
      });
    }
  };

  // Set correct index (radio button behavior)
  const setCorrectIndex = (index: number) => {
    setSelectedIndex(index);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const arr = value.split(',').map((t) => t.trim()).filter(Boolean);
    setTagsInput(value);
    setCur({ categories: arr });
    if (activeLang === 'en') {
      setFormData((p) => ({ ...p, categories: arr }));
    }
  };

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    setFormData((prev) => ({ ...prev, media: asset }));
    setIsLibraryOpen(false);
  };

  const handleRemoveMedia = () => {
    setFormData((prev) => ({ ...prev, media: undefined }));
  };

  const isFilledBlock = (b: LangBlock) =>
    (b.text?.trim()?.length ?? 0) > 0 || b.options.some((o) => (o?.trim()?.length ?? 0) > 0) || (b.categories?.length ?? 0) > 0;

  const exactlyFour = (arr: string[]) => Array.isArray(arr) && arr.length === 4 && arr.every((s) => typeof s === 'string');

  const validateBlocks = (): { ok: boolean; msg?: string } => {
    const en = blocks.en;
    if (!en.text.trim() || en.options.some((o) => !o.trim())) {
      return { ok: false, msg: 'Please complete English text and all 4 English options.' };
    }
    if (!exactlyFour(en.options)) return { ok: false, msg: 'English must have exactly 4 options.' };

    const hi = blocks.hi;
    if (isFilledBlock(hi)) {
      if (!hi.text.trim() || hi.options.some((o) => !o.trim())) {
        return { ok: false, msg: 'Please complete all Hindi fields or clear them.' };
      }
      if (!exactlyFour(hi.options)) return { ok: false, msg: 'Hindi must have exactly 4 options when provided.' };
    }

    const gu = blocks.gu;
    if (isFilledBlock(gu)) {
      if (!gu.text.trim() || gu.options.some((o) => !o.trim())) {
        return { ok: false, msg: 'Please complete all Gujarati fields or clear them.' };
      }
      if (!exactlyFour(gu.options)) return { ok: false, msg: 'Gujarati must have exactly 4 options when provided.' };
    }

    // No validation needed for selectedIndex - always has a value (0-3)

    return { ok: true };
  };

  const handleSubmit = (e: React.FormEvent, status: 'Draft' | 'Published' = 'Draft') => {
    e.preventDefault();
    const v = validateBlocks();
    if (!v.ok) {
      alert(v.msg);
      return;
    }
    if (status === 'Published' && !window.confirm('Are you sure you want to publish this question?')) return;

    const langPayload: any = {
      en: {
        text: blocks.en.text,
        options: blocks.en.options.map((t) => ({ text: t })),
        categories: blocks.en.categories,
      },
    };
    if (isFilledBlock(blocks.hi)) {
      langPayload.hi = {
        text: blocks.hi.text,
        options: blocks.hi.options.map((t) => ({ text: t })),
        categories: blocks.hi.categories,
      };
    }
    if (isFilledBlock(blocks.gu)) {
      langPayload.gu = {
        text: blocks.gu.text,
        options: blocks.gu.options.map((t) => ({ text: t })),
        categories: blocks.gu.categories,
      };
    }

    const next: Question = {
      ...formData,
      question: blocks.en.text,
      options: blocks.en.options,
      categories: blocks.en.categories,
      status,
      correctIndex: selectedIndex,
      correctIndices: undefined, // clear legacy multi-answer
      answer: '', // clear legacy single answer
    };

    onSave(next, rawFile, langPayload);
  };

  return (
    <>
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-800 rounded-xl w-full max-w-lg text-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-center text-lg font-medium text-indigo-300 mb-4">Player Preview (EN)</h3>
              <p className="text-2xl font-bold text-center mb-8">{blocks.en.text || 'Your question...'}</p>
              <div className="grid grid-cols-2 gap-4">
                {blocks.en.options.map((opt, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 ${selectedIndex === index ? 'border-green-500 bg-green-500/20' : 'border-slate-600 bg-slate-700'
                      }`}
                  >
                    <span className="font-bold text-indigo-400">{String.fromCharCode(65 + index)}:</span>
                    <span>{opt || `Option ${String.fromCharCode(65 + index)}`}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-900">{question._id ? 'Edit Question' : 'Create New Question'}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 rounded-full hover:bg-slate-100"
            >
              <X />
            </button>
          </div>

          <div className="flex-grow flex flex-col md:grid md:grid-cols-3 overflow-y-auto md:overflow-hidden">
            <form onSubmit={(e) => handleSubmit(e, 'Draft')} className="md:col-span-2 p-6 space-y-6 md:overflow-y-auto">
              <div className="flex gap-2 mb-2">
                {(['en', 'hi', 'gu'] as LangKey[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleLangTab(k)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${activeLang === k ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-300'
                      }`}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="question" className="text-sm font-medium text-slate-800 mb-2 block">
                  Question ({activeLang.toUpperCase()})
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={cur.text}
                  onChange={handleQuestionChange}
                  placeholder={`Type ${activeLang.toUpperCase()} question here...`}
                  className="w-full h-28 p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800 mb-2 block">Media (Image/Video/Audio)</label>
                {formData.media ? (
                  <MediaPreview
                    asset={formData.media}
                    onRemove={handleRemoveMedia}
                  />
                ) : (
                  <div className="space-y-3">
                    <MediaUploader
                      onUploadComplete={handleMediaUploadComplete}
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                        'video/*': ['.mp4', '.mov'],
                        'audio/*': ['.mp3', '.wav'],
                      }}
                    />
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-slate-300"></div>
                      <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
                      <div className="flex-grow border-t border-slate-300"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLibraryOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-11 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                    >
                      <Library className="h-4 w-4" /> Choose from Library
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800 mb-2 block">
                  Options & Correct Answer ({activeLang.toUpperCase()})
                </label>
                <div className="space-y-3">
                  {cur.options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={activeLang === 'en' && selectedIndex === index}
                        onChange={() => activeLang === 'en' && setCorrectIndex(index)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                        disabled={activeLang !== 'en'}
                        title={activeLang !== 'en' ? 'Select correct option in English tab' : 'Mark as correct'}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                  {activeLang !== 'en' && (
                    <p className="text-xs text-slate-500">
                      Correct answer index is shared. Select the correct option on the <b>EN</b> tab.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="text-sm font-medium text-slate-800 mb-2 block">
                  Category Tag(s) ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={activeLang === 'en' ? tagsInput : (blocks[activeLang].categories || []).join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g. Science, Math, History"
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </form>

            <div className="md:col-span-1 bg-slate-50 border-l p-6 space-y-6 md:overflow-y-auto">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, 'Draft')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <Save className="h-4 w-4" /> Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <Eye className="h-4 w-4" /> Preview (EN)
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, 'Published')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    <CheckCircle className="h-4 w-4" /> Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
