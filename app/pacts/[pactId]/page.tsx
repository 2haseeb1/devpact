// app/pacts/[pactId]/page.tsx

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { CheckInStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KudoButton } from '@/components/pacts/KudoButton'; // নতুন KudoButton ইম্পোর্ট করা হচ্ছে

// এই পেজটি URL থেকে pactId পাবে
type PactDetailsPageProps = {
  params: Promise<{
    pactId: string;
  }>;
};

// Check-in তৈরি করার জন্য সার্ভার অ্যাকশন
async function createCheckIn(formData: FormData) {
  'use server';

  const session = await auth();
  if (!session?.user) throw new Error('Unauthenticated');
  
  const pactId = formData.get('pactId') as string;
  const content = formData.get('content') as string;

  if (!content) throw new Error('Check-in content cannot be empty.');

  await prisma.checkIn.create({
    data: {
      content,
      pactId,
      authorId: session.user.id,
      status: CheckInStatus.ON_TRACK, 
    },
  });

  // সফলভাবে তৈরি হওয়ার পর পেজটি রিফ্রেশ করার জন্য রিডাইরেক্ট করা হচ্ছে
  redirect(`/pacts/${pactId}`);
}


export default async function PactDetailsPage({ params }: PactDetailsPageProps) {
  const { pactId } = await params;
  
  // বর্তমান ব্যবহারকারীর সেশনও নিয়ে আসা হচ্ছে, যাতে kudo স্ট্যাটাস চেক করা যায়
  const session = await auth();

  const pact = await prisma.pact.findUnique({
    where: { id: pactId },
    include: {
      author: true, // Pact-এর লেখক
      checkIns: {
        orderBy: { createdAt: 'desc' }, // নতুন check-in আগে
        include: {
          author: true, // প্রতিটি check-in-এর লেখক
          kudos: true,  // প্রতিটি check-in-এর kudos-এর তালিকা
        },
      },
    },
  });

  if (!pact) {
    notFound();
  }
  
  const daysLeft = Math.ceil(
    (new Date(pact.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );


  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-12">
      {/* Pact Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {pact.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{pact.title}</h1>
        {pact.description && <p className="text-lg text-muted-foreground">{pact.description}</p>}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4 mt-4">
          <Link href={`/${pact.author.username || pact.author.id}`} className="flex items-center gap-2 hover:underline">
            <UserAvatar src={pact.author.image} fallback={pact.author.name?.charAt(0) ?? 'U'} className="h-8 w-8" />
            <span>{pact.author.name}</span>
          </Link>
          <span>•</span>
          <span>Deadline: {new Date(pact.deadline).toLocaleDateString()}</span>
          <span>•</span>
          <Badge variant={pact.isCompleted ? 'default' : 'outline'}>
            {pact.isCompleted ? 'Completed' : (daysLeft > 0 ? `${daysLeft} days left` : 'Overdue')}
          </Badge>
        </div>
      </header>

      {/* Check-in Form */}
      <section>
        <form action={createCheckIn}>
          <input type="hidden" name="pactId" value={pact.id} />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Post a new check-in</h2>
            <Textarea 
              name="content"
              placeholder="Share your progress, challenges, or milestones..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="mt-4">Post Update</Button>
        </form>
      </section>

      {/* Check-ins List */}
      <main>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-6">
          Recent Check-ins ({pact.checkIns.length})
        </h2>
        <div className="space-y-8">
          {pact.checkIns.length > 0 ? (
            pact.checkIns.map(checkIn => {
              // বর্তমান ব্যবহারকারী এই check-in-এ kudo দিয়েছে কি না তা নির্ধারণ করা হচ্ছে
              const userHasKudoed = checkIn.kudos.some(
                kudo => kudo.userId === session?.user?.id
              );

              return (
                <div key={checkIn.id} className="flex gap-4 items-start">
                    <Link href={`/${checkIn.author.username || checkIn.author.id}`}>
                        <UserAvatar src={checkIn.author.image} fallback={checkIn.author.name?.charAt(0) ?? 'U'} className="h-12 w-12" />
                    </Link>
                    <div className="flex-1">
                        <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Link href={`/${checkIn.author.username || checkIn.author.id}`} className="font-bold hover:underline">{checkIn.author.name}</Link>
                                <span className="text-xs text-muted-foreground">{new Date(checkIn.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-foreground/90 whitespace-pre-wrap">{checkIn.content}</p>
                        </div>
                        <div className="mt-1 flex items-center">
                          {/* KudoButton কম্পোনেন্ট এখানে ব্যবহার করা হচ্ছে */}
                          <KudoButton 
                            pactId={pact.id}
                            checkInId={checkIn.id}
                            initialKudosCount={checkIn.kudos.length}
                            userHasKudoed={userHasKudoed}
                          />
                        </div>
                    </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg bg-secondary">
              <p className="text-muted-foreground">Be the first to post a check-in for this pact!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}