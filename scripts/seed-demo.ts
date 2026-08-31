// Run with: npx tsx scripts/seed-demo.ts
// Populates the database with demo students and results

import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

function calculateGrade(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

const students = [
  { name: "Adebayo Olamide", email: "adebayo.olamide@student.com", studentId: "STU001", className: "JSS 1A" },
  { name: "Chidinma Okafor", email: "chidinma.okafor@student.com", studentId: "STU002", className: "JSS 1A" },
  { name: "Emeka Nwosu", email: "emeka.nwosu@student.com", studentId: "STU003", className: "JSS 1B" },
  { name: "Fatima Abdullahi", email: "fatima.abdullahi@student.com", studentId: "STU004", className: "JSS 2A" },
  { name: "Ibrahim Musa", email: "ibrahim.musa@student.com", studentId: "STU005", className: "JSS 2A" },
  { name: "Ngozi Eze", email: "ngozi.eze@student.com", studentId: "STU006", className: "JSS 2B" },
  { name: "Oluwaseun Bakare", email: "oluwaseun.bakare@student.com", studentId: "STU007", className: "JSS 3A" },
  { name: "Aisha Mohammed", email: "aisha.mohammed@student.com", studentId: "STU008", className: "JSS 3A" },
  { name: "Chukwuemeka Ani", email: "chukwuemeka.ani@student.com", studentId: "STU009", className: "SSS 1A" },
  { name: "Blessing Okonkwo", email: "blessing.okonkwo@student.com", studentId: "STU010", className: "SSS 1A" },
];

const jssSubjects = [
  "Mathematics", "English Language", "Basic Science", "Basic Technology",
  "Social Studies", "Civic Education", "Agricultural Science",
  "Business Studies", "Computer Studies",
];

const sssSubjects = [
  "Mathematics", "English Language", "Physics", "Chemistry",
  "Biology", "Economics", "Government", "Literature in English",
  "Computer Science",
];

function randomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSubjects(className: string): { name: string; score: number; grade: string }[] {
  const subjectList = className.startsWith("SSS") ? sssSubjects : jssSubjects;
  return subjectList.map((name) => {
    const score = randomScore(35, 98);
    return { name, score, grade: calculateGrade(score) };
  });
}

async function seedDemo() {
  if (!MONGODB_URI) {
    console.error("Set MONGODB_URI environment variable first");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB\n");

  // --- Schemas ---
  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    studentId: { type: String, unique: true, sparse: true },
  }, { timestamps: true });

  const SubjectSchema = new mongoose.Schema({
    name: String,
    score: Number,
    grade: String,
  }, { _id: false });

  const ResultSchema = new mongoose.Schema({
    studentId: { type: String, index: true },
    studentName: String,
    session: String,
    term: String,
    className: String,
    subjects: [SubjectSchema],
    createdBy: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);

  // --- Seed admin ---
  let admin = await User.findOne({ email: "admin@school.com" });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    admin = await User.create({
      name: "Admin",
      email: "admin@school.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin created: admin@school.com / admin123");
  } else {
    console.log("Admin already exists");
  }

  // --- Seed students ---
  const hashedStudentPassword = await bcrypt.hash("student123", 12);

  for (const s of students) {
    const existing = await User.findOne({ email: s.email });
    if (existing) {
      console.log(`Student ${s.name} (${s.studentId}) already exists, skipping`);
      continue;
    }

    await User.create({
      name: s.name,
      email: s.email,
      password: hashedStudentPassword,
      role: "student",
      studentId: s.studentId,
    });
    console.log(`Created student: ${s.name} (${s.studentId})`);
  }

  // --- Seed results (3 terms for each student) ---
  console.log("\nSeeding results...\n");

  const terms: ("1st" | "2nd" | "3rd")[] = ["1st", "2nd", "3rd"];

  for (const s of students) {
    const existingResults = await Result.countDocuments({ studentId: s.studentId });
    if (existingResults > 0) {
      console.log(`Results for ${s.name} already exist, skipping`);
      continue;
    }

    for (const term of terms) {
      await Result.create({
        studentId: s.studentId,
        studentName: s.name,
        session: "2024/2025",
        term,
        className: s.className,
        subjects: generateSubjects(s.className),
        createdBy: admin!._id.toString(),
      });
    }
    console.log(`Created 3 term results for ${s.name} (${s.studentId})`);
  }

  // --- Summary ---
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalResults = await Result.countDocuments();

  console.log("\n========================================");
  console.log("  DEMO DATA SEEDED SUCCESSFULLY");
  console.log("========================================");
  console.log(`  Students: ${totalStudents}`);
  console.log(`  Results:  ${totalResults}`);
  console.log("========================================");
  console.log("\n  LOGIN CREDENTIALS:");
  console.log("  ---------------------------------");
  console.log("  Admin:   admin@school.com / admin123");
  console.log("  Student: adebayo.olamide@student.com / student123");
  console.log("  Student: chidinma.okafor@student.com / student123");
  console.log("  (All students use password: student123)");
  console.log("  ---------------------------------\n");

  await mongoose.disconnect();
}

seedDemo().catch(console.error);
