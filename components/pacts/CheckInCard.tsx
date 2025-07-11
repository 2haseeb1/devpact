// components/pacts/CheckInCard.tsx

import Link from "next/link";
import { Prisma } from '@prisma/client';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// --- সঠিক সমাধান ---
// `const` এর পরিবর্তে `type` ব্যবহার করে সরাসরি একটি টাইপ তৈরি করা হচ্ছে।
// এটি কোনো রানটাইম ভ্যালু তৈরি করে না।
type CheckInWithDetails = Prisma.CheckInGetPayload<{
  include: {
    author: { select: { name: true, image: true, username: true } };
    pact: { select: { id: true, title: true } };
    kudos: { select: { userId: true } };
  };
}>;


type CheckInCardProps = {
  // এখন আমরা সরাসরি আমাদের নতুন তৈরি করা টাইপটি ব্যবহার করছি
  checkIn: CheckInWithDetails;
};

export function CheckInCard({ checkIn }: CheckInCardProps) {
  const timeAgo = formatDistanceToNow(new Date(checkIn.createdAt), { addSuffix: true });

  const statusVariant = {
    MILESTONE: 'default',
    ON_TRACK: 'secondary',
    BLOCKED: 'destructive',
  }[checkIn.status] as "default" | "secondary" | "destructive" | "outline" | null | undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserAvatar 
            src={checkIn.author.image} 
            fallback={checkIn.author.name?.charAt(0) ?? 'U'} 
          />
          <div>
            <Link href={`/${checkIn.author.username}`} className="font-semibold hover:underline">
              {checkIn.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              posted a check-in for <Link href={`/pacts/${checkIn.pact.id}`} className="font-medium text-primary hover:underline">{checkIn.pact.title}</Link>
            </p>
          </div>
          <time className="ml-auto text-xs text-muted-foreground">{timeAgo}</time>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{checkIn.content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Badge variant={statusVariant}>{checkIn.status.replace('_', ' ')}</Badge>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{checkIn.kudos.length} Kudos</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>0 Comments</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}