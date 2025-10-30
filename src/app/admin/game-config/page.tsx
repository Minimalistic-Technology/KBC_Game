'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import type { PrizeLevel, Lifeline, MediaAsset, GameConfig, QuestionBank } from '@/lib/types1';
import { PrizeLadderEditor } from '../components/game-config/PrizeLadderEditor';
import { Save, Search, Zap, Users, Lightbulb, RefreshCw, Plus, Trash2, CheckCircle, Settings, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MediaLibraryModal } from '../components/media/MediaLibraryModal';
import { BankSelectionCard } from '../components/game-config/BankSelectionCard';
import { LifelineToggle } from '../components/game-config/LifelineToggle';

// --- TanStack Query & Axios ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios'; // Your axios instance
import axios from 'axios';

// --- API Helpers ---
import {
    backendToFrontend,
    backendListToFrontend,
    frontendToBackend,
    bankBackendToFrontend,
    BackendConfig,
    BackendConfigListItem,
    BackendQuestionBank
} from '@/lib/apiHelpers';

// --- ERROR HANDLING FUNCTION ---
const getErrorMessages = (error: unknown): string => {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Format Zod errors
        const messages = Object.keys(errors)
            .map(key => `${key}: ${errors[key].join(', ')}`)
            .join('\n');
        return `Validation Failed:\n${messages}`;
    }
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred.';
};


