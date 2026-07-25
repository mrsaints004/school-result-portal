import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const results = await Result.find({ studentId }).sort({ createdAt: -1 });
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search results error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
