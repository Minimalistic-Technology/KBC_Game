'use client';

import React, { useState } from 'react';
import type { PrizeLevel } from '@/lib/types1';
import { ImagePlus, X, Save, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface PrizeLadderEditorProps {
  value: PrizeLevel[];
  onChange: (value: PrizeLevel[]) => void;
  configId: string | null;
}

export const PrizeLadderEditor = ({ value, onChange, configId }: PrizeLadderEditorProps) => {
  const [pendingFiles, setPendingFiles] = useState<Record<number, File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<number, string | null>>({});
  const [savingLevelId, setSavingLevelId] = useState<number | null>(null);

  // -------------------- Update Level -------------------- //

  const handleUpdateLevel = (id: number, field: keyof PrizeLevel, val: any) => {
    onChange(
      value.map(level => {
        if (level.id === id) {
          const updated: PrizeLevel = { ...level, [field]: val } as PrizeLevel;

          // When switching type, reset value and clear media
          if (field === 'type') {
            updated.value = val === 'money' ? 0 : '';
            delete (updated as any).media;
          }

          return updated;
        }
        return level;
      })
    );
  };

  // -------------------- File Handlers -------------------- //

  const handleFileChange = (levelId: number, file: File | null) => {
    setPendingFiles(prev => ({ ...prev, [levelId]: file }));

    // revoke old preview
    if (previewUrls[levelId]) {
      URL.revokeObjectURL(previewUrls[levelId]!);
    }

    if (!file) {
      setPreviewUrls(prev => ({ ...prev, [levelId]: null }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [levelId]: preview }));
  };

  const handleRemoveImage = async (id: number) => {
    const level = value.find(l => l.id === id);
    if (!level) return;

    if (!configId) {
      alert('Config ID missing.');
      return;
    }

    if (!level.mongoId) {
      alert('Please save the config first.');
      return;
    }

    try {
      const { data } = await api.post('/api/v1/game-config/remove/PL-media', {
        configId,
        prizeLadderId: level.mongoId,
      });

      onChange(
        value.map(l =>
          l.id === id ? { ...l, media: undefined } : l
        )
      );

      setPendingFiles(prev => ({ ...prev, [id]: null }));
      setPreviewUrls(prev => ({ ...prev, [id]: null }));

      alert(data?.message || 'Image removed.');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to remove image.');
    }
  };

  // -------------------- Upload Image -------------------- //

  const handleSaveImage = async (level: PrizeLevel) => {
    if (!configId) return alert('Config ID missing.');
    if (!level.mongoId) return alert('Please save the config first.');

    const file = pendingFiles[level.id];
    if (!file) return alert('Choose an image first.');

    const formData = new FormData();
    formData.append('configId', configId);
    formData.append('prizeLadderId', level.mongoId);
    formData.append('value', String(level.value ?? '')); // gift description
    formData.append('file', file);

    try {
      setSavingLevelId(level.id);

      const { data } = await api.post('/api/v1/game-config/update/PL', formData);

      if (data?.media) {
        onChange(
          value.map(l =>
            l.id === level.id ? { ...l, media: data.media, type: 'gift' } : l
          )
        );
        setPreviewUrls(prev => ({ ...prev, [level.id]: data.media.url }));
      }

      setPendingFiles(prev => ({ ...prev, [level.id]: null }));
      alert('Gift image saved.');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to upload.');
    } finally {
      setSavingLevelId(null);
    }
  };

  // -------------------- UI -------------------- //

  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h3 className="text-lg font-bold mb-3 text-slate-900">Configure Prize Ladder</h3>

      <div className="space-y-2">
        {value.map((level, index) => {
          const hasPendingFile = !!pendingFiles[level.id];
          const preview = previewUrls[level.id] || level.media?.url || null;

          return (
            <div
              key={level.id}
              className={`p-3 rounded-lg border border-transparent transition-all ${level.isSafe ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                {/* Number */}
                <div className="flex items-center justify-between sm:justify-center w-full sm:w-8 shrink-0">
                  <span className="font-bold text-slate-500 text-sm">#{index + 1}</span>
                  {/* Mobile-only safe badge if needed, or keeping it simple */}
                </div>

                {/* Type */}
                <select
                  value={level.type}
                  onChange={e => handleUpdateLevel(level.id, 'type', e.target.value)}
                  className="w-full sm:w-32 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="money">Money</option>
                  <option value="gift">Gift</option>
                </select>

                {/* Value Input */}
                <input
                  type={level.type === 'money' ? 'number' : 'text'}
                  placeholder={level.type === 'money' ? 'Amount' : 'Gift Description'}
                  value={level.value}
                  onChange={e =>
                    handleUpdateLevel(
                      level.id,
                      'value',
                      level.type === 'money' ? Number(e.target.value) : e.target.value
                    )
                  }
                  className="w-full sm:flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />

                {/* Safe point */}
                <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto shrink-0 select-none">
                  <input
                    type="checkbox"
                    checked={level.isSafe}
                    onChange={e => handleUpdateLevel(level.id, 'isSafe', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Safe Point</span>
                </label>
              </div>

              {/* Gift Upload Section */}
              {level.type === 'gift' && (
                <div className="mt-3 sm:pl-11 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {/* Preview */}
                    <div className="w-10 h-10 rounded border bg-white overflow-hidden flex items-center justify-center shrink-0">
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus size={16} className="text-slate-400" />
                      )}
                    </div>

                    {/* Choose file */}
                    <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
                      <ImagePlus size={14} className="text-indigo-500" />
                      {hasPendingFile ? 'Change' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e =>
                          handleFileChange(level.id, e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    {/* Save */}
                    <button
                      onClick={() => handleSaveImage(level)}
                      disabled={!hasPendingFile || savingLevelId === level.id}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors ml-auto sm:ml-0"
                    >
                      {savingLevelId === level.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} /> Save
                        </>
                      )}
                    </button>

                    {/* Remove image */}
                    {(level.media || preview) && (
                      <button
                        onClick={() => handleRemoveImage(level.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors ml-2"
                        title="Remove Image"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
