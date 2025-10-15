'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { QuestionBank, PrizeLevel } from '@/lib/types';

// --- Helper Components ---
const FormInput = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    {children}
  </div>
);

const PrizeLadderEditor = ({ value, onChange }: { value: PrizeLevel[], onChange: (value: PrizeLevel[]) => void }) => {
  const handleAddLevel = () => {
    const newLevelNumber = value.length > 0 ? Math.max(...value.map(l => l.level)) + 1 : 1;
    onChange([...value, { id: Date.now(), level: newLevelNumber, amount: 0, isSafe: false }]);
  };

  const handleRemoveLevel = (id: number) => {
    onChange(value.filter(level => level.id !== id));
  };
  
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

// --- Main Modal Component ---
export const BankEditorModal = ({ bank, onSave, onClose }: { bank: QuestionBank, onSave: (bank: QuestionBank) => void, onClose: () => void }) => {
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