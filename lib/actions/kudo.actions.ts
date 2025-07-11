// lib/actions/kudo.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * এই সার্ভার অ্যাকশনটি একটি check-in-এ kudo দেয় বা তুলে নেয়।
 * @param checkInId - যে check-in-এ kudo দেওয়া হবে তার ID।
 * @param pactId - revalidation-এর জন্য pact-এর ID।
 */
export async function toggleKudo(checkInId: string, pactId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to give a kudo.");
  }
  const userId = session.user.id;

  // প্রথমে চেক করা হচ্ছে ব্যবহারকারী 이미 kudo দিয়েছে কি না
  const existingKudo = await prisma.kudo.findUnique({
    where: {
      userId_checkInId: {
        userId,
        checkInId,
      },
    },
  });

  if (existingKudo) {
    // যদি kudo দেওয়া থাকে, তাহলে সেটি ডিলিট করা হচ্ছে
    await prisma.kudo.delete({
      where: {
        id: existingKudo.id,
      },
    });
  } else {
    // যদি kudo দেওয়া না থাকে, তাহলে একটি নতুন kudo তৈরি করা হচ্ছে
    await prisma.kudo.create({
      data: {
        userId,
        checkInId,
      },
    });
  }

  // Pact Details পেজটির ডেটা রি-ভ্যালিডেট করা হচ্ছে,
  // যাতে পেজটি রিফ্রেশ করলে সঠিক kudo সংখ্যা দেখা যায়।
  revalidatePath(`/pacts/${pactId}`);
}
