import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    await dbConnect();
    const result = await Result.findById(params.id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Students can only view their own results
    if (session.user.role === "student" && result.studentId !== session.user.studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get result error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    const body = await req.json();
    const { studentId, studentName, session: academicSession, term, className, subjects } = body;

    // Whitelist allowed fields to prevent mass assignment
    const updateData: Record<string, unknown> = {};
    if (studentId !== undefined) updateData.studentId = studentId;
    if (studentName !== undefined) updateData.studentName = studentName;
    if (academicSession !== undefined) updateData.session = academicSession;
    if (term !== undefined) updateData.term = term;
    if (className !== undefined) updateData.className = className;
    if (subjects !== undefined) updateData.subjects = subjects;

    await dbConnect();

    const result = await Result.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update result error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    await dbConnect();
    const result = await Result.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Result deleted" });
  } catch (error) {
    console.error("Delete result error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
