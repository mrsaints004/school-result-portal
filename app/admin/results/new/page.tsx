"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { calculateGrade } from "@/lib/utils";

interface SubjectInput {
  name: string;
  score: string;
}

export default function AddResult() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    session: "",
    term: "1st" as "1st" | "2nd" | "3rd",
    className: "",
  });

  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { name: "", score: "" },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/student/dashboard");
    }
  }, [status, session, router]);

  const addSubject = () => {
    setSubjects([...subjects, { name: "", score: "" }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formattedSubjects = subjects.map((s) => ({
      name: s.name,
      score: Number(s.score),
      grade: calculateGrade(Number(s.score)),
    }));

    // Validate
    for (const s of formattedSubjects) {
      if (!s.name || isNaN(s.score) || s.score < 0 || s.score > 100) {
        setError("Please enter valid subject names and scores (0-100)");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          session: form.session,
          subjects: formattedSubjects,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add result");
        setLoading(false);
        return;
      }

      router.push("/admin/results");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Result
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                Student Name
              </label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session (e.g. 2024/2025)
              </label>
              <input
                type="text"
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
                required
                placeholder="2024/2025"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <select
                value={form.term}
                onChange={(e) =>
                  setForm({
                    ...form,
                    term: e.target.value as "1st" | "2nd" | "3rd",
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st">1st Term</option>
                <option value="2nd">2nd Term</option>
                <option value="3rd">3rd Term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <input
                type="text"
                value={form.className}
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
                required
                placeholder="e.g. JSS 1A"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-3 text-gray-800">Subjects</h2>
          {subjects.map((subject, index) => (
            <div key={index} className="flex gap-3 mb-3 items-end">
              <div className="flex-1">
                {index === 0 && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name
                  </label>
                )}
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubject(index, "name", e.target.value)
                  }
                  required
                  placeholder="e.g. Mathematics"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-24">
                {index === 0 && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                )}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.score}
                  onChange={(e) =>
                    updateSubject(index, "score", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-16 text-center">
                {index === 0 && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                )}
                <span className="inline-block py-2 font-medium text-gray-700">
                  {subject.score
                    ? calculateGrade(Number(subject.score))
                    : "-"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="text-red-500 hover:text-red-700 pb-2"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubject}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-6"
          >
            + Add Subject
          </button>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Result"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
