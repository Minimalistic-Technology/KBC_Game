'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// UPDATED: This now points to the user registration page
const START_URL = "/login";

export default function Hero() {
  return (
    <section className="bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-4 tracking-tight">
            The Ultimate Quiz Experience Awaits.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-3xl mx-auto">
            A modern, interactive platform for players and administrators. Create, manage, and play engaging quizzes with ease.
          </p>
          <div className="inline-block">
            <Link href={START_URL}>
              <button className="px-10 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-indigo-300 transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2">
                Get Started Now <ArrowRight />
              </button>
            </Link>
          </div>
        </div>

        {/* Stylized App Preview */}
        <div className="mt-16 max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-2xl border border-slate-200">
            <div className="h-8 bg-slate-100 rounded-t-lg flex items-center gap-1.5 px-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="aspect-video bg-slate-50 p-6 flex items-center justify-center rounded-b-lg">
                <p className="text-2xl font-bold text-indigo-500">Your Quiz App Preview</p>
            </div>
        </div>
      </div>
    </section>
  );
}