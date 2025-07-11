// app/[userId]/page.tsx

import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client'; // Prisma টাইপ ইম্পোর্ট করা হচ্ছে
import prisma from '@/lib/prisma';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// ১. Prisma কুয়েরি আর্গুমেন্টগুলোকে একটি ভেরিয়েবলে রাখা হচ্ছে
const userWithPactsQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    pacts: {
      orderBy: {
        createdAt: 'desc',
      },
    },
  },
});

// ২. উপরের কুয়েরি থেকে একটি শক্তিশালী TypeScript টাইপ তৈরি করা হচ্ছে
type UserWithPacts = Prisma.UserGetPayload<typeof userWithPactsQuery>;


type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const awaitedParams = await params;
  const userId = awaitedParams.userId;

  // ৩. `findUnique`-কে `findFirst` দিয়ে পরিবর্তন করা হচ্ছে
  const user: UserWithPacts | null = await prisma.user.findFirst({
    where: {
      // findFirst `OR` কন্ডিশন সমর্থন করে
      OR: [{ id: userId }, { username: userId }],
    },
    // ৪. আমাদের আগে থেকে তৈরি করা কুয়েরি আর্গুমেন্টগুলো এখানে ব্যবহার করা হচ্ছে
    ...userWithPactsQuery,
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex flex-col items-center gap-4 border-b pb-8">
        <UserAvatar
          src={user.image}
          fallback={user.name?.charAt(0).toUpperCase() ?? 'U'}
          className="h-28 w-28 text-5xl"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
          {user.username && (
            <p className="text-xl text-muted-foreground">@{user.username}</p>
          )}
          {user.email && (
            <p className="text-md text-muted-foreground mt-2">{user.email}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">
          {user.name}&apos;s Pacts ({user.pacts.length})
        </h2>
        {user.pacts.length > 0 ? (
          <div className="space-y-4">
            {/* এখন TypeScript জানে যে pacts একটি অ্যারে এবং pact একটি Pact অবজেক্ট */}
            {user.pacts.map((pact) => (
              <Link key={pact.id} href={`/pacts/${pact.id}`} className="block">
                <div className="p-4 border rounded-lg hover:bg-accent hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold group-hover:text-primary">{pact.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deadline: {new Date(pact.deadline).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed rounded-md text-center bg-secondary">
            <p className="text-muted-foreground">
              {user.name} has not created any pacts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}