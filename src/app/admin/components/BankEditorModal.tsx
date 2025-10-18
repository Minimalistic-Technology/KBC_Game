'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Library } from 'lucide-react';
import type { QuestionBank, MediaAsset, DerivedFormat } from '@/lib/types';
import { MediaUploader } from './MediaUploader';
import { MediaLibraryModal } from './MediaLibraryModal';
import { MediaPreview } from './MediaPreview';

const FormInput = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    {children}
  </div>
);

export const BankEditorModal = ({ bank, onSave, onClose }: { bank: QuestionBank, onSave: (bank: QuestionBank) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<QuestionBank>(bank);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    
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
      setFormData(prev => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim())}));
    };

    const handleMediaUploadComplete = (asset: MediaAsset) => { setFormData(prev => ({ ...prev, prizeMedia: asset })); };
    const handleSelectFromLibrary = (asset: MediaAsset) => { setFormData(prev => ({ ...prev, prizeMedia: asset })); setIsLibraryOpen(false); };
    const handleRemoveMedia = () => { setFormData(prev => ({ ...prev, prizeMedia: undefined })); };
    const handleDefaultFormatChange = (format: DerivedFormat) => { if (formData.prizeMedia) { setFormData(prev => ({ ...prev, prizeMedia: { ...prev.prizeMedia!, defaultFormat: format } })); } };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

    return (
        <>
            <AnimatePresence>
                {isLibraryOpen && ( <MediaLibraryModal onClose={() => setIsLibraryOpen(false)} onSelect={handleSelectFromLibrary} filter="image" /> )}
            </AnimatePresence>

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
                            <FormInput label="Prize" id="prize"><input type="text" id="prize" name="prize" value={formData.prize} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" /></FormInput>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Age Group" id="ageGroup">
                                <select name="ageGroup" id="ageGroup" value={formData.ageGroup || 'All Ages'} onChange={handleChange} className="w-full px-3 py-2 border bg-white border-slate-300 rounded-lg text-slate-900">
                                    <option>All Ages</option>
                                    <option>Kids (6-12)</option>
                                    <option>Teens (13-17)</option>
                                    <option>Adults (18+)</option>
                                </select>
                            </FormInput>
                        </div>

                        {/* --- NEW: SAFE POINT SECTION --- */}
                        <div className="p-4 border rounded-lg bg-slate-50">
                            <h4 className="font-semibold text-slate-900 mb-3">Game Rules</h4>
                            <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                                <label htmlFor="onlySafePoints" className="font-medium text-slate-800 cursor-pointer">Enable Safe Points Only</label>
                                <input
                                    id="onlySafePoints"
                                    name="onlySafePoints"
                                    type="checkbox"
                                    checked={!!formData.onlySafePoints}
                                    onChange={handleChange}
                                    className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 px-1">If enabled, players will not lose winnings for a wrong answer.</p>
                        </div>

                        <FormInput label="Prize Image (Optional)" id="prizeImage">
                            {formData.prizeMedia ? (
                                <MediaPreview asset={formData.prizeMedia} onRemove={handleRemoveMedia} onDefaultFormatChange={handleDefaultFormatChange} />
                            ) : (
                                <div className="space-y-3">
                                    <MediaUploader onUploadComplete={handleMediaUploadComplete} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} />
                                    <div className="relative flex items-center">
                                        <div className="flex-grow border-t border-slate-300"></div>
                                        <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
                                        <div className="flex-grow border-t border-slate-300"></div>
                                    </div>
                                    <button type="button" onClick={() => setIsLibraryOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 h-11 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                                        <Library className="h-4 w-4"/> Choose from Library
                                    </button>
                                </div>
                            )}
                        </FormInput>

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
        </>
    );
};