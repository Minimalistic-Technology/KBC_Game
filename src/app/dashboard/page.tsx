'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, LogOut, RefreshCw } from 'lucide-react';

interface User {
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);

  useEffect(() => {
    const userData = localStorage.getItem('quizUser');
    const progressData = localStorage.getItem('quizUnlockedLevels');
    
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/user-login'); // Redirect if not logged in
    }

    if (progressData) {
      setUnlockedLevels(JSON.parse(progressData));
    }
  }, [router]);

  const handleLogout = () => {
    // Clear both user session and quiz progress on logout
    localStorage.removeItem('quizUser');
    localStorage.removeItem('quizUnlockedLevels');
    router.push('/');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your quiz progress? This will lock all levels except the first one.')) {
      // Clear progress from storage and update the state
      localStorage.removeItem('quizUnlockedLevels');
      setUnlockedLevels([1]);
      alert('Your progress has been reset.');
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4"
        >
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Welcome, {user.username}!
          </h1>
          <p className="text-lg text-slate-500 mb-10">
            You have unlocked {unlockedLevels.length} level(s). Ready to test your knowledge?
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-indigo-300 inline-flex items-center justify-center gap-2 w-64"
              >
                <PlayCircle />
                {unlockedLevels.length > 1 ? 'Continue Quiz' : 'Start Quiz'}
              </motion.button>
            </Link>
            
            <div className="flex items-center gap-6 mt-6">
               <button
                onClick={handleResetProgress}
                className="font-semibold text-sm text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw size={14} /> Reset Progress
              </button>
              <button
                onClick={handleLogout}
                className="font-semibold text-sm text-slate-500 hover:text-red-600 transition-colors inline-flex items-center gap-2"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}