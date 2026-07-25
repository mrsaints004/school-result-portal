"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

interface Subject {
  name: string;
  score: number;
  grade: string;
}

interface Result {
  _id: string;
  studentId: string;
  studentName: string;
  session: string;
  term: string;
  className: string;
  subjects: Subject[];
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "student") {
      router.push("/admin/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/results")
        .then((res) => res.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">My Results</h1>
        <p className="text-gray-500 mb-6">
          Student ID: {session?.user?.studentId}
        </p>

        {results.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            No results have been uploaded yet.
          </div>
        ) : (
          results.map((result) => (
            <div key={result._id} className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {result.className}
                </h2>
                <p className="text-sm text-gray-500">
                  {result.session} | {result.term} Term
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2">Subject</th>
                    <th className="py-2">Score</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subject, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{subject.name}</td>
                      <td className="py-2">{subject.score}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            subject.grade === "A"
                              ? "bg-green-100 text-green-700"
                              : subject.grade === "B"
                              ? "bg-blue-100 text-blue-700"
                              : subject.grade === "C"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-sm text-gray-500 text-right">
                Average:{" "}
                {(
                  result.subjects.reduce((sum, s) => sum + s.score, 0) /
                  result.subjects.length
                ).toFixed(1)}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
