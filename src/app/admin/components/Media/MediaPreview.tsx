'use client';

import React from 'react';
import { Trash2, Image, Film, Music } from 'lucide-react';
import type { MediaAsset } from '@/lib/types';

interface MediaPreviewProps {
  asset: MediaAsset;
  onRemove: () => void;
}

export const MediaPreview = ({ asset, onRemove }: MediaPreviewProps) => {
  return (
    <div className="relative group w-full rounded-lg border bg-slate-50 overflow-hidden">
      <div className="aspect-video bg-slate-200 flex items-center justify-center">
        {asset.type === 'image' && (
          <img
            src={asset.url}
            alt="Media preview"
            className="w-full h-full object-contain"
          />
        )}

        {asset.type === 'video' && (
          <Film className="h-16 w-16 text-slate-400" />
        )}

        {asset.type === 'audio' && (
          <Music className="h-16 w-16 text-slate-400" />
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              {asset.type === 'image' && <Image size={16} />}
              {asset.type === 'video' && <Film size={16} />}
              {asset.type === 'audio' && <Music size={16} />}

              <span className="truncate">{asset.fileName}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-red-600 backdrop-blur-sm hover:bg-red-50"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};
