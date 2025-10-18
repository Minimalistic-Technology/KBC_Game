'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Download, Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

export const Filters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();

  const currentView = searchParams.get('view') || 'all';

  const [date, setDate] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (date?.from) {
      params.set('startDate', format(date.from, 'yyyy-MM-dd'));
    } else {
      params.delete('startDate');
    }

    if (date?.to) {
      params.set('endDate', format(date.to, 'yyyy-MM-dd'));
    } else {
      params.delete('endDate');
    }
    replace(`${pathname}?${params.toString()}`);
    
    if(date?.from && date?.to) {
      setShowCalendar(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);


  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClearFilters = () => {
    router.push(pathname);
  };
  
  // ... other handlers ...

  return (
    <div>
      {/* --- View Toggle --- */}
      <div className="flex items-center gap-2 mb-4 p-1 bg-slate-200 rounded-lg w-fit">
        <Link href={pathname + '?view=all'} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
            All Scores
        </Link>
        <Link href={pathname + '?view=leaderboard'} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'leaderboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
            Daily Leaderboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by player name..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString() || ''}
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* --- Hide filters in leaderboard view for simplicity --- */}
        {currentView === 'all' && (
           <div className='flex items-center gap-2'>
            <select
              onChange={(e) => { /* handleBankChange */ }}
              defaultValue={searchParams.get('bank')?.toString() || ''}
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Banks</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Modern History">Modern History</option>
              <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
            </select>

            <div className="relative" ref={calendarRef}>
              <button onClick={() => setShowCalendar(!showCalendar)} className="flex items-center gap-2 w-full justify-start text-left rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (date.to ? `${format(date.from, 'LLL dd')} - ${format(date.to, 'LLL dd, y')}` : format(date.from, 'LLL dd, y')) : <span>Pick a date</span>}
              </button>
              {showCalendar && (
                <div className="absolute top-12 right-0 z-10 bg-white border rounded-lg shadow-lg">
                  <DayPicker mode="range" selected={date} onSelect={setDate} initialFocus />
                </div>
              )}
            </div>
          </div>
        )}
       
        <div className="flex items-center gap-2">
           <button onClick={handleClearFilters} className="p-2 rounded-lg border bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800" title="Clear Filters">
                <X className="h-5 w-5" />
            </button>
            <button onClick={() => alert('Exporting...')} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                <Download className="h-4 w-4" />
                Export
            </button>
        </div>
      </div>
    </div>
  );
};