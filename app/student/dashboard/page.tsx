"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ResultCard from "@/app/components/ResultCard";

interface Result {
  _id: string;
  studentId: string;
  studentName: string;
  session: string;
  term: string;
  className: string;
  subjects: { name: string; score: number; grade: string }[];
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
            <ResultCard
              key={result._id}
              className={result.className}
              session={result.session}
              term={result.term}
              subjects={result.subjects}
            />
          ))
        )}
      </div>
    </>
  );
}
