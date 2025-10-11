'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gamepad2, LayoutDashboard, LogIn, LogOut, UserCog, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    const userData = localStorage.getItem('quizUser');
    setUser(userData ? JSON.parse(userData) : null);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('quizUser');
    localStorage.removeItem('quizUnlockedLevels');
    setUser(null);
    router.push('/');
  };

  const navLinks = user ? (
    <>
      <Link href="/dashboard" className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-3 py-3">
        <LayoutDashboard size={18} /> Dashboard
      </Link>
      <button onClick={handleLogout} className="font-semibold text-slate-600 hover:text-red-600 transition-colors inline-flex items-center gap-3 py-3">
        <LogOut size={18} /> Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/user-login" className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-3 py-3">
        <LogIn size={18} /> Player Login
      </Link>
      <Link href="/login" className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-3 py-3">
        <UserCog size={18} /> Admin Login
      </Link>
    </>
  );
  
  const isInsideApp = pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname === '/quiz';

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            QuizMaster
          </h1>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!isInsideApp && !user && (
             <div className="flex items-center gap-4">
              <Link href="/user-login" className="px-5 py-2 font-semibold text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors inline-flex items-center gap-2">
                <LogIn size={16} /> Player Login
              </Link>
              <Link href="/auth/login" className="px-5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center gap-2">
                <UserCog size={16} /> Admin Login
              </Link>
            </div>
          )}
          {user && (
             <div className="flex items-center gap-6">
              <Link href="/dashboard" className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-2">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="font-semibold text-slate-600 hover:text-red-600 transition-colors inline-flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-700 hover:bg-slate-100">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg absolute w-full border-t border-slate-200"
          >
            <div className="flex flex-col px-6 py-4">
              {navLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}