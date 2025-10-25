'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { QuestionBank } from '@/lib/types';

const FormInput = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        {children}
    </div>
);

export const BankEditorModal = ({ bank, onSave, onClose }: { bank: QuestionBank, onSave: (bank: QuestionBank) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<QuestionBank>(bank);

    useEffect(() => { setFormData(bank); }, [bank]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            const isNumber = type === 'number';
            setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, categories: e.target.value.split(',').map(tag => tag.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">{bank.id ? 'Edit Question Bank' : 'Create New Question Bank'}</h2>
                        <button type="button" onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><X /></button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* --- UPDATED LABEL --- */}
                            <FormInput label="Question Bank Name" id="name"><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" required /></FormInput>
                            <FormInput label="Slug" id="slug"><input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" required/></FormInput>
                        </div>
                        <FormInput label="Description" id="description"><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Tags (comma-separated)" id="tags"><input type="text" id="tags" name="tags" value={formData.categories.join(', ')} onChange={handleTagsChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                            <FormInput label="Age Group" id="ageGroup">
                                <select
                                    name="ageGroup"
                                    id="ageGroup"
                                    value={formData.ageGroup || 'adults'} 
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border bg-white border-slate-300 rounded-lg text-slate-900"
                                >
                                    <option value="child">Kids (6-12)</option>
                                    <option value="teen">Teens (13-17)</option>
                                    <option value="adult">Adults (18+)</option>
                                </select>
                            </FormInput>
                        </div>

                        <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                            <h4 className="font-semibold text-slate-900">Publishing</h4>
                            <FormInput label="Status" id="status">
                                <select
                                    name="published"
                                    id="status"
                                    value={formData.published ? 'true' : 'false'} // boolean → string
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            published: e.target.value === 'true', // string → boolean
                                        }))
                                    }
                                    className="w-full px-3 py-2 border bg-white border-slate-300 rounded-lg text-slate-900"
                                >
                                    <option value="false">Draft</option>
                                    <option value="true">Published</option>
                                </select>
                            </FormInput>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 font-semibold text-slate-700 bg-white rounded-lg border hover:bg-slate-100">Cancel</button>
                        <button type="submit" className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save Changes</button>
                    </div>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
};