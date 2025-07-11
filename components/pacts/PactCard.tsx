// components/pacts/PactCard.tsx

import Link from "next/link";
import { Prisma } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";

// This directly creates the type we need without an intermediate variable.
// It describes a 'Pact' that also includes specific fields from its author.
export type PactWithAuthor = Prisma.PactGetPayload<{
  include: {
    author: {
      select: { name: true, image: true, username: true }
    }
  }
}>;

// Define the props for our component. It expects one prop: `pact`.
type PactCardProps = {
  pact: PactWithAuthor;
};

export function PactCard({ pact }: PactCardProps) {
  // The rest of your component remains exactly the same...
  return (
    <Link href={`/pacts/${pact.id}`} className="block group">
      <Card className="h-full flex flex-col transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary">{pact.title}</CardTitle>
          <CardDescription>
            Deadline: {new Date(pact.deadline).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>

        <div className="flex-grow" />

        <CardFooter>
          <div className="flex items-center gap-2">
            <UserAvatar
              src={pact.author.image}
              fallback={pact.author.name?.charAt(0).toUpperCase() ?? 'U'}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {pact.author.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}