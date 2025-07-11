// app/profile/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * এই পেজটির একমাত্র কাজ হলো ব্যবহারকারীকে তার আসল প্রোফাইল পেজে রিডাইরেক্ট করা।
 * এটি একটি সার্ভার কম্পোনেন্ট হিসেবে কাজ করবে।
 */
export default async function ProfileRedirectPage() {
  // প্রথমে বর্তমান ব্যবহারকারীর সেশন তথ্য নেওয়া হচ্ছে
  const session = await auth();

  // যদি ব্যবহারকারী লগইন করা থাকে
  if (session?.user) {
    // ব্যবহারকারীর username অথবা id ব্যবহার করে তার আসল প্রোফাইল URL-এ রিডাইরেক্ট করা হচ্ছে
    const profileUrl = `/${session.user.username || session.user.id}`;
    redirect(profileUrl);
  } else {
    // যদি ব্যবহারকারী লগইন করা না থাকে, তাহলে তাকে সাইন-ইন পেজে পাঠিয়ে দেওয়া হচ্ছে
    redirect('/api/auth/signin');
  }

  // এই পেজটি নিজে কিছুই রেন্ডার করবে না, কারণ এটি সব সময় রিডাইরেক্ট করবে
  // return null; // এই লাইনটির প্রয়োজন নেই, কারণ redirect() একটি এরর থ্রো করে
}