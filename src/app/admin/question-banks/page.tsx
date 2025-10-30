'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axiosInstance from '@/utils/axiosInstance';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import type { QuestionBank } from '@/lib/types';
import { QuestionBankCard } from '../components/question bank/QuestionBankCard';
import { BankEditorModal } from '../components/question bank/BankEditorModal';
import { PinVerificationModal } from '../components/question bank/PinVerificationModal';
import { Router } from 'next/router';

// Create QueryClient
const queryClient = new QueryClient();

// Wrapper for page layout
function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto p-4">{children}</div>;
}

// Page content component
function QuestionBanksPageContent() {

  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState<QuestionBank[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIN');
        if (loggedIn !== 'true') {
            router.push('/auth/login');
        }
    }, [router]);

  // Fetch all question banks
  const { data: allBanks = [], isLoading, isError } = useQuery<QuestionBank[]>({
    queryKey: ['question-banks'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/questions/banks');
      return res.data.map((b: any) => ({
        ...b,
        tags: b.tags || [],
        prizeMedia: b.prizeMedia || undefined,
      })) as QuestionBank[];
    },
  });

  const allTags = Array.from(new Set(allBanks.flatMap((b) => b.categories)));

  // Filter banks when data or filters change
  useEffect(() => {
    let tempBanks = [...allBanks];
    if (ageGroupFilter !== 'all') tempBanks = tempBanks.filter((b) => b.ageGroup === ageGroupFilter);
    if (tagFilter !== 'all') tempBanks = tempBanks.filter((b) => b.categories.includes(tagFilter));
    setFilteredBanks((prev) => {
      const same = prev.length === tempBanks.length && prev.every((b, i) => b._id === tempBanks[i]._id);
      return same ? prev : tempBanks;
    });
  }, [allBanks, ageGroupFilter, tagFilter]);

  // Open editor for new or existing bank
  const handleOpenEditor = (bank: QuestionBank | null) => {
    if (bank) {
      setEditingBank(bank);
    } else {
      setEditingBank({
        _id: undefined,
        name: '',
        slug: '',
        description: '',
        published: false,
        categories: [],
        ageGroup: 'adult',
        questionCount: 0,
        defaultTimer: 30,
        prizeLadder: [],
      });
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingBank(null);
  };

  const handleVerificationSuccess = () => setIsVerified(true);

  // Delete bank
  const handleDeleteBank = async (bankId: string) => {
    if (window.confirm('Are you sure you want to delete this bank and all its questions?')) {
      try {
        await axiosInstance.delete(`/api/questions/banks/${bankId}`);
        queryClient.setQueryData<QuestionBank[]>(['question-banks'], (old = []) =>
          old.filter((b) => b._id !== bankId)
        );
      } catch (err) {
        console.error('Failed to delete bank:', err);
      }
    }
  };

  const onMove = async(bank: QuestionBank) => {

  }
 

  const handleSaveBank = async (bank: QuestionBank) => {
  try {
    const payload = {
      name: bank.name,
      slug: bank.slug,
      description: bank.description,
      published: bank.published,
      categories: bank.categories,
      ageGroup: bank.ageGroup,
      questionCount: bank.questionCount,
      defaultTimer: bank.defaultTimer,
      prizeLadder: bank.prizeLadder,
    };

    let updatedBank: QuestionBank;
    if (bank._id) {
      const res = await axiosInstance.put(`/api/questions/banks/${bank._id}`, payload);
      updatedBank = { ...res.data, tags: res.data.tags || [] };
    } else {
      const res = await axiosInstance.post(`/api/questions/banks`, payload);
      updatedBank = { ...res.data, tags: res.data.tags || [] };
    }

   
    queryClient.setQueryData<QuestionBank[]>(['question-banks'], (old = []) => {
      const exists = old.some((b) => b._id === updatedBank._id);
      const newBanks = exists
        ? old.map((b) => (b._id === updatedBank._id ? updatedBank : b))
        : [updatedBank, ...old];

      // Update filteredBanks immediately according to filters
      let tempBanks = [...newBanks];
      if (ageGroupFilter !== 'all') tempBanks = tempBanks.filter((b) => b.ageGroup === ageGroupFilter);
      if (tagFilter !== 'all') tempBanks = tempBanks.filter((b) => b.categories.includes(tagFilter));
      setFilteredBanks(tempBanks);

      return newBanks;
    });

    handleCloseEditor();
  } catch (err) {
    console.error('Failed to save bank:', err);
  }
};


  const handleExport = () => {
    alert('This would trigger a download of the selected questions in the chosen format.');
  };

  if (!isVerified) return <PinVerificationModal onVerify={handleVerificationSuccess}  />;
  if (isLoading) return <div className="text-center mt-10">Loading question banks...</div>;
  if (isError) return <div className="text-center mt-10 text-red-600">Failed to load question banks.</div>;

  return (
    <Wrapper>
      <AnimatePresence>
        {isEditorOpen && editingBank && (
          <BankEditorModal bank={editingBank} onSave={handleSaveBank} onClose={handleCloseEditor} />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Question Banks</h1>
            <p className="text-slate-700 mt-1">Manage and organize your question collections.</p>
          </div>
          <button
            onClick={() => handleOpenEditor(null)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Question Bank</span>
          </button>
        </div>

        {/* Export Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">Export Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
            <div className="md:col-span-1">
              <label htmlFor="bankSelect" className="block text-sm font-medium text-slate-700 mb-2">Question Bank</label>
              <select id="bankSelect" className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                <option>All Banks</option>
                {allBanks.map((bank) => (
                  <option key={bank._id} value={bank._id}>{bank.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label htmlFor="statusSelect" className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select id="statusSelect" className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label htmlFor="formatSelect" className="block text-sm font-medium text-slate-700 mb-2">Format</label>
              <select id="formatSelect" className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                <option>CSV</option>
                <option>JSON</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                onClick={handleExport}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-10 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                <Download size={16} /> Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">Filter Question Banks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label htmlFor="ageGroupFilter" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
              <select
                id="ageGroupFilter"
                value={ageGroupFilter}
                onChange={(e) => setAgeGroupFilter(e.target.value)}
                className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900"
              >
                <option value="all">All</option>
                <option value="child">Kids (6-12)</option>
                <option value="teen">Teens (13-17)</option>
                <option value="adult">Adult (18+)</option>
              </select>
            </div>
            <div>
              <label htmlFor="tagFilter" className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                id="tagFilter"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900"
              >
                <option value="all">All Categories</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bank Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBanks.map((bank, index) => (
              <QuestionBankCard
                key={bank._id || index}
                bank={bank}
                index={index}
                isFirst={index === 0}
                isLast={index === filteredBanks.length - 1}
                onMove={(e) => { e.preventDefault(); onMove(bank);}}
                onEdit={(e) => { e.preventDefault(); handleOpenEditor(bank); }}
                onDelete={(e) => { e.preventDefault(); if (bank._id) handleDeleteBank(bank._id); }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Wrapper>
  );
}

export default function QuestionBanksPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionBanksPageContent />
    </QueryClientProvider>
  );
}
