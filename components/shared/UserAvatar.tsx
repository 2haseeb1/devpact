// components/shared/UserAvatar.tsx
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ Radix UI কম্পোনেন্টগুলো
              // স্টেট এবং ক্লায়েন্ট-সাইড ইন্টারঅ্যাকশন ব্যবহার করে।

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils"; // Tailwind ক্লাস মার্জ করার জন্য হেল্পার

// Props এর জন্য একটি টাইপ ডিফাইন করা হচ্ছে, যা কম্পোনেন্টকে নমনীয় করে তোলে
type UserAvatarProps = {
    src?: string | null;      // ছবির URL, যা ঐচ্ছিক
    fallback: string;         // ছবি না থাকলে যা দেখানো হবে (যেমন: নামের প্রথম অক্ষর)
    className?: string;       // অতিরিক্ত CSS ক্লাসের জন্য
}

export function UserAvatar({ src, fallback, className }: UserAvatarProps) {
    return (
        // AvatarPrimitive.Root হলো মূল কন্টেইনার
        <AvatarPrimitive.Root
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
        >
            {/* AvatarPrimitive.Image স্বয়ংক্রিয়ভাবে src লোড করার চেষ্টা করে */}
            <AvatarPrimitive.Image
                src={src ?? ''} // src null হলে একটি খালি স্ট্রিং পাস করা হচ্ছে
                alt="User Avatar"
                className="aspect-square h-full w-full"
            />
            {/* যদি Image লোড হতে ব্যর্থ হয় বা src না থাকে, তাহলে Fallback দেখানো হয় */}
            <AvatarPrimitive.Fallback
                className="flex h-full w-full items-center justify-center rounded-full bg-muted"
            >
                {fallback}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    )
}