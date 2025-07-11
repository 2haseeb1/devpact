// components/shared/Navbar.tsx

import Link from 'next/link';
import { auth, signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';

/**
 * এটি একটি বৈধ React Server Component কারণ এটি JSX (<form>) রিটার্ন করে।
 */
function SignInButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/dashboard' });
      }}
    >
      <Button type="submit">Sign In with GitHub</Button>
    </form>
  );
}

// Navbar একটি async Server Component এবং এটিকে অবশ্যই export করতে হবে
// যাতে 다른 فایل (যেমন layout.tsx) এটি ব্যবহার করতে পারে।
export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span>DevPact</span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}