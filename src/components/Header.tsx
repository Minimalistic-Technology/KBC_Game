"use client";
import { useRouter } from "next/navigation";
import { Gamepad2, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAtomValue, useSetAtom } from "jotai";
import {
  authHydratedAtom,
  isLoggedInAtom,
  isUserAtom,
  loggedInUserAtom,
} from "@/state/auth";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect } from "react";

export default function Header() {
  const hydrated = useAtomValue(authHydratedAtom);
  const loggedIn = useAtomValue(isLoggedInAtom);
  const isUser = useAtomValue(isUserAtom);
  const setLoggedInUser = useSetAtom(loggedInUserAtom);

const router = useRouter();

const handleLogout = async () => {
  try {
    await axiosInstance.post("/api/auth/user/logout"); // <-- fixed leading slash

    setLoggedInUser(null);

    // Redirect to login page
    router.push("/login");
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  // Show blank bar while hydrating (prevents layout shift)
  if (!hydrated) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b">
        <div className="h-16 container mx-auto px-6 py-4" />
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b">
      <div className="h-16 container mx-auto px-6 py-4 flex items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">QuizMaster</h1>
        </Link>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-6">

          {/* If NOT logged in -> show login */}
          {!loggedIn && (
            <Link
              href="/login"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <User size={20} />
              <span className="font-medium">Login</span>
            </Link>
          )}

          {/* If Logged in AND user → show logout */}
          {loggedIn && isUser && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
