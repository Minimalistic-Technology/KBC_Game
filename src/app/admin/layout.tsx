'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Package2,
} from 'lucide-react';
import { UserNav } from './components/UserNav';

const NavLink = ({ href, icon: Icon, children, isCollapsed }: any) => {
  const pathname = usePathname();
  const isActive = (href === '/admin' && pathname === href) || (href !== '/admin' && pathname.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white font-semibold shadow'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? children : ''}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{children}</span>}
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] bg-slate-100">
      <aside
        className={`hidden md:flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-indigo-600" />
            {!isCollapsed && <span className="text-slate-900">QuizAdmin</span>}
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink href="/admin" icon={Home} isCollapsed={isCollapsed}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/question-banks" icon={Package} isCollapsed={isCollapsed}>
            Question Banks
          </NavLink>
          {/* --- REMOVED Import / Export NavLink --- */}
        </nav>

        <div className="mt-auto border-t p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex h-[60px] items-center justify-end gap-4 border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800">
              <Bell className="h-5 w-5" />
            </button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">{children}</main>
      </div>
    </div>
  );
}