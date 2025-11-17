
// 'use client';

// import { FileQuestion, ImageIcon, CheckCircle, Edit, Trash2, Tag, FileEdit } from 'lucide-react';
// import type { Question } from '@/lib/types';
// import React, { useState, useEffect, useMemo } from 'react';

// interface SidebarProps {
//   question: Question | null;
//   onDelete: (_id: string) => void;
//   onEdit: () => void;
// }

// const DetailItem = ({
//   icon: Icon,
//   label,
//   children,
// }: {
//   icon: React.ElementType;
//   label: string;
//   children: React.ReactNode;
// }) => (
//   <div>
//     <span className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2">
//       <Icon size={14} />
//       {label}
//     </span>
//     <div className="text-sm text-slate-800">{children}</div>
//   </div>
// );

// export const QuestionDetailSidebar = ({ question, onDelete, onEdit }: SidebarProps) => {
//   if (!question) {
//     return (
//       <div className="hidden lg:flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
//         <FileQuestion className="h-16 w-16 text-slate-300" />
//         <h3 className="mt-4 text-lg font-semibold text-slate-800">Select a Question</h3>
//         <p className="mt-1 text-sm text-slate-500">
//           Choose a question from the list to see its details.
//         </p>
//       </div>
//     );
//   }

//   const { status, mediaRef, lang } = question as any;
//   const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'gu'>('en');

//   useEffect(() => {
//     setActiveLang('en');
//   }, [question?._id]);

//   // 🔹 Block for active language
//   const block = lang?.[activeLang] || {};
//   const options =
//     Array.isArray(block.options) && block.options.length > 0
//       ? block.options.map((o: any) => (typeof o === 'string' ? o : o.text))
//       : [];

//   const categories = block.categories || [];

//   // ⭐ NEW: compute the correct option index once
//   const correctOptionIndex = useMemo(() => {
//     const q: any = question;

//     // 1) If backend already gives an index, use it
//     if (typeof q.correctOptionIndex === 'number') {
//       return q.correctOptionIndex; // 0,1,2,3
//     }

//     // 2) If backend gives a letter: 'A' | 'B' | 'C' | 'D'
//     if (typeof q.correctOption === 'string') {
//       const idx = 'ABCD'.indexOf(q.correctOption.toUpperCase());
//       if (idx !== -1) return idx;
//     }

//     // 3) Fallback (old style): derive from English text
//     if (lang?.en?.options && q.answer) {
//       const enOptions = lang.en.options.map((o: any) =>
//         typeof o === 'string' ? o : o.text
//       );
//       const idx = enOptions.findIndex((o: string) => o === q.answer);
//       return idx === -1 ? null : idx;
//     }

//     return null;
//   }, [question, lang]);

//   const StatusBadge = () => (
//     <span
//       className={`inline-flex items-center gap-1.5 text-xs font-bold capitalize px-3 py-1 rounded-full ${
//         status === 'Published'
//           ? 'bg-green-100 text-green-800'
//           : 'bg-yellow-100 text-yellow-800'
//       }`}
//     >
//       {status === 'Published' ? <CheckCircle size={12} /> : <FileEdit size={12} />}
//       {status}
//     </span>
//   );

//   return (
//     <div className="hidden lg:flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200">
//       {/* Header */}
//       <div className="p-6 border-b flex justify-between items-center">
//         <h3 className="text-lg font-bold text-slate-900">Details ..</h3>

//         {/* Language Tabs */}
//         <div className="flex gap-1">
//           {(['en', 'hi', 'gu'] as const).map((k) => {
//             const exists = !!lang?.[k]?.text;
//             return (
//               <button
//                 key={k}
//                 type="button"
//                 onClick={() => setActiveLang(k)}
//                 disabled={!exists}
//                 className={`px-2 py-1 text-xs rounded-md border transition-all ${
//                   activeLang === k
//                     ? 'bg-indigo-600 text-white border-indigo-600'
//                     : exists
//                     ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
//                     : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
//                 }`}
//               >
//                 {k.toUpperCase()}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-grow p-6 space-y-6 overflow-y-auto">
//         {/* Question text */}
//         <div>
//           <span className="text-sm font-semibold text-slate-500">
//             Question ({activeLang.toUpperCase()})
//           </span>
//           {block?.text ? (
//             <p className="mt-1 text-slate-800 font-medium">{block.text}</p>
//           ) : (
//             <p className="mt-1 text-slate-500 italic">
//               No {activeLang.toUpperCase()} translation available
//             </p>
//           )}
//         </div>

