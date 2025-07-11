// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// TypeScript এর জন্য একটি গ্লোবাল টাইপ ডিক্লেয়ার করা হচ্ছে।
// এটি আমাদের globalThis অবজেক্টে `prisma` প্রপার্টি যুক্ত করার অনুমতি দেয়।
declare global {
  var prisma: PrismaClient | undefined;
}

// globalThis.prisma ভেরিয়েবলে যদি আগে থেকেই কোনো instance থাকে, তবে সেটি ব্যবহার করা হবে।
// না থাকলে, একটি নতুন PrismaClient instance তৈরি করা হবে।
// এটিই Singleton Pattern-এর মূল ভিত্তি।
const prisma = globalThis.prisma || new PrismaClient();

// ডেভেলপমেন্ট পরিবেশে, হট-রিলোডিং এর কারণে বারবার নতুন PrismaClient instance তৈরি হতে পারে।
// এই সমস্যা সমাধানের জন্য আমরা instance-টিকে globalThis অবজেক্টে সেভ করে রাখি।
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// সবশেষে, এই singleton instance-টি এক্সপোর্ট করা হচ্ছে,
// যাতে পুরো অ্যাপ্লিকেশন জুড়ে এটি ব্যবহার করা যায়।
export default prisma;
