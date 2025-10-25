'use client';

import React, { useState, useMemo } from 'react';
import { initialBanks } from '@/lib/data';
import { savedGameConfigs, activeGameConfigId as initialActiveId } from '@/lib/gameConfig';
import type { PrizeLevel, Lifeline, MediaAsset, GameConfig } from '@/lib/types1';
import { PrizeLadderEditor } from '../components/Game-config/PrizeLadderEditor';
import { Save, Search, Zap, Users, Lightbulb, RefreshCw, Plus, Trash2, CheckCircle, Settings } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MediaLibraryModal } from '../components/Media/MediaLibraryModal';
import { BankSelectionCard } from '../components/Game-config/BankSelectionCard';
import { LifelineToggle } from '../components/Game-config/LifelineToggle';

export default function GameConfigPage() {
    const [allConfigs, setAllConfigs] = useState<GameConfig[]>(savedGameConfigs);
    const [activeConfigId, setActiveConfigId] = useState(initialActiveId);
    const [selectedConfigId, setSelectedConfigId] = useState<string | null>(initialActiveId);
    
    const currentConfig = useMemo(() => allConfigs.find(c => c.id === selectedConfigId), [selectedConfigId, allConfigs]);

    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [editingLevelId, setEditingLevelId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [ageFilter, setAgeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    const allCategories = useMemo(() => [...new Set(initialBanks.flatMap(b => b.tags))], []);

    const filteredBanks = useMemo(() => {
        return initialBanks.filter(bank => {
            const searchMatch = searchTerm === '' || bank.title.toLowerCase().startsWith(searchTerm.toLowerCase());
            const ageMatch = ageFilter === 'all' || bank.ageGroup === ageFilter;
            const categoryMatch = categoryFilter === 'all' || bank.tags.includes(categoryFilter);
            return searchMatch && ageMatch && categoryMatch;
        });
    }, [searchTerm, ageFilter, categoryFilter]);
    
    const updateCurrentConfig = (field: keyof GameConfig, value: any) => {
        if (!currentConfig) return;
        const updatedConfig = { ...currentConfig, [field]: value };
        setAllConfigs(prev => prev.map(c => c.id === currentConfig.id ? updatedConfig : c));
    };

    const handleBankToggle = (id: string) => {
        if (!currentConfig) return;
        const currentSelection = currentConfig.selectedBankIds || [];
        const newSelection = currentSelection.includes(id) 
            ? currentSelection.filter(bankId => bankId !== id)
            : [...currentSelection, id];
        updateCurrentConfig('selectedBankIds', newSelection);
    };
    
    const handleLifelineToggle = (label: keyof Lifeline) => {
        if (!currentConfig) return;
        const newLifelines = { ...currentConfig.lifelines, [label]: !currentConfig.lifelines[label] };
        updateCurrentConfig('lifelines', newLifelines);
    };

    const handlePrizeLadderChange = (newLadder: PrizeLevel[]) => {
        updateCurrentConfig('prizeLadder', newLadder);
    };
    
    const handleEditPrizeImage = (levelId: number) => {
        setEditingLevelId(levelId);
        setIsMediaLibraryOpen(true);
    };

    const handleSelectPrizeImage = (asset: MediaAsset) => {
        if (editingLevelId === null) return;
        const newLadder = currentConfig?.prizeLadder.map(level => 
            level.id === editingLevelId ? { ...level, media: asset } : level
        ) || [];
        updateCurrentConfig('prizeLadder', newLadder);
        setIsMediaLibraryOpen(false);
        setEditingLevelId(null);
    };

    const handleNewConfig = () => {
        const newConfig: GameConfig = {
            id: `config_${Date.now()}`,
            name: 'Untitled Config',
            selectedBankIds: [],
            prizeLadder: [],
            lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': false },
        };
        setAllConfigs(prev => [...prev, newConfig]);
        setSelectedConfigId(newConfig.id);
    };

    const handleDeleteConfig = (id: string) => {
        if (window.confirm("Are you sure you want to delete this configuration?")) {
            setAllConfigs(prev => prev.filter(c => c.id !== id));
            if (selectedConfigId === id) {
                setSelectedConfigId(allConfigs.length > 1 ? allConfigs[0].id : null);
            }
        }
    };

    const handleSave = () => {
        console.log("Saving all configurations:", allConfigs);
        console.log("Active configuration ID:", activeConfigId);
        alert("All changes saved! Check the browser console to see the data.");
    };

    return (
        <>
            <AnimatePresence>
                {isMediaLibraryOpen && ( <MediaLibraryModal onClose={() => setIsMediaLibraryOpen(false)} onSelect={handleSelectPrizeImage} filter="image"/> )}
            </AnimatePresence>

            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Game Configuration</h1>
                        <p className="text-slate-700 mt-1">Create and manage game sessions.</p>
                    </div>
                    <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                        <Save size={18} /> Save All Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- CONFIGURATION LIST SIDEBAR --- */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Configurations</h2>
                            <button onClick={handleNewConfig} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-indigo-600"><Plus size={20} /></button>
                        </div>
                        <div className="space-y-2">
                            {allConfigs.map(config => (
                                <div key={config.id} className={`group flex items-center justify-between p-3 rounded-lg border-2 transition-all ${selectedConfigId === config.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-50'}`}>
                                    <button onClick={() => setSelectedConfigId(config.id)} className="flex-grow text-left">
                                        <p className="font-semibold text-slate-800">{config.name}</p>
                                        <p className="text-xs text-slate-500">{config.selectedBankIds.length} banks selected</p>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {activeConfigId === config.id ? (
                                            <span title="This is the active game configuration"><CheckCircle size={18} className="text-green-600" /></span>
                                        ) : (
                                            <button onClick={() => setActiveConfigId(config.id)} title="Set as active" className="p-1 text-slate-400 hover:text-green-600 opacity-0 group-hover:opacity-100"><CheckCircle size={18} /></button>
                                        )}
                                        <button onClick={() => handleDeleteConfig(config.id)} title="Delete" className="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CONFIGURATION EDITOR --- */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
                        {currentConfig ? (
                            <>
                                <div>
                                    <label htmlFor="configName" className="text-sm font-medium text-slate-600">Configuration Name</label>
                                    <input type="text" id="configName" value={currentConfig.name} onChange={(e) => updateCurrentConfig('name', e.target.value)} className="w-full text-2xl font-bold border-0 border-b-2 p-1 focus:ring-0 focus:border-indigo-500 text-slate-900"/>
                                </div>
                                <div className="pt-6 border-t">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Select Question Banks (in order)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
                                        <div className="col-span-1 md:col-span-3">
                                            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                                            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/><input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border bg-white border-slate-300 rounded-lg text-slate-900"/></div>
                                        </div>
                                        <div><label htmlFor="ageFilter" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label><select id="ageFilter" value={ageFilter} onChange={e => setAgeFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900"><option value="all">All Ages</option><option value="Kids (6-12)">Kids (6-12)</option><option value="Teens (13-17)">Teens (13-17)</option><option value="Adults (18+)">Adults (18+)</option></select></div>
                                        <div><label htmlFor="categoryFilter" className="block text-sm font-medium text-slate-700 mb-2">Category</label><select id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900"><option value="all">All Categories</option>{allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredBanks.map(bank => {
                                            const isSelected = currentConfig.selectedBankIds.includes(bank.id);
                                            const order = isSelected ? currentConfig.selectedBankIds.indexOf(bank.id) + 1 : 0;
                                            return <BankSelectionCard key={bank.id} bank={bank} isSelected={isSelected} order={order} onToggle={handleBankToggle} />;
                                        })}
                                        {filteredBanks.length === 0 && <p className="col-span-full text-center text-slate-500 py-8">No question banks match your filters.</p>}
                                    </div>
                                </div>
                                <div className="pt-8 border-t"><PrizeLadderEditor value={currentConfig.prizeLadder} onChange={handlePrizeLadderChange} onEditImage={handleEditPrizeImage} /></div>
                                <div className="pt-8 border-t">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Configure Available Lifelines</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LifelineToggle label="50:50" icon={Zap} isEnabled={currentConfig.lifelines['50:50']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Audience Poll" icon={Users} isEnabled={currentConfig.lifelines['Audience Poll']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Expert Advice" icon={Lightbulb} isEnabled={currentConfig.lifelines['Expert Advice']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Flip Question" icon={RefreshCw} isEnabled={currentConfig.lifelines['Flip Question']} onToggle={handleLifelineToggle} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <Settings size={48} className="mx-auto text-slate-300"/>
                                <h3 className="mt-4 text-lg font-semibold text-slate-800">No Configuration Selected</h3>
                                <p className="mt-1 text-slate-500">Select a configuration from the list or create a new one to begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}