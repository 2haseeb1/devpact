// components/pacts/KudoButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { toggleKudo } from '@/lib/actions/kudo.actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // tailwind-merge এবং clsx-এর জন্য

type KudoButtonProps = {
  pactId: string;
  checkInId: string;
  initialKudosCount: number;
  userHasKudoed: boolean;
};

export function KudoButton({ pactId, checkInId, initialKudosCount, userHasKudoed }: KudoButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI-এর জন্য State
  const [optimisticKudosCount, setOptimisticKudosCount] = useState(initialKudosCount);
  const [optimisticHasKudoed, setOptimisticHasKudoed] = useState(userHasKudoed);

  const handleClick = () => {
    startTransition(async () => {
      // Optimistic Update: সঙ্গে সঙ্গে UI পরিবর্তন করা হচ্ছে
      if (optimisticHasKudoed) {
        setOptimisticHasKudoed(false);
        setOptimisticKudosCount((prev) => prev - 1);
      } else {
        setOptimisticHasKudoed(true);
        setOptimisticKudosCount((prev) => prev + 1);
      }
      // ব্যাকগ্রাউন্ডে সার্ভার অ্যাকশনটি কল করা হচ্ছে
      await toggleKudo(checkInId, pactId);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn("flex items-center gap-2", {
        "text-pink-500 hover:text-pink-600": optimisticHasKudoed,
        "text-muted-foreground hover:text-foreground": !optimisticHasKudoed,
      })}
    >
      <span className="text-lg">💖</span>
      <span>{optimisticKudosCount}</span>
      <span className="sr-only">Kudos</span>
    </Button>
  );
}