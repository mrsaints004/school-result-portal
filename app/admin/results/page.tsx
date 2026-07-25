"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface Result {
  _id: string;
  studentId: string;
  studentName: string;
  session: string;
  term: string;
  className: string;
  subjects: { name: string; score: number; grade: string }[];
  createdAt: string;
}

export default function ManageResults() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/student/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchResults();
    }
  }, [status, session, router]);

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/results");
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResults(results.filter((r) => r._id !== id));
      }
    } catch {
      alert("Failed to delete result");
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Results</h1>
          <Link
            href="/admin/results/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add New Result
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            No results uploaded yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Subjects</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} className="border-t">
                    <td className="px-4 py-3">{result.studentName}</td>
                    <td className="px-4 py-3">{result.studentId}</td>
                    <td className="px-4 py-3">{result.className}</td>
                    <td className="px-4 py-3">{result.session}</td>
                    <td className="px-4 py-3">{result.term}</td>
                    <td className="px-4 py-3">{result.subjects.length}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
