// components/ui/card.tsx

import * as React from "react";
import { cn } from "@/lib/utils"; // আমাদের তৈরি করা Tailwind ক্লাস মার্জিং হেল্পার

// --- মূল কার্ড কন্টেইনার ---
// এটি কার্ডের বাইরের বর্ডার এবং ব্যাকগ্রাউন্ড প্রদান করে।
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// --- কার্ডের হেডার সেকশন ---
// এটি সাধারণত কার্ডের উপরের অংশে থাকে এবং টাইটেল ও বিবরণ ধারণ করে।
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// --- কার্ডের টাইটেল ---
// এটি সেমান্টিকভাবে একটি হেডিং (h3) এবং বড় ফন্টে প্রদর্শিত হয়।
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// --- কার্ডের বিবরণ ---
// এটি টাইটেলের নিচে একটি ছোট এবং হালকা রঙের টেক্সট হিসেবে থাকে।
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// --- কার্ডের মূল কন্টেন্ট সেকশন ---
// এটি কার্ডের বডি, যেখানে মূল তথ্য বা উপাদানগুলো থাকে।
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// --- কার্ডের ফুটার সেকশন ---
// এটি কার্ডের একেবারে নিচের অংশ, যেখানে সাধারণত বাটন বা অতিরিক্ত তথ্য থাকে।
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// সব কম্পোনেন্ট একসাথে এক্সপোর্ট করা হচ্ছে
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };