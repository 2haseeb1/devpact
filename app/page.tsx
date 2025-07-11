// app/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PactCard } from "@/components/pacts/PactCard";
import prisma from "@/lib/prisma"; // `@` এখন রুট ফোল্ডারকে নির্দেশ করে

// এটি একটি async Server Component, তাই আমরা সরাসরি `await` ব্যবহার করতে পারি
export default async function HomePage() {
  
  // সার্ভারে সরাসরি Prisma ব্যবহার করে সাম্প্রতিক ৩টি Pact নিয়ে আসা হচ্ছে
  const recentPacts = await prisma.pact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      author: {
        select: { name: true, image: true, username: true },
      },
    },
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Commit Publicly. Achieve Ambitiously.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          DevPact is where developers hold themselves accountable. Share your goals,
          track your progress, and find the motivation to ship your next big thing.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
      
      {/* Recent Activity Section */}
      <section id="recent-pacts">
        <h2 className="text-3xl font-bold text-center">
          What Others Are Working On
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPacts.map((pact) => (
            // ডেটা পাস করে PactCard কম্পোনেন্ট রেন্ডার করা হচ্ছে
            <PactCard key={pact.id} pact={pact} />
          ))}
        </div>
        {recentPacts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No public pacts yet. Be the first one to start!
          </p>
        )}
      </section>
    </div>
  );
}