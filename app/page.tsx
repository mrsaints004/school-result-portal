"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const [studentId, setStudentId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      router.push(`/results/search?studentId=${studentId.trim()}`);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-blue-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to School Result Portal
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Easily check and manage student academic results online.
            </p>
            <form
              onSubmit={handleSearch}
              className="max-w-md mx-auto flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Search Results</h3>
              <p className="text-gray-600">
                Enter your Student ID to instantly look up your academic results.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">View Dashboard</h3>
              <p className="text-gray-600">
                Students can log in to view all their results across sessions and
                terms.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">👩‍💼</div>
              <h3 className="font-semibold text-lg mb-2">Admin Management</h3>
              <p className="text-gray-600">
                Admins can add, edit, and manage student results from a central
                dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-400 text-center py-6">
        <p>&copy; 2026 School Result Portal. 3MTT NextGen Programme.</p>
      </footer>
    </>
  );
}
