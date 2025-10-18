'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const PaginationControls = ({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${!hasPrevPage ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={!hasPrevPage}
        tabIndex={!hasPrevPage ? -1 : undefined}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="text-sm text-slate-700">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${!hasNextPage ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={!hasNextPage}
        tabIndex={!hasNextPage ? -1 : undefined}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};