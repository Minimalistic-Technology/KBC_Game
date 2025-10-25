'use client';

import React from 'react';
import type { PrizeLevel } from '@/lib/types1';
import { Plus, Trash2, ImagePlus, X } from 'lucide-react';

interface PrizeLadderEditorProps {
  value: PrizeLevel[];
  onChange: (value: PrizeLevel[]) => void;
  onEditImage: (levelId: number) => void;
}

export const PrizeLadderEditor = ({ value, onChange, onEditImage }: PrizeLadderEditorProps) => {
  const handleAddLevel = () => {
    const newLevelNumber = value.length > 0 ? Math.max(...value.map(l => l.level)) + 1 : 1;
    onChange([...value, { id: Date.now(), level: newLevelNumber, type: 'money', value: 0, isSafe: false }]);
  };

  const handleRemoveLevel = (id: number) => {
    onChange(value.filter(level => level.id !== id));
  };
  
  const handleUpdateLevel = (id: number, field: keyof PrizeLevel, fieldValue: any) => {
    onChange(value.map(level => {
        if (level.id === id) {
            const updatedLevel = { ...level, [field]: fieldValue };
            if (field === 'type') {
                updatedLevel.value = fieldValue === 'money' ? 0 : '';
                delete updatedLevel.media;
            }
            return updatedLevel;
        }
        return level;
    }));
  };

  const handleRemoveImage = (levelId: number) => {
    onChange(value.map(level => {
      if (level.id === levelId) {
        const { media, ...rest } = level;
        return rest;
      }
      return level;
    }));
  };
  
  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-900">Configure Prize Ladder</h3>
      </div>
      <div className="space-y-2">
        {value.map((level, index) => (
          <div key={level.id} className={`p-2 rounded-md ${level.isSafe ? 'bg-indigo-100' : ''}`}>
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-1 font-bold text-slate-500 text-center">{index + 1}</span>
              <select value={level.type} onChange={(e) => handleUpdateLevel(level.id, 'type', e.target.value as 'money' | 'gift')} className="col-span-3 w-full px-2 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900">
                  <option value="money">Money</option>
                  <option value="gift">Gift</option>
              </select>
              <input type={level.type === 'money' ? 'number' : 'text'} placeholder={level.type === 'money' ? 'Amount' : 'Gift Description'} value={level.value} onChange={(e) => handleUpdateLevel(level.id, 'value', level.type === 'money' ? Number(e.target.value) : e.target.value)} className="col-span-4 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900" />
              <label className="col-span-3 flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={level.isSafe} onChange={(e) => handleUpdateLevel(level.id, 'isSafe', e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                Safe Point
              </label>
              <button type="button" onClick={() => handleRemoveLevel(level.id)} className="col-span-1 p-2 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
            {level.type === 'gift' && (
              <div className="col-start-2 col-span-11 mt-2 pl-14">
                {level.media ? (
                  <div className="flex items-center gap-2">
                    <img src={level.media.url} alt="Gift" className="w-10 h-10 rounded-md object-cover border"/>
                    <span className="text-sm text-slate-600 truncate">{level.media.fileName}</span>
                    <button onClick={() => handleRemoveImage(level.id)} className="ml-auto p-1 text-slate-400 hover:text-red-600"><X size={14}/></button>
                  </div>
                ) : (
                  <button onClick={() => onEditImage(level.id)} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-100/50 px-3 py-1.5 rounded-md hover:bg-indigo-100">
                    <ImagePlus size={14} /> Add Image
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddLevel} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"><Plus size={16} /> Add Level</button>
    </div>
  );
};