export default function GameConfigPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    // --- Local UI State ---
    const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
    const [currentFullConfig, setCurrentFullConfig] = useState<GameConfig | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [editingLevelId, setEditingLevelId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [ageFilter, setAgeFilter] = useState('adult');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIN');
        if (loggedIn !== 'true') {
            router.push('/auth/login');
        }
    }, [router]);


    // 1. Fetch the list of all configs
    const { data: configList, isLoading: isListLoading, error: listError } = useQuery({
        queryKey: ['gameConfigs'],
        queryFn: async () => {
            const { data } = await api.get<BackendConfigListItem[]>('/api/v1/game-config');
            return data.map(backendListToFrontend);
        },
    });

    // 2. Fetch the *full* details when a config is selected
    const { data: fullConfigData, isLoading: isEditorLoading, error: editorError } = useQuery({
        queryKey: ['gameConfig', selectedConfigId],
        queryFn: async () => {
            const { data } = await api.get<BackendConfig>(`/api/v1/game-config/${selectedConfigId}`);
            return backendToFrontend(data);
        },
        enabled: !!selectedConfigId,
    });

    // 3. Fetch all available question banks
    const { data: questionBanks, isLoading: isBanksLoading, error: banksError } = useQuery({
        queryKey: ['questionBanks'],
        queryFn: async () => {
            const { data } = await api.get<BackendQuestionBank[]>('/api/questions/banks');
            const allBanks = data.map(bankBackendToFrontend);
            // --- MODIFICATION: Only show question banks that have been published ---
            return allBanks.filter(bank => bank.status === 'Published');
        },
    });

    // --- Side effect to auto-select first config ---
    useEffect(() => {
        if (configList && !selectedConfigId && configList.length > 0) {
            const activeConfig = configList.find(c => c.isActive);
            setSelectedConfigId(activeConfig ? activeConfig.id : (configList[0]?.id || null));
        }
    }, [configList, selectedConfigId]);

    // Sync fetched data into local "form" state
    useEffect(() => {
        if (fullConfigData) {
            setCurrentFullConfig(fullConfigData);
        } else {
            setCurrentFullConfig(null);
        }
    }, [fullConfigData]);


    // --- Memos for Bank Filtering ---
    const allCategories = useMemo(() => {
        return [...new Set((questionBanks || []).flatMap(b => b.tags))]
    }, [questionBanks]);

    const filteredBanks = useMemo(() => {
        const banks = questionBanks || [];
        return banks.filter(bank => {
            const searchMatch = searchTerm === '' || bank.title.toLowerCase().startsWith(searchTerm.toLowerCase());
            const ageMatch = bank.ageGroup === ageFilter;
            const categoryMatch = categoryFilter === 'all' || bank.tags.includes(categoryFilter);
            return searchMatch && ageMatch && categoryMatch;
        });
    }, [questionBanks, searchTerm, ageFilter, categoryFilter]);


    // --- Local Editor State Updates ---
    const updateCurrentConfig = (field: keyof GameConfig, value: any) => {
        if (!currentFullConfig) return;
        setCurrentFullConfig(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleBankToggle = (id: string) => {
        if (!currentFullConfig) return;
        const currentSelection = currentFullConfig.selectedBankIds || [];
        const newSelection = currentSelection.includes(id)
            ? currentSelection.filter(bankId => bankId !== id)
            : [...currentSelection, id];
        updateCurrentConfig('selectedBankIds', newSelection);
    };

    const handleLifelineToggle = (label: keyof Lifeline) => {
        if (!currentFullConfig) return;
        const newLifelines = { ...currentFullConfig.lifelines, [label]: !currentFullConfig.lifelines[label] };
        updateCurrentConfig('lifelines', newLifelines);
    };

    const handlePrizeLadderChange = (newLadder: PrizeLevel[]) => {
        updateCurrentConfig('prizeLadder', newLadder);
    };

    // --- Media Library Functions ---
    const handleEditPrizeImage = (levelId: number) => {
        setEditingLevelId(levelId);
        setIsMediaLibraryOpen(true);
    };

    const handleSelectPrizeImage = (asset: MediaAsset) => {
        if (editingLevelId === null || !currentFullConfig) return;
        const newLadder = currentFullConfig.prizeLadder.map(level =>
            level.id === editingLevelId ? { ...level, media: asset } : level
        ) || [];
        updateCurrentConfig('prizeLadder', newLadder);
        setIsMediaLibraryOpen(false);
        setEditingLevelId(null);
    };



    // CREATE
    const createConfigMutation = useMutation({
        mutationFn: async (newConfigData: Omit<GameConfig, 'id'>) => {
            const { data } = await api.post<{ config: BackendConfig }>('/api/v1/game-config', frontendToBackend(newConfigData as GameConfig));
            return data.config;
        },
        onSuccess: (newBackendConfig) => {
            queryClient.invalidateQueries({ queryKey: ['gameConfigs'] });
            setSelectedConfigId(newBackendConfig._id);
        },
        onError: (err) => {
            alert(`Failed to create config:\n${getErrorMessages(err)}`);
        },
    });

    const updateConfigMutation = useMutation({
        mutationFn: async (configToSave: GameConfig) => {
            const { data } = await api.put(
                `/api/v1/game-config/${configToSave.id}`,
                frontendToBackend(configToSave)
            );
            return data;
        },
        onSuccess: (_, variables) => {
            alert('Changes saved successfully!');
            queryClient.invalidateQueries({ queryKey: ['gameConfigs'] });
            queryClient.invalidateQueries({ queryKey: ['gameConfig', variables.id] });
        },
        onError: (err) => {
            alert(`Failed to save:\n${getErrorMessages(err)}`);
        },
    });

    // DELETE
    const deleteConfigMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/api/v1/game-config/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gameConfigs'] });
            setSelectedConfigId(null);
        },
        onError: (err) => {
            alert(`Failed to delete:\n${getErrorMessages(err)}`);
        },
    });

    // SET ACTIVE
    const setActiveMutation = useMutation({
        mutationFn: (id: string) => api.put(`/api/v1/game-config/${id}`, { isActive: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gameConfigs'] });
        },
        onError: (err) => {
            alert(`Failed to set active:\n${getErrorMessages(err)}`);
        },
    });



    const handleNewConfig = () => {
        const newConfig: Omit<GameConfig, 'id'> = {
            name: 'Untitled Config',
            isActive: false,
            selectedBankIds: [],
            prizeLadder: [],
            lifelines: { '50:50': true, 'Audience Poll': true, 'Expert Advice': false, 'Flip Question': false },
        };
        createConfigMutation.mutate(newConfig);
    };

    const handleDeleteConfig = (id: string) => {
        if (window.confirm("Are you sure you want to delete this configuration?")) {
            deleteConfigMutation.mutate(id);
        }
    };

    const handleSetActive = (id: string) => {
        setActiveMutation.mutate(id);
    };

    const handleSaveConfig = () => {
        if (currentFullConfig) {
            updateConfigMutation.mutate(currentFullConfig);
        }
    };

    const isMutating =
        createConfigMutation.isPending ||
        updateConfigMutation.isPending ||
        deleteConfigMutation.isPending ||
        setActiveMutation.isPending;

    const error = listError || editorError || banksError;

    // --- Render ---

    return (
        <>
            <AnimatePresence>
                {isMediaLibraryOpen && (<MediaLibraryModal onClose={() => setIsMediaLibraryOpen(false)} onSelect={handleSelectPrizeImage} filter="image" />)}
            </AnimatePresence>

            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Game Configuration</h1>
                        <p className="text-slate-700 mt-1">Create and manage game sessions.</p>
                    </div>
                    <button
                        onClick={handleSaveConfig}
                        disabled={updateConfigMutation.isPending || !currentFullConfig}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {updateConfigMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {updateConfigMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {error && <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">{error.message}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- CONFIGURATION LIST SIDEBAR --- */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Configurations</h2>
                            <button onClick={handleNewConfig} disabled={createConfigMutation.isPending} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-indigo-600 disabled:opacity-50">
                                {createConfigMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                            </button>
                        </div>
                        {isListLoading ? (
                            <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin text-slate-400" /></div>
                        ) : (
                            <div className="space-y-2">
                                {configList?.map(config => (
                                    <div key={config.id} className={`group flex items-center justify-between p-3 rounded-lg border-2 transition-all ${selectedConfigId === config.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-50'}`}>
                                        <button onClick={() => setSelectedConfigId(config.id)} className="flex-grow text-left">
                                            <p className="font-semibold text-slate-800">{config.name}</p>
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {isMutating && <Loader2 size={16} className="animate-spin" />}
                                            {config.isActive ? (
                                                <span title="This is the active game configuration"><CheckCircle size={18} className="text-green-600" /></span>
                                            ) : (
                                                <button onClick={() => handleSetActive(config.id)} disabled={isMutating} title="Set as active" className="p-1 text-slate-400 hover:text-green-600 opacity-0 group-hover:opacity-100 disabled:opacity-100"><CheckCircle size={18} /></button>
                                            )}
                                            <button onClick={() => handleDeleteConfig(config.id)} disabled={isMutating} title="Delete" className="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 disabled:opacity-100"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- CONFIGURATION EDITOR --- */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 min-h-[500px]">
                        {isEditorLoading ? (
                            <div className="flex flex-col justify-center items-center text-center py-20">
                                <Loader2 size={48} className="mx-auto text-slate-300 animate-spin" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-800">Loading Configuration...</h3>
                            </div>
                        ) : currentFullConfig ? (
                            <>
                                <div>
                                    <label htmlFor="configName" className="text-sm font-medium text-slate-600">Configuration Name</label>
                                    <input type="text" id="configName" value={currentFullConfig.name || ''} onChange={(e) => updateCurrentConfig('name', e.target.value)} className="w-full text-2xl font-bold border-0 border-b-2 p-1 focus:ring-0 focus:border-indigo-500 text-slate-900" />
                                </div>
                                <div className="pt-6 border-t">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Select Question Banks (in order)</h3>
                                    {/* Bank filters */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
                                        <div className="col-span-1 md:col-span-3">
                                            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                                            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border bg-white border-slate-300 rounded-lg text-slate-900" /></div>
                                        </div>
                                        <div>
                                            <label htmlFor="ageFilter" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
                                            <select id="ageFilter" value={ageFilter} onChange={e => setAgeFilter(e.target.value)} className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900">
                                                <option value="adult">Adult</option>
                                                <option value="teen">Teen</option>
                                                <option value="child">Child</option>
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

                                    {/* Bank List Rendering */}
                                    {isBanksLoading ? (
                                        <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin text-slate-400" /></div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredBanks.map(bank => {
                                                const isSelected = currentFullConfig.selectedBankIds.includes(bank.id);
                                                const order = isSelected ? currentFullConfig.selectedBankIds.indexOf(bank.id) + 1 : 0;
                                                return <BankSelectionCard key={bank.id} bank={bank} isSelected={isSelected} order={order} onToggle={handleBankToggle} />;
                                            })}
                                            {filteredBanks.length === 0 && <p className="col-span-full text-center text-slate-500 py-8">No question banks match your filters.</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-8 border-t">
                                    <PrizeLadderEditor value={currentFullConfig.prizeLadder} onChange={handlePrizeLadderChange} onEditImage={handleEditPrizeImage} />
                                </div>
                                <div className="pt-8 border-t">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Configure Available Lifelines</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LifelineToggle label="50:50" icon={Zap} isEnabled={currentFullConfig.lifelines['50:50']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Audience Poll" icon={Users} isEnabled={currentFullConfig.lifelines['Audience Poll']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Expert Advice" icon={Lightbulb} isEnabled={currentFullConfig.lifelines['Expert Advice']} onToggle={handleLifelineToggle} />
                                        <LifelineToggle label="Flip Question" icon={RefreshCw} isEnabled={currentFullConfig.lifelines['Flip Question']} onToggle={handleLifelineToggle} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center text-center py-20">
                                <Settings size={48} className="mx-auto text-slate-300" />
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