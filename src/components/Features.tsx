'use client';

import { Zap, ShieldCheck, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Interactive Gameplay',
    description: 'Experience a slick, modern interface with timers, scoring, and instant feedback. Unlock new levels as you prove your mastery.'
  },
  {
    icon: ShieldCheck,
    title: 'Powerful Admin Dashboard',
    description: 'A complete backend for administrators. Manage question banks, customize prize ladders, and view leaderboards with an intuitive sidebar layout.'
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    description: 'Play and manage quizzes on any device. Our application is designed to work seamlessly on desktops, tablets, and mobile phones.'
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">Everything You Need, All in One Place</h2>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">Discover the features that make QuizMaster the perfect platform for your quizzing needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col"
            >
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-700">{feature.title}</h3>
              <p className="text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}