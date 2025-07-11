// app/api/auth/[...nextauth]/route.ts
// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;

// এই লাইনটি যুক্ত করা অপরিহার্য
// এটি Next.js কে বলে যে এই রুটটি অবশ্যই Node.js এনভায়রনমেন্টে রান করতে হবে, Edge-এ নয়।
export const runtime = "nodejs"; 