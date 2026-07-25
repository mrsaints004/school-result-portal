import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const result = await Result.findById(params.id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
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

    const body = await req.json();
    await dbConnect();

    const result = await Result.findByIdAndUpdate(params.id, body, {
      new: true,
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
