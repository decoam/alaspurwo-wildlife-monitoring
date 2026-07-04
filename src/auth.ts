import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import type { DefaultSession } from "next-auth";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
      role: string;
      email?: string;
      posPengamatan?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
    email?: string;
    posPengamatan?: string;
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

        await connectDB();

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

        return {
          id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          name: user.fullName,
          email: user.username,
          posPengamatan: user.fullName,
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
        token.email = user.email;
        token.posPengamatan = user.posPengamatan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.fullName = token.fullName as string;
        session.user.role = token.role as string;
        // token.email bisa undefined, pastikan field session.user.email selalu string
        session.user.email = (token.email as string | undefined) ?? "";
        session.user.posPengamatan = token.posPengamatan as string | undefined;
      }
      return session;
    },
  },
});