//         {/* Media (unchanged) */}
//        <DetailItem icon={ImageIcon} label="Media">
//                     {mediaRef?.url ? (
//                         mediaRef.type.startsWith('image') ? (
//                             <img
//                                 src={mediaRef.url}
//                                 alt="Question media"
//                                 className="mt-2 w-full h-40 object-cover rounded-lg border"
//                                 loading="lazy"
//                                 onError={(e) => (e.currentTarget.src = '/placeholder.png')}
//                             />
//                         ) : mediaRef.type.startsWith('video') ? (
//                             <video
//                                 src={mediaRef.url}
//                                 className="mt-2 w-full h-40 rounded-lg border object-cover"
//                                 controls
//                             />
//                         ) : mediaRef.type.startsWith('audio') ? (
//                             <audio src={mediaRef.url} className="mt-2 w-full" controls />
//                         ) : (
//                             <div className="mt-2 flex items-center justify-center h-40 rounded-lg bg-slate-100 border border-dashed">
//                                 <p className="text-xs text-slate-500">Unsupported media type</p>
//                             </div>
//                         )
//                     ) : (
//                         <div className="mt-2 flex items-center justify-center h-40 rounded-lg bg-slate-100 border border-dashed">
//                             <p className="text-xs text-slate-500">No media attached</p>
//                         </div>
//                     )}
//                 </DetailItem>

//         {/* Options */}
//         <div>
//           <span className="text-sm font-semibold text-slate-500">
//             Options ({activeLang.toUpperCase()})
//           </span>
//           {options.length > 0 ? (
//             <ul className="mt-2 space-y-2">
//               {options.map((opt: string, index: number) => {
//                 const isCorrect =
//                   correctOptionIndex !== null && index === correctOptionIndex;

//                 return (
//                   <li
//                     key={index}
//                     className={`flex items-center gap-3 text-sm p-3 rounded-md ${
//                       isCorrect
//                         ? 'bg-green-100 text-green-900 font-semibold'
//                         : 'bg-slate-100 text-slate-700'
//                     }`}
//                   >
//                     {isCorrect && (
//                       <CheckCircle
//                         size={16}
//                         className="text-green-600 flex-shrink-0"
//                       />
//                     )}
//                     <span>{opt || `Option ${index + 1}`}</span>
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="mt-2 text-xs text-slate-500 italic">
//               No {activeLang.toUpperCase()} options available
//             </p>
//           )}
//         </div>

//        <div className="pt-4 border-t space-y-5">
//                     <DetailItem icon={CheckCircle} label="Status">
//                         <StatusBadge />
//                     </DetailItem>

//                     <DetailItem icon={Tag} label={`Tags (${activeLang.toUpperCase()})`}>
//                         {categories && categories.length > 0 ? (
//                             <div className="flex flex-wrap gap-2">
//                                 {categories.map((cat: string) => (
//                                     <span
//                                         key={cat}
//                                         className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
//                                     >
//                                         {cat}
//                                     </span>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-xs text-slate-500 italic">
//                                 No {activeLang.toUpperCase()} tags assigned
//                             </p>
//                         )}
//                     </DetailItem>
//                 </div>
//       </div>

//       <div className="p-4 bg-slate-50 border-t flex gap-3">
//                 <button
//                     onClick={onEdit}
//                     className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
//                 >
//                     <Edit size={16} /> Edit
//                 </button>
//                 <button
//                     onClick={() => onDelete(question._id!)}
//                     className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border h-10 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-200"
//                 >
//                     <Trash2 size={16} /> Delete
//                 </button>
//             </div>
//     </div>
//   );
// };


'use client';

import {
  FileQuestion,
  ImageIcon,
  CheckCircle,
  Edit,
  Trash2,
  Tag,
  FileEdit,
} from 'lucide-react';
import type { Question } from '@/lib/types';
import React, { useState, useEffect, useMemo } from 'react';

interface SidebarProps {
  question: Question | null;
  onDelete: (_id: string) => void;
  onEdit: () => void;
}

const DetailItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <span className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2">
      <Icon size={14} />
      {label}
    </span>
    <div className="text-sm text-slate-800">{children}</div>
  </div>
);

