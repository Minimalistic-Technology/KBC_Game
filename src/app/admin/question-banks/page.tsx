'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { initialBanks, allQuestions } from '@/lib/data';
import type { QuestionBank } from '@/lib/types';
import { QuestionBankCard } from '../components/QuestionBankCard';
import { BankEditorModal } from '../components/BankEditorModal';
import { PinVerificationModal } from '../components/PinVerificationModal';

export default function QuestionBanksPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [allBanks, setAllBanks] = useState(initialBanks);
  const [filteredBanks, setFilteredBanks] = useState(initialBanks);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);

  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
  const allTags = [...new Set(allBanks.flatMap(bank => bank.tags))];

  useEffect(() => {
    let tempBanks = [...allBanks];
    if (ageGroupFilter !== 'all') { tempBanks = tempBanks.filter(bank => bank.ageGroup === ageGroupFilter); }
    if (tagFilter !== 'all') { tempBanks = tempBanks.filter(bank => bank.tags.includes(tagFilter)); }
    setFilteredBanks(tempBanks);
  }, [ageGroupFilter, tagFilter, allBanks]);

  const handleOpenEditor = (bank: QuestionBank | null) => {
    if (bank) {
      setEditingBank(bank);
    } else {
      setEditingBank({
        id: `qb_${Date.now()}`,
        title: '',
        slug: '',
        description: '',
        status: 'Draft',
        tags: [],
        ageGroup: 'All Ages',
        questionCount: 0,
        prize: '',
        onlySafePoints: false,
        defaultTimer: 30,
        // --- REMOVED scheduledFor ---
        prizeLadder: [],
       });
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => { setIsEditorOpen(false); setEditingBank(null); };

  const handleSaveBank = (savedBank: QuestionBank) => {
    const exists = allBanks.some(b => b.id === savedBank.id);
    const questionCount = allQuestions.filter(q => q.bankId === savedBank.id).length;
    const finalBank = { ...savedBank, questionCount };

    if (exists) {
      setAllBanks(allBanks.map(b => b.id === finalBank.id ? finalBank : b));
    } else {
      setAllBanks([finalBank, ...allBanks]);
    }
    handleCloseEditor();
  };

  const handleDeleteBank = (bankId: string) => { if (window.confirm('Are you sure you want to delete this bank and all its questions?')) { setAllBanks(prev => prev.filter(b => b.id !== bankId)); } };
  const handleMove = (bankId: string, direction: 'up' | 'down') => {
    const index = allBanks.findIndex(b => b.id === bankId);
    if (index === -1) return;
    const newBanks = [...allBanks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBanks.length) return;
    [newBanks[index], newBanks[targetIndex]] = [newBanks[targetIndex], newBanks[index]];
    setAllBanks(newBanks);
  };

  const handleVerificationSuccess = () => { setIsVerified(true); };
  
  if (!isVerified) { return <PinVerificationModal onVerify={handleVerificationSuccess} correctPin={correctPin} />; }

  return (
    <>
      <AnimatePresence>
        {isEditorOpen && editingBank && (<BankEditorModal bank={editingBank} onSave={handleSaveBank} onClose={handleCloseEditor} />)}
      </AnimatePresence>
      
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Question Banks</h1>
                <p className="text-slate-700 mt-1">Manage and organize your question collections.</p>
            </div>
            <button onClick={() => handleOpenEditor(null)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                <Plus className="h-5 w-5" />
                <span>Create New Bank</span>
            </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900">Filter Banks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                    <label htmlFor="ageGroupFilter" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
                    <select id="ageGroupFilter" value={ageGroupFilter} onChange={e => setAgeGroupFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                        <option value="all">All Ages</option>
                        <option value="Kids (6-12)">Kids (6-12)</option>
                        <option value="Teens (13-17)">Teens (13-17)</option>
                        <option value="Adults (18+)">Adults (18+)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="tagFilter" className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select id="tagFilter" value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                        <option value="all">All Categories</option>
                        {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                </div>
            </div>
        </div>
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBanks.map((bank, index) => (
              <QuestionBankCard 
                key={bank.id} 
                bank={bank} 
                index={index}
                isFirst={index === 0}
                isLast={index === filteredBanks.length - 1}
                onEdit={(e) => { e.preventDefault(); handleOpenEditor(bank); }}
                onDelete={(e) => { e.preventDefault(); handleDeleteBank(bank.id); }}
                onMove={(e, dir) => { e.preventDefault(); handleMove(bank.id, dir); }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}