'use client';

import React, { useState } from 'react';
import { PlusCircle, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { initialBanks } from '@/lib/data';
import type { QuestionBank } from '@/lib/types';
import { QuestionBankCard } from '../components/QuestionBankCard';
import { BankEditorModal } from '../components/BankEditorModal';

export default function QuestionBanksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to enable PIN
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
            <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4"><KeyRound className="text-indigo-600" size={32} /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">PIN Required</h2>
            <p className="text-slate-600 mb-6">Enter the 4-digit PIN to access this page.</p>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} autoFocus className="w-full px-4 py-3 text-center text-3xl tracking-[1em] bg-slate-100 text-slate-900 border-2 rounded-lg" placeholder="••••" />
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button type="submit" className="w-full mt-6 px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Unlock</button>
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