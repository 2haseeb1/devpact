// lib/actions/pact.actions.ts
"use server"; // এই ফাইলটিকে একটি সার্ভার অ্যাকশন মডিউল হিসেবে চিহ্নিত করে

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // আমাদের তৈরি করা Next-Auth হেল্পার
import prisma from "@/lib/prisma"; // আমাদের Prisma singleton instance

// Zod ব্যবহার করে ফর্ম ডেটার জন্য একটি ভ্যালিডেশন স্কিমা তৈরি করা হচ্ছে।
// এটি ইনপুটকে নিরাপদ এবং টাইপ-সেফ করে।
const PactSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters." })
    .optional(), // বিবরণ ঐচ্ছিক

  // `z.coerce.date()` ইনপুট স্ট্রিংকে স্বয়ংক্রিয়ভাবে একটি Date অবজেক্টে রূপান্তর করার চেষ্টা করে।
  deadline: z.coerce.date().refine((data) => data > new Date(), {
    message: "Deadline must be a future date.",
  }),
});

// useFormState হুকের সাথে কাজ করার জন্য একটি স্টেট টাইপ ডিফাইন করা হচ্ছে।
// এটি ফর্মে ভ্যালিডেশন এরর এবং অন্যান্য মেসেজ দেখানোর জন্য ব্যবহৃত হয়।
export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    deadline?: string[];
  };
  message?: string | null;
};

/**
 * একটি নতুন Pact তৈরি করার জন্য সার্ভার অ্যাকশন।
 * @param prevState - useFormState হুক থেকে আসা পূর্ববর্তী স্টেট।
 * @param formData - ফর্ম থেকে আসা ডেটা।
 */
export async function createPact(prevState: State, formData: FormData) {
  // ১. অথেন্টিকেশন চেক: ব্যবহারকারী লগইন করা আছে কিনা তা যাচাই করা।
  const session = await auth();
  if (!session?.user?.id) {
    return {
      message: "Authentication required. Please sign in to create a pact.",
    };
  }

  // ২. ডেটা ভ্যালিডেশন: Zod স্কিমা ব্যবহার করে ফর্ম ডেটা ভ্যালিডেট করা।
  const validatedFields = PactSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
  });

  // ভ্যালিডেশন ব্যর্থ হলে, এররগুলো ফর্মে ফেরত পাঠানো হবে।
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create pact. Please check the fields and try again.",
    };
  }

  // ৩. ডাটাবেস অপারেশন: ভ্যালিডেট করা ডেটা ডাটাবেসে সেভ করা।
  try {
    await prisma.pact.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        deadline: validatedFields.data.deadline,
        authorId: session.user.id, // লগইন করা ব্যবহারকারীর আইডিকে লেখক হিসেবে যুক্ত করা
      },
    });
  } catch (error) {
    // যদি ডাটাবেসে কোনো অপ্রত্যাশিত এরর ঘটে (যেমন: কানেকশন সমস্যা)
    console.error("Database Error:", error);
    return {
      message: "Database Error: Something went wrong while creating the pact.",
    };
  }

  // ৪. সফল হওয়ার পর:

  // ক্যাশ রিভ্যালিডেট করা: এটি Next.js-কে বলে যে /dashboard পেজের ক্যাশ করা ডেটা এখন পুরনো,
  // এবং পরবর্তী ভিজিটে নতুন করে ডেটা ফেচ করতে হবে। এটি নতুন তৈরি করা Pact-কে ড্যাশবোর্ডে দেখাতে সাহায্য করে।
  revalidatePath("/dashboard");

  // রিডাইরেক্ট করা: ব্যবহারকারীকে ড্যাশবোর্ড পেজে পাঠিয়ে দেওয়া হবে।
  // সার্ভার অ্যাকশনে redirect() ফাংশনটি একটি বিশেষ এরর থ্রো করে কাজ করে, তাই এটি try/catch ব্লকের বাইরে থাকা উচিত।
  redirect("/dashboard");
}
