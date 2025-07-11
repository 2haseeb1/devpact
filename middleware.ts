// middleware.ts
import { auth } from "@/lib/auth"; // auth.config নয়, lib/auth থেকে

export default auth((req) => {
  // `req.auth` অবজেক্টটি ব্যবহার করে আমরা বর্তমান সেশন তথ্য পাই
  const isLoggedIn = !!req.auth?.user;
  const { nextUrl } = req;

  // যে রুটগুলো সুরক্ষিত করতে হবে, তার একটি তালিকা
  const protectedRoutes = ["/dashboard", "/pacts/new"];

  // ব্যবহারকারী যে পেজে যেতে চাচ্ছে, সেটি কি সুরক্ষিত?
  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtected) {
    if (isLoggedIn) return; // লগইন করা থাকলে যেতে দাও (কিছুই করার দরকার নেই)

    // লগইন করা না থাকলে, সাইনইন পেজে রিডাইরেক্ট করো
    // এবং লগইনের পর তাকে এই পেজেই ফেরত পাঠাও
    const redirectUrl = new URL("/api/auth/signin", nextUrl.origin);
    redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
    return Response.redirect(redirectUrl);
  }

  // অন্য সব পেজের জন্য কোনো হস্তক্ষেপ করার দরকার নেই
  return;
});

// Middleware শুধুমাত্র নির্দিষ্ট কিছু পেজ ছাড়া বাকি সব পেজে চলবে
// এটি API, স্ট্যাটিক ফাইল ইত্যাদি বাদ দেয়।
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
