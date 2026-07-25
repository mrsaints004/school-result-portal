"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Student Registration
          </h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
