'use client';

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

  const handleBankChange = (bank: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
     if (bank) {
      params.set('bank', bank);
    } else {
      params.delete('bank');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setDate(undefined);
    router.push(pathname);
  };

  const handleExport = () => {
    alert('Exporting data... (feature mocked)');
  };

  return (
    <div className="flex items-center gap-2">
        <div className="relative w-full min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
            type="text"
            placeholder="Search by player name..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString() || ''}
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <select
           onChange={(e) => handleBankChange(e.target.value)}
           defaultValue={searchParams.get('bank')?.toString() || ''}
           className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Banks</option>
          <option value="General Knowledge">General Knowledge</option>
          <option value="Modern History">Modern History</option>
          <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
        </select>

        <div ref={calendarRef} className="relative flex items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-150">
            <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 justify-start text-left px-3 py-2 text-sm text-slate-800 border-r border-slate-200"
            >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                {date?.from ? (
                  <span className="text-slate-900 font-medium">
                    {format(date.from, 'dd/MM/yyyy')}
                    {date.to && ` - ${format(date.to, 'dd/MM/yyyy')}`}
                  </span>
                ) : (
                  <span className='text-slate-600 whitespace-nowrap'>Pick a date</span>
                )}
            </button>
            {showCalendar && (
                <div className="absolute top-full mt-2 right-0 z-10 bg-white border rounded-lg shadow-lg">
                    <DayPicker mode="range" selected={date} onSelect={setDate} initialFocus />
                </div>
            )}
            <button
                onClick={handleClearFilters}
                className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-r-md"
                title="Clear Filters"
            >
                <X className="h-5 w-5" />
            </button>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Download className="h-4 w-4" />
        </button>
    </div>
  );
};