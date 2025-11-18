'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Package2,
  Settings,
  Gamepad2,
  Trophy,
  LogOut,
  CircleUserRound,
} from 'lucide-react';

import { Providers } from '@/lib/Providers';

import { useAtomValue, useSetAtom } from 'jotai';
import {
  authHydratedAtom,
  isLoggedInAtom,
  isAdminAtom,
  loggedInUserAtom,
} from '@/state/auth';
import axiosInstance from '@/utils/axiosInstance';

const NavLink = ({ href, icon: Icon, children, isCollapsed }: any) => {
  const pathname = usePathname();
  const isActive =
    (href === '/admin' && pathname === href) ||
    (href !== '/admin' && pathname.startsWith(href));

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

  // ---- admin auth state (from your Header component) ----
  const hydrated = useAtomValue(authHydratedAtom);
  const loggedIn = useAtomValue(isLoggedInAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const adminUser = useAtomValue(loggedInUserAtom);
  const setLoggedInUser = useSetAtom(loggedInUserAtom);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/admins/logout');
      setLoggedInUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-indigo-600" />
            {!isCollapsed && <span className="text-slate-900">Quiz Master</span>}
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink href="/admin" icon={Home} isCollapsed={isCollapsed}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/question-banks" icon={Package} isCollapsed={isCollapsed}>
            Question Banks
          </NavLink>
          <NavLink href="/admin/game-config" icon={Settings} isCollapsed={isCollapsed}>
            Game Config
          </NavLink>
           <NavLink href="/admin/scoreboard" icon={Trophy} isCollapsed={isCollapsed}>
            Score Board
          </NavLink>
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

      {/* Main column */}
      <div className="flex flex-col">
        {/* ADMIN NAVBAR HERE */}
        <header className="flex h-[60px] items-center justify-between gap-4 border-b bg-white px-6">
          {/* Left side: logo + label */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="text-indigo-600" size={24} />
              <span className="font-semibold text-slate-800 hidden sm:inline">
                QuizMaster Admin
              </span>
            </Link>
          </div>

          {/* Right side: admin info + logout */}
          <div className="flex items-center gap-4">
        

            {/* Only show admin bits when auth is ready and user is admin */}
            {hydrated && loggedIn && isAdmin && (
              <>
         
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {/* (Optional) If not logged in / not admin – show login link */}
            {hydrated && (!loggedIn || !isAdmin) && (
              <Link
                href="/auth/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Admin Login
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
}
