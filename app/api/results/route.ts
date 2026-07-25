import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);

    const query: Record<string, string> = {};
    if (session.user.role === "student") {
      query.studentId = session.user.studentId;
    } else {
      const studentId = searchParams.get("studentId");
      if (studentId) {
        query.studentId = studentId;
      }
    }

    const results = await Result.find(query).sort({ createdAt: -1 });
    return NextResponse.json(results);
  } catch (error) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, studentName, session: academicSession, term, className, subjects } = body;

    if (!studentId || !studentName || !academicSession || !term || !className || !subjects?.length) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const result = await Result.create({
      studentId,
      studentName,
      session: academicSession,
      term,
      className,
      subjects,
      createdBy: session.user.id,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create result error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
