'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, UserCog } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-3xl mx-4"
        >
          <h2 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Welcome to the Ultimate Quiz Platform
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            Challenge your knowledge as a player, or take control as an administrator.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/user-login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-64 px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-indigo-300 inline-flex items-center justify-center gap-2"
              >
                Player Login <ArrowRight />
              </motion.button>
            </Link>
            <Link href="/auth/login">
               <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-64 px-8 py-4 text-lg font-bold text-indigo-600 bg-indigo-100 rounded-full inline-flex items-center justify-center gap-2"
              >
                Admin Login <UserCog />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
}