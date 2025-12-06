'use client';

import React from 'react';

interface PreviewProps {
  data: Record<string, string>[];
}

export const ImportPreview = ({ data }: PreviewProps) => {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const previewData = data.slice(0, 5);

  return (
    <div className="pt-8 border-t">
      <h3 className="text-lg font-bold text-slate-900">Data Preview (First 5 Rows)</h3>
      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
            <tr>
              {headers.map(header => (
                <th key={header} scope="col" className="px-6 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b hover:bg-slate-50">
                {headers.map(header => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 truncate max-w-xs">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};