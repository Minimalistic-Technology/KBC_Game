'use client';

import React, { useState, useMemo } from 'react';
import { initialBanks } from '@/lib/data';
import type { PrizeLevel, Lifeline, MediaAsset } from '@/lib/types';
import { PrizeLadderEditor } from '../components/Game-config/PrizeLadderEditor';
import { Save, Search, Zap, Users, Lightbulb, RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MediaLibraryModal } from '../components/Media/MediaLibraryModal';
import { BankSelectionCard } from '../components/Game-config/BankSelectionCard';
import { LifelineToggle } from '../components/Game-config/LifelineToggle';

export default function GameConfigPage() {
    const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
    const [prizeLadder, setPrizeLadder] = useState<PrizeLevel[]>([]);
    const [lifelines, setLifelines] = useState<Lifeline>({
        '50:50': true,
        'Audience Poll': true,
        'Expert Advice': true,
        'Flip Question': false,
    });
    
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [editingLevelId, setEditingLevelId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [ageFilter, setAgeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    const allCategories = useMemo(() => [...new Set(initialBanks.flatMap(b => b.tags))], []);

    const filteredBanks = useMemo(() => {
        return initialBanks.filter(bank => {
            const searchMatch = searchTerm === '' || 
                                bank.title.toLowerCase().startsWith(searchTerm.toLowerCase());
            
            const ageMatch = ageFilter === 'all' || bank.ageGroup === ageFilter;
            const categoryMatch = categoryFilter === 'all' || bank.tags.includes(categoryFilter);
            return searchMatch && ageMatch && categoryMatch;
        });
    }, [searchTerm, ageFilter, categoryFilter]);

    const handleBankToggle = (id: string) => {
        setSelectedBankIds(prev =>
            prev.includes(id) 
                ? prev.filter(bankId => bankId !== id)
                : [...prev, id]
        );
    };
    
    const handleLifelineToggle = (label: keyof Lifeline) => {
        setLifelines(prev => ({ ...prev, [label]: !prev[label] }));
    };
    
    const handleEditPrizeImage = (levelId: number) => {
        setEditingLevelId(levelId);
        setIsMediaLibraryOpen(true);
    };

    const handleSelectPrizeImage = (asset: MediaAsset) => {
        if (editingLevelId === null) return;
        setPrizeLadder(prev => prev.map(level => 
            level.id === editingLevelId ? { ...level, media: asset } : level
        ));
        setIsMediaLibraryOpen(false);
        setEditingLevelId(null);
    };

    const handleSave = () => {
        const config = {
            selectedBanks: selectedBankIds,
            prizeLadder: prizeLadder,
            lifelines: lifelines,
        };
        console.log("Saving Game Configuration:", config);
        alert("Configuration saved! Check the browser console to see the data.");
    };

    return (
        <>
            <AnimatePresence>
                {isMediaLibraryOpen && (
                    <MediaLibraryModal
                        onClose={() => setIsMediaLibraryOpen(false)}
                        onSelect={handleSelectPrizeImage}
                        filter="image"
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Game Configuration</h1>
                        <p className="text-slate-700 mt-1">Set up the rules and content for a new game session.</p>
                    </div>
                    <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                        <Save size={18} /> Save Configuration
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Select Question Banks (in order)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
                            <div className="col-span-1 md:col-span-3">
                                <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                    <input type="text" id="search" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border bg-white border-slate-300 rounded-lg text-slate-900"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="ageFilter" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
                                <select id="ageFilter" value={ageFilter} onChange={e => setAgeFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                                    <option value="all">All Ages</option>
                                    <option value="Kids (6-12)">Kids (6-12)</option>
                                    <option value="Teens (13-17)">Teens (13-17)</option>
                                    <option value="Adults (18+)">Adults (18+)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="categoryFilter" className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                                    <option value="all">All Categories</option>
                                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBanks.map(bank => {
                                const isSelected = selectedBankIds.includes(bank.id);
                                const order = isSelected ? selectedBankIds.indexOf(bank.id) + 1 : 0;
                                return (
                                    <BankSelectionCard 
                                        key={bank.id}
                                        bank={bank}
                                        isSelected={isSelected}
                                        order={order}
                                        onToggle={handleBankToggle}
                                    />
                                );
                            })}
                            {filteredBanks.length === 0 && (
                                <p className="col-span-full text-center text-slate-500 py-8">No question banks match your filters.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-8 border-t">
                        <PrizeLadderEditor value={prizeLadder} onChange={setPrizeLadder} onEditImage={handleEditPrizeImage} />
                    </div>

                    <div className="pt-8 border-t">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Configure Available Lifelines</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LifelineToggle label="50:50" icon={Zap} isEnabled={lifelines['50:50']} onToggle={handleLifelineToggle} />
                            <LifelineToggle label="Audience Poll" icon={Users} isEnabled={lifelines['Audience Poll']} onToggle={handleLifelineToggle} />
                            <LifelineToggle label="Expert Advice" icon={Lightbulb} isEnabled={lifelines['Expert Advice']} onToggle={handleLifelineToggle} />
                            <LifelineToggle label="Flip Question" icon={RefreshCw} isEnabled={lifelines['Flip Question']} onToggle={handleLifelineToggle} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}