import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "student";
      studentId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    studentId: string;
  }
}
