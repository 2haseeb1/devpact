// components/shared/UserNav.tsx
'use client'; 

import type { User } from "next-auth";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth.actions"; // আমরা এখন সার্ভার অ্যাকশন ব্যবহার করব

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";

type UserNavProps = {
  user: User;
};

export function UserNav({ user }: UserNavProps) {
  // যদি কোনো কারণে user অবজেক্ট না থাকে, তাহলে কিছুই রেন্ডার হবে না
  if (!user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar
            src={user.image ?? null}
            fallback={user.name?.charAt(0).toUpperCase() ?? 'U'}
          />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* প্রোফাইল পেজের লিঙ্ক */}
          <Link href={`/${user.username || user.id}`}>My Profile</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* --- মূল পরিবর্তন এখানে --- */}
        {/* Sign Out করার জন্য একটি ফর্ম এবং তার ভেতরে একটি বাটন */}
        {/* `action={signOut}` সরাসরি আমাদের সার্ভার অ্যাকশনটিকে কল করবে */}
        <DropdownMenuItem asChild>
           <form action={signOut} className="w-full">
              <button 
                type="submit" 
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left"
              >
                Sign Out
              </button>
           </form>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}