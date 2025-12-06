"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../_components/AuthLayout";
import Link from "next/link";
import Input from "../_components/Input";
import Banner from "../_components/Banner";
import axiosInstance from "@/utils/axiosInstance";
import { useSetAtom } from "jotai";
import { loggedInUserAtom } from "@/state/auth";

export default function LoginPageWrapper() {
  return <LoginPage />;
}

function LoginPage() {
  const router = useRouter();
  const setLoggedInUser = useSetAtom(loggedInUserAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);

      const resp = await axiosInstance.post(
        `/auth/admins/login`,
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      const data = resp.data;
      console.log("Login response:", data);

      // direct, simple check
      if (data?.role === "admin" || data?.status === "success") {
        // set Jotai atom so UI updates immediately
        console.log("Login: about to setLoggedInUser -> admin");
        setLoggedInUser("admin");
        console.log("Login: setLoggedInUser done");

        console.log("Login: navigating to /admin");
        router.push("/admin");
        console.log("DEBUG: stayed on page after setLoggedInUser");
        return;
      }

      // otherwise show server message
      setError(data?.message || "Login failed. Please try again.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}

        <Input
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-600 invisible">Password</label>
          <Link href="/auth/forgot-password" tabIndex={-1} className="text-sm text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
