'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileQuestion, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/questions', label: 'Questions', icon: FileQuestion },
  ];

  const SidebarContent = () => (
     <div className="flex flex-col h-full">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
        </div>
        <nav className="flex-grow px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    pathname === item.href
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
            <Link href="/" className="flex w-full items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                <ExternalLink size={20} />
                <span>View Main Site</span>
            </Link>
            <button onClick={handleLogout} className="mt-2 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-lg p-4 border-b border-slate-200 flex items-center gap-4">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-slate-700 hover:bg-slate-100">
              <Menu />
           </button>
           <h1 className="text-lg font-bold text-slate-800">Admin Menu</h1>
        </div>
        <main className="p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}