export const QuestionDetailSidebar = ({ question, onDelete, onEdit }: SidebarProps) => {
  // 🔹 Hooks MUST be called on every render
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'gu'>('en');

  useEffect(() => {
    // whenever question changes, reset language to EN
    setActiveLang('en');
  }, [question?._id]);

  // 🔹 Safe access to fields even when question is null
  const qAny = (question || {}) as any;
  const status = qAny.status;
  const mediaRef = qAny.mediaRef;
  const lang = qAny.lang || {};

  const block = lang?.[activeLang] || {};
  const options =
    Array.isArray(block.options) && block.options.length > 0
      ? block.options.map((o: any) => (typeof o === 'string' ? o : o.text))
      : [];

  const categories = block.categories || [];

  // ⭐ Compute correct option index once (position-based)
  const correctOptionIndex = useMemo(() => {
    // 1) If backend already gives an index, use it
    if (typeof qAny.correctOptionIndex === 'number') {
      return qAny.correctOptionIndex; // 0,1,2,3
    }

    // 2) If backend gives a letter: 'A' | 'B' | 'C' | 'D'
    if (typeof qAny.correctOption === 'string') {
      const idx = 'ABCD'.indexOf(qAny.correctOption.toUpperCase());
      if (idx !== -1) return idx;
    }

    // 3) Fallback (old style): derive from English text
    if (lang?.en?.options && qAny.answer) {
      const enOptions = lang.en.options.map((o: any) =>
        typeof o === 'string' ? o : o.text
      );
      const idx = enOptions.findIndex((o: string) => o === qAny.answer);
      return idx === -1 ? null : idx;
    }

    return null;
  }, [lang, qAny.correctOptionIndex, qAny.correctOption, qAny.answer]);

  const StatusBadge = () => (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold capitalize px-3 py-1 rounded-full ${
        status === 'Published'
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status === 'Published' ? <CheckCircle size={12} /> : <FileEdit size={12} />}
      {status}
    </span>
  );

  // 🔹 Now we can safely early-return for "no question" state
  if (!question) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
        <FileQuestion className="h-16 w-16 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-800">Select a Question</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose a question from the list to see its details.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Details</h3>

        {/* Language Tabs */}
        <div className="flex gap-1">
          {(['en', 'hi', 'gu'] as const).map((k) => {
            const exists = !!lang?.[k]?.text;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActiveLang(k)}
                disabled={!exists}
                className={`px-2 py-1 text-xs rounded-md border transition-all ${
                  activeLang === k
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : exists
                    ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                {k.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {/* Question text */}
        <div>
          <span className="text-sm font-semibold text-slate-500">
            Question ({activeLang.toUpperCase()})
          </span>
          {block?.text ? (
            <p className="mt-1 text-slate-800 font-medium">{block.text}</p>
          ) : (
            <p className="mt-1 text-slate-500 italic">
              No {activeLang.toUpperCase()} translation available
            </p>
          )}
        </div>

        {/* Media (old logic kept) */}
        <DetailItem icon={ImageIcon} label="Media">
          {mediaRef?.url ? (
            mediaRef.type?.startsWith('image') ? (
              <img
                src={mediaRef.url}
                alt="Question media"
                className="mt-2 w-full h-40 object-cover rounded-lg border"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
            ) : mediaRef.type?.startsWith('video') ? (
              <video
                src={mediaRef.url}
                className="mt-2 w-full h-40 rounded-lg border object-cover"
                controls
              />
            ) : mediaRef.type?.startsWith('audio') ? (
              <audio src={mediaRef.url} className="mt-2 w-full" controls />
            ) : (
              <div className="mt-2 flex items-center justify-center h-40 rounded-lg bg-slate-100 border border-dashed">
                <p className="text-xs text-slate-500">Unsupported media type</p>
              </div>
            )
          ) : (
            <div className="mt-2 flex items-center justify-center h-40 rounded-lg bg-slate-100 border border-dashed">
              <p className="text-xs text-slate-500">No media attached</p>
            </div>
          )}
        </DetailItem>

        {/* Options */}
        <div>
          <span className="text-sm font-semibold text-slate-500">
            Options ({activeLang.toUpperCase()})
          </span>
          {options.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {options.map((opt: string, index: number) => {
                const isCorrect =
                  correctOptionIndex !== null && index === correctOptionIndex;

                return (
                  <li
                    key={index}
                    className={`flex items-center gap-3 text-sm p-3 rounded-md ${
                      isCorrect
                        ? 'bg-green-100 text-green-900 font-semibold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isCorrect && (
                      <CheckCircle
                        size={16}
                        className="text-green-600 flex-shrink-0"
                      />
                    )}
                    <span>{opt || `Option ${index + 1}`}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500 italic">
              No {activeLang.toUpperCase()} options available
            </p>
          )}
        </div>

        {/* Status + Tags */}
        <div className="pt-4 border-t space-y-5">
          <DetailItem icon={CheckCircle} label="Status">
            <StatusBadge />
          </DetailItem>

          <DetailItem icon={Tag} label={`Tags (${activeLang.toUpperCase()})`}>
            {categories && categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No {activeLang.toUpperCase()} tags assigned
              </p>
            )}
          </DetailItem>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-4 bg-slate-50 border-t flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(question._id!)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border h-10 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-200"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};
