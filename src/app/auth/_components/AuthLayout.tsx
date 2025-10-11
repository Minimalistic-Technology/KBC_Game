import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Gamepad2 className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-bold text-slate-800">
              QuizMaster
            </h1>
          </Link>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
           <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </main>
  );
}