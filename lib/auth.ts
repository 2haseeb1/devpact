// lib/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

const GITHUB_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

if (!GITHUB_ID) {
  throw new Error("Missing AUTH_GITHUB_ID");
}
if (!GITHUB_SECRET) {
  throw new Error("Missing AUTH_GITHUB_SECRET");
}

// `export const { handlers, auth, signIn, signOut }` - এটিই মূল অংশ
// যা আমাদের route handler, middleware, এবং server action-এর জন্য ফাংশন সরবরাহ করবে।
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      // আমাদের আগের প্রোফাইল ফাংশনটি এখানে থাকবে
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],

  callbacks: {
    // এখানে কোনো `authorized` কলব্যাক থাকবে না, কারণ middleware সরাসরি auth() ব্যবহার করবে

    // JWT টোকেন সমৃদ্ধ করার জন্য
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username ?? undefined;
      }
      return token;
    },
    // সেশন অবজেক্ট সমৃদ্ধ করার জন্য
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
