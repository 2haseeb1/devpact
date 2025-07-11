// app/(dashboard)/dashboard/page.tsx

import prisma from "@/lib/prisma";
import { CheckInCard } from "@/components/pacts/CheckInCard";

// পেজ কম্পোনেন্টটি একটি async ফাংশন
export default async function DashboardPage() {
  // সার্ভারে সরাসরি Prisma ব্যবহার করে সাম্প্রতিক ২০টি Check-in নিয়ে আসা হচ্ছে
  const recentCheckIns = await prisma.checkIn.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
    // সম্পর্কিত ডেটা (author, pact, kudos) include করা হচ্ছে
    include: {
      author: {
        select: { name: true, image: true, username: true },
      },
      pact: {
        select: { id: true, title: true },
      },
      kudos: {
        select: { userId: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
        <p className="text-muted-foreground">
          See what others in the community are working on.
        </p>
      </div>
      
      {recentCheckIns.length > 0 ? (
        <div className="space-y-4">
          {/* প্রতিটি Check-in এর জন্য CheckInCard রেন্ডার করা হচ্ছে */}
          {recentCheckIns.map((checkIn) => (
            <CheckInCard key={checkIn.id} checkIn={checkIn} />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-xl font-semibold">No recent activity yet.</h3>
          <p className="text-muted-foreground mt-2">
            Create a new pact to get started and share your progress!
          </p>
        </div>
      )}
    </div>
  );
}