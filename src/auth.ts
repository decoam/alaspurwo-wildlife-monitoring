import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { DefaultSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
        } catch (err) {
          console.error("[Auth] DB connection error during authorize", {
            message: err instanceof Error ? err.message : String(err),
          });
          return null;
        }

        const user = await User.findOne({
          username: String(credentials.username).trim().toLowerCase(),
        }).lean();

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!passwordMatches) {
          return null;
        }

        // PERBAIKAN: Hanya mapping field yang sesuai dengan schema User
        return {
          id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          name: user.fullName, // Tetap sediakan untuk kompatibilitas bawaan NextAuth
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.fullName = user.fullName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.fullName = token.fullName as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});