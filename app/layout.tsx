// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // app ফোল্ডারের ভেতরে থাকা গ্লোবাল সিএসএস
import { Navbar } from "@/components/shared/Navbar"; // `@` এখন রুট ফোল্ডারকে নির্দেশ করে
import { Footer } from "@/components/shared/Footer";

// ফন্ট অপ্টিমাইজেশন
const inter = Inter({ 
  subsets: ["latin"], 
  display: 'swap', 
  variable: '--font-inter' 
});

// SEO এর জন্য ডিফল্ট মেটাডেটা
export const metadata: Metadata = {
  title: {
    default: "DevPact - Your Developer Accountability Hub",
    template: "%s | DevPact",
  },
  description: "Publicly commit to your goals, track your progress, and get support from the developer community.",
  icons: {
    icon: "/favicon.ico",
  },
};

// RootLayout হলো মূল সার্ভার কম্পোনেন্ট যা সব পেজকে র‍্যাপ করে
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          {/* Navbar সব পেজের উপরে থাকবে */}
          <Navbar />
          
          {/* children props এর মাধ্যমে প্রতিটি পেজের কন্টেন্ট রেন্ডার হবে */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          
          {/* Footer সব পেজের নিচে থাকবে */}
          <Footer />
        </div>
      </body>
    </html>
  );
}