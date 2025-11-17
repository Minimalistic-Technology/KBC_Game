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

  const handleRemoveImage = (id: number) => {
    onChange(
      value.map(level =>
        level.id === id ? { ...level, media: undefined } : level
      )
    );

    setPendingFiles(prev => ({ ...prev, [id]: null }));
    setPreviewUrls(prev => ({ ...prev, [id]: null }));
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
              className={`p-2 rounded-md ${level.isSafe ? 'bg-indigo-100' : ''}`}
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Number */}
                <span className="col-span-1 text-center font-semibold text-slate-500">
                  {index + 1}
                </span>

                {/* Type */}
                <select
                  value={level.type}
                  onChange={e => handleUpdateLevel(level.id, 'type', e.target.value)}
                  className="col-span-3 px-2 py-2 border rounded-lg bg-white"
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
                  className="col-span-4 px-3 py-2 border rounded-lg"
                />

                {/* Safe point */}
                <label className="col-span-3 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={level.isSafe}
                    onChange={e => handleUpdateLevel(level.id, 'isSafe', e.target.checked)}
                  />
                  Safe Point
                </label>

                {/* Remove level column (kept empty so user can't delete) */}
                <div className="col-span-1" />
              </div>

              {/* Gift Upload Section */}
              {level.type === 'gift' && (
                <div className="mt-3 pl-14 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {/* Preview */}
                    <div className="w-10 h-10 rounded border bg-slate-50 overflow-hidden flex items-center justify-center">
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus size={16} className="text-slate-400" />
                      )}
                    </div>

                    {/* Choose file */}
                    <label className="px-3 py-1.5 bg-indigo-100 text-indigo-600 text-xs rounded flex items-center gap-1 cursor-pointer">
                      <ImagePlus size={14} />
                      {hasPendingFile ? 'Change Image' : 'Choose Image'}
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
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
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
                        className="ml-auto text-red-500"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No "Add Level" button anymore → length controlled by parent */}
    </div>
  );
};
