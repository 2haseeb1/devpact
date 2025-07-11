// components/auth/SignInCard.tsx
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// GitHub আইকনের জন্য একটি সহজ SVG কম্পোনেন্ট
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}

export function SignInCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to DevPact</CardTitle>
        <CardDescription>Sign in to create your pacts and track your progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full"
          // `signIn` ফাংশনটি কল করা হচ্ছে।
          // প্রথম আর্গুমেন্ট হলো প্রোভাইডারের আইডি ('github')।
          // দ্বিতীয় আর্গুমেন্টে আমরা `callbackUrl` পাস করছি, যা লগইনের পর ব্যবহারকারীকে ড্যাশবোর্ডে নিয়ে যাবে।
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
        >
          <GitHubIcon className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}