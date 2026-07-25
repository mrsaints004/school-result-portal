"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ students: 0, results: 0 });
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
      Promise.all([
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/results").then((r) => r.json()),
      ])
        .then(([students, results]) => {
          setStats({
            students: Array.isArray(students) ? students.length : 0,
            results: Array.isArray(results) ? results.length : 0,
          });
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
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.students}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Results Uploaded</h3>
            <p className="text-3xl font-bold text-green-600">{stats.results}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/admin/results/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-center font-medium"
          >
            Add New Result
          </Link>
          <Link
            href="/admin/results"
            className="bg-white hover:bg-gray-50 border rounded-lg p-4 text-center font-medium text-gray-700"
          >
            Manage Results
          </Link>
          <Link
            href="/admin/students"
            className="bg-white hover:bg-gray-50 border rounded-lg p-4 text-center font-medium text-gray-700"
          >
            View Students
          </Link>
        </div>
      </div>
    </>
  );
}
