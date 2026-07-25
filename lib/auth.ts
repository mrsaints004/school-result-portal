import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.studentId = (user as any).studentId as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.sub;
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).studentId = token.studentId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
