"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  createdAt: string;
}

export default function ManageStudents() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
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
      fetch("/api/students")
        .then((res) => res.json())
        .then((data) => {
          setStudents(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, session, router]);

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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Registered Students
        </h1>

        {students.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            No students registered yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-t">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.studentId}</td>
                    <td className="px-4 py-3">{student.email}</td>
                    <td className="px-4 py-3">
                      {new Date(student.createdAt).toLocaleDateString()}
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
