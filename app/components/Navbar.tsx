"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          School Result Portal
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.user.role === "admin" && (
                <>
                  <Link href="/admin/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <Link href="/admin/results" className="hover:underline">
                    Results
                  </Link>
                  <Link href="/admin/students" className="hover:underline">
                    Students
                  </Link>
                </>
              )}
              {session.user.role === "student" && (
                <Link href="/student/dashboard" className="hover:underline">
                  My Results
                </Link>
              )}
              <span className="text-blue-200 text-sm">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
