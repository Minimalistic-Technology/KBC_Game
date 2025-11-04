'use client';

import React, { useState } from 'react';
import { Trash2, Image, Film, Music, Scaling } from 'lucide-react'; // Added Music icon
import type { MediaAsset, DerivedFormat } from '@/lib/types';

interface MediaPreviewProps {
  asset: MediaAsset;
  onRemove: () => void;
  onDefaultFormatChange: (format: DerivedFormat) => void;
}

export const MediaPreview = ({ asset, onRemove, onDefaultFormatChange }: MediaPreviewProps) => {
  const [defaultFormat, setDefaultFormat] = useState<DerivedFormat | null>(asset.derivedFormats[0] || null);

  const handleFormatChange = (format: DerivedFormat) => {
    setDefaultFormat(format);
    onDefaultFormatChange(format);
  };
  
  return (
    <div className="relative group w-full rounded-lg border bg-slate-50 overflow-hidden">
      <div className="aspect-video bg-slate-200 flex items-center justify-center">
        {asset.type === 'image' && <img src={asset.url} alt="Media preview" className="w-full h-full object-contain" />}
        {asset.type === 'video' && <Film className="h-16 w-16 text-slate-400" />}
        {asset.type === 'audio' && <Music className="h-16 w-16 text-slate-400" />}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    {asset.type === 'image' && <Image size={16}/>}
                    {asset.type === 'video' && <Film size={16}/>}
                    {asset.type === 'audio' && <Music size={16}/>}
                    <span className="truncate">{asset.fileName}</span>
                </div>
            </div>
            <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-red-600 backdrop-blur-sm hover:bg-red-50">
                <Trash2 size={14} /> Remove
            </button>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Scaling size={14} /> Available Formats</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {asset.derivedFormats.map(format => (
              <button key={format.name} onClick={() => handleFormatChange(format)} className="px-3 py-1 text-xs font-semibold rounded-full transition-colors data-[selected=true]:bg-indigo-600 data-[selected=true]:text-white data-[selected=false]:bg-white data-[selected=false]:text-slate-700 data-[selected=false]:border" data-selected={defaultFormat?.name === format.name}>
                {asset.type === 'image' ? `${format.name} (${format.resolution})` : format.resolution}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Select a default playback resolution or quality.</p>
        </div>
      </div>
    </div>
  );
};