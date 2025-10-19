'use client';

import { Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <div className="container mx-auto px-6 py-4 flex justify-center items-center">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">
            QuizMaster
          </h1>
        </Link>
      </div>
    </header>
  );
}