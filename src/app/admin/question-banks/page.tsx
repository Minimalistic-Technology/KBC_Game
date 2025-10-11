'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, X, Plus, FileText, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// type definitions
type PrizeLevel = {
  id: number;
  level: number;
  amount: number;
  isSafe: boolean;
};

type QuestionBank = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  tags: string[];
  questionCount: number;
  prize: number;
  defaultTimer: number;
  scheduledFor: string | null;
  prizeLadder: PrizeLevel[];
};

// mock data
const initialBanks: QuestionBank[] = [
  { id: 'q1', title: 'General Knowledge Kickstart', slug: 'general-knowledge-kickstart', description: 'Easy to medium questions to warm up.', status: 'Published', tags: ['GK', 'Beginner'], questionCount: 52, prize: 5000, defaultTimer: 30, scheduledFor: '2025-10-20T19:00', prizeLadder: [{id: 1, level: 1, amount: 5000, isSafe: true}] },
  { id: 'q2', title: 'Science & Technology', slug: 'science-tech', description: 'Challenging questions about the world of science.', status: 'Draft', tags: ['Science', 'Tech'], questionCount: 88, prize: 5000, defaultTimer: 45, scheduledFor: null, prizeLadder: [] },
  { id: 'q3', title: 'World History', slug: 'world-history', description: 'A journey through time.', status: 'Scheduled', tags: ['History', 'Advanced'], questionCount: 120, prize: 10000, defaultTimer: 60, scheduledFor: '2025-11-05T20:00', prizeLadder: [] },
];

//form input component
const FormInput = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    {children}
  </div>
);

//prize ladder editor component
const PrizeLadderEditor = ({ value, onChange }: { value: PrizeLevel[], onChange: (value: PrizeLevel[]) => void }) => {
  const handleAddLevel = () => {
    const newLevelNumber = value.length > 0 ? Math.max(...value.map(l => l.level)) + 1 : 1;
    onChange([...value, { id: Date.now(), level: newLevelNumber, amount: 0, isSafe: false }]);
  };

  const handleRemoveLevel = (id: number) => onChange(value.filter(level => level.id !== id));

  const handleUpdateLevel = (id: number, field: keyof PrizeLevel, fieldValue: any) => {
    onChange(value.map(level => level.id === id ? { ...level, [field]: fieldValue } : level));
  };

  const totalPrize = value.reduce((sum, level) => sum + level.amount, 0);

  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-900">Prize Ladder</h4>
        <span className="text-sm font-bold text-slate-600">Total: ${totalPrize.toLocaleString()}</span>
      </div>
      <div className="space-y-2">
        {value.map((level, index) => (
          <div key={level.id} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${level.isSafe ? 'bg-indigo-100' : ''}`}>
            <span className="col-span-1 font-bold text-slate-500 text-center">{index + 1}</span>
            <input type="number" placeholder="Amount" value={level.amount} onChange={(e) => handleUpdateLevel(level.id, 'amount', Number(e.target.value))} className="col-span-6 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900" />
            <label className="col-span-4 flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={level.isSafe} onChange={(e) => handleUpdateLevel(level.id, 'isSafe', e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
              Safe
            </label>
            <button type="button" onClick={() => handleRemoveLevel(level.id)} className="col-span-1 p-2 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddLevel} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
        <Plus size={16} /> Add Level
      </button>
    </div>
  );
};

// bank editor modal component
const BankEditorModal = ({ bank, onSave, onClose }: { bank: QuestionBank, onSave: (bank: QuestionBank) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<QuestionBank>(bank);

    useEffect(() => { setFormData(bank); }, [bank]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim())}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{bank.id ? 'Edit Question Bank' : 'Create New Bank'}</h2>
                    <button type="button" onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><X /></button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput label="Bank Name" id="title"><input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" required /></FormInput>
                        <FormInput label="Slug" id="slug"><input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                    </div>
                    <FormInput label="Description" id="description"><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput label="Tags (comma-separated)" id="tags"><input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                        <FormInput label="Prize Amount" id="prize"><input type="number" id="prize" name="prize" value={formData.prize} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                    </div>
                    <PrizeLadderEditor value={formData.prizeLadder} onChange={ladder => setFormData(prev => ({ ...prev, prizeLadder: ladder }))} />
                    <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                        <h4 className="font-semibold text-slate-900">Publishing</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Status" id="status"><select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border bg-white border-slate-300 rounded-lg text-slate-900"><option>Draft</option><option>Published</option><option>Scheduled</option></select></FormInput>
                            <FormInput label="Schedule Date" id="scheduledFor"><input type="datetime-local" id="scheduledFor" name="scheduledFor" value={formData.scheduledFor || ''} onChange={handleChange} disabled={formData.status !== 'Scheduled'} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 disabled:bg-slate-200" /></FormInput>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2 font-semibold text-slate-700 bg-white rounded-lg border hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save Changes</button>
                </div>
            </motion.form>
        </motion.div>
    );
};

//question bank card component
const QuestionBankCard = ({ bank, index, onEdit, onDelete, onMove, isFirst, isLast }: { bank: QuestionBank, index: number, onEdit: (e: React.MouseEvent) => void, onDelete: (e: React.MouseEvent) => void, onMove: (e: React.MouseEvent, direction: 'up' | 'down') => void, isFirst: boolean, isLast: boolean }) => {
  const statusClasses: { [key: string]: string } = { Published: "bg-green-100 text-green-800", Draft: "bg-yellow-100 text-yellow-800", Scheduled: "bg-blue-100 text-blue-800" };
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col group transition-shadow duration-200 hover:shadow-md">
        <Link href={`/admin/questions?bankId=${bank.id}`} className="flex-grow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold bg-slate-100 text-slate-700 py-1 px-3 rounded-md">Q{index + 1}</span>
                    <span className={`text-xs font-bold capitalize px-3 py-1 rounded-full ${statusClasses[bank.status]}`}>{bank.status}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{bank.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{bank.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                    {bank.tags.map(tag => (<span key={tag} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{tag}</span>))}
                </div>
            </div>
        </Link>
        <div className="border-t border-slate-200 bg-slate-50/75 p-3 flex justify-between items-center text-sm">
            <div className="flex items-center gap-4 text-slate-700 font-medium">
                <span className="flex items-center gap-1.5" title="Number of questions"><FileText size={14} /> {bank.questionCount}</span>
                <span className="font-light text-slate-300">|</span>
                <span className="flex items-center gap-1.5" title="Prize money">${bank.prize.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={(e) => onMove(e, 'up')} disabled={isFirst} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={(e) => onMove(e, 'down')} disabled={isLast} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={onEdit} className="p-2 rounded-md text-slate-500 hover:bg-slate-200" title="Edit"><Edit size={16} /></button>
                <button onClick={onDelete} className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
            </div>
        </div>
    </motion.div>
  );
};


// main page component
export default function QuestionBanksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const CORRECT_PIN = '1234';

  const [banks, setBanks] = useState<QuestionBank[]>(initialBanks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBank({ id: '', title: '', slug: '', description: '', status: 'Draft', tags: [], questionCount: 0, prize: 0, defaultTimer: 30, scheduledFor: null, prizeLadder: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, bank: QuestionBank) => {
    e.preventDefault();
    setEditingBank(bank);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingBank(null); };

  const handleSaveBank = (bankToSave: QuestionBank) => {
    if (bankToSave.id) {
        setBanks(banks.map(b => b.id === bankToSave.id ? bankToSave : b));
    } else {
        setBanks([...banks, { ...bankToSave, id: `q${Date.now()}` }]);
    }
    handleCloseModal();
  };

  const handleDeleteBank = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this bank? This cannot be undone.')) {
        setBanks(banks.filter(b => b.id !== id));
    }
  };

  const handleMoveBank = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.preventDefault();
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === banks.length - 1)) return;
    const newBanks = [...banks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanks[index], newBanks[targetIndex]] = [newBanks[targetIndex], newBanks[index]];
    setBanks(newBanks);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <form onSubmit={handlePinSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <KeyRound className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">PIN Required</h2>
            <p className="text-slate-600 mb-6">Enter the 4-digit PIN to access this page.</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              autoFocus
              className="w-full px-4 py-3 text-center text-3xl tracking-[1em] bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••"
            />
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button type="submit" className="w-full mt-6 px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isModalOpen && editingBank && (<BankEditorModal bank={editingBank} onSave={handleSaveBank} onClose={handleCloseModal} />)}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Question Banks</h1>
            <p className="text-slate-700 mt-1">Manage, reorder, and configure your question sets.</p>
          </div>
          <button onClick={handleOpenCreateModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <PlusCircle className="h-5 w-5" />
            <span>Create New Bank</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {banks.map((bank, index) => (
                <QuestionBankCard
                    key={bank.id}
                    bank={bank}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === banks.length - 1}
                    onEdit={(e) => handleOpenEditModal(e, bank)}
                    onDelete={(e) => handleDeleteBank(e, bank.id)}
                    onMove={(e, direction) => handleMoveBank(e, index, direction)}
                />
            ))}
        </div>
      </div>
    </>
  );
}