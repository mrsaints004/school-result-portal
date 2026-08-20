"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

function SearchContent() {
  const searchParams = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get("studentId") || "");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchResults = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/results/search?studentId=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("studentId");
    if (id) {
      setStudentId(id);
      fetchResults(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(studentId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Search Results</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500">Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          No results found for this Student ID.
        </div>
      )}

      {results.map((result) => (
        <ResultCard
          key={result._id}
          studentName={result.studentName}
          className={result.className}
          session={result.session}
          term={result.term}
          subjects={result.subjects}
        />
      ))}
    </div>
  );
}

export default function SearchResults() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>}>
        <SearchContent />
      </Suspense>
    </>
  );
}
