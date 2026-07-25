import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, studentId } = await req.json();

    if (!name || !email || !password || !studentId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email or Student ID already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentId,
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
