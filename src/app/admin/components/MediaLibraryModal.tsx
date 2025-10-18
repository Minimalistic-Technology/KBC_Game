'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Film, Image as ImageIcon, Music } from 'lucide-react';
import { mockMediaLibrary } from '@/lib/media';
import type { MediaAsset } from '@/lib/types';

// --- UPDATED: Component now accepts 'filter' prop ---
interface MediaLibraryModalProps {
    onClose: () => void;
    onSelect: (asset: MediaAsset) => void;
    filter?: MediaAsset['type'] | 'all';
}

export const MediaLibraryModal = ({ onClose, onSelect, filter = 'all' }: MediaLibraryModalProps) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // --- NEW: Filter the library based on the prop ---
  const filteredMedia = useMemo(() => {
    if (filter === 'all') return mockMediaLibrary;
    return mockMediaLibrary.filter(asset => asset.type === filter);
  }, [filter]);

  const handleSelect = () => {
    const asset = filteredMedia.find(a => a.id === selectedAssetId);
    if (asset) {
      onSelect(asset);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Media Library</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><X /></button>
        </div>

        <div className="flex-grow p-5 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map(asset => (
              <button key={asset.id} onClick={() => setSelectedAssetId(asset.id)} className="relative aspect-square rounded-lg overflow-hidden group border-2 transition-all data-[selected=true]:border-indigo-600 data-[selected=true]:ring-2 ring-indigo-400" data-selected={selectedAssetId === asset.id}>
                {asset.type === 'image' && <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover" />}
                {asset.type === 'video' && <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Film className="h-12 w-12 text-slate-500" /></div>}
                {asset.type === 'audio' && <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Music className="h-12 w-12 text-slate-500" /></div>}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                   <p className="text-white text-xs font-medium truncate">{asset.fileName}</p>
                </div>
                {selectedAssetId === asset.id && <CheckCircle className="absolute top-2 right-2 h-6 w-6 text-white bg-indigo-600 rounded-full p-0.5" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 font-semibold text-slate-700 bg-white rounded-lg border hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={handleSelect} disabled={!selectedAssetId} className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">Select Asset</button>
        </div>
      </motion.div>
    </motion.div>
  );
};