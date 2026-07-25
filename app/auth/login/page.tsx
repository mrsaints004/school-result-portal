"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      // Fetch session to determine role-based redirect
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
