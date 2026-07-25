// Run with: npx tsx scripts/seed-admin.ts
// Creates an initial admin user

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error("Set MONGODB_URI environment variable first");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    studentId: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: "admin@school.com" });
  if (existing) {
    console.log("Admin user already exists");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await User.create({
    name: "Admin",
    email: "admin@school.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created:");
  console.log("  Email: admin@school.com");
  console.log("  Password: admin123");
  console.log("  (Change this password after first login)");

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
