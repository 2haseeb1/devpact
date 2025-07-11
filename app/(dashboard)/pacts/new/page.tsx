// app/(dashboard)/pacts/new/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/**
 * এটি একটি সার্ভার অ্যাকশন যা ফর্ম সাবমিট হলে চলবে।
 * এটি ফর্ম থেকে ডেটা নিয়ে ডেটাবেসে একটি নতুন pact তৈরি করবে।
 */
async function createPact(formData: FormData) {
  'use server';

  const session = await auth();
  // সার্ভার অ্যাকশনের ভেতরে অথেন্টিকেশন চেক করা একটি ভালো অভ্যাস
  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a pact.');
  }

  // ফর্ম থেকে ডেটাগুলো alın
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const deadline = formData.get('deadline') as string;
  const tags = formData.get('tags') as string;

  // বেসিক ডেটা ভ্যালিডেশন
  if (!title || !deadline) {
    throw new Error('Title and deadline are required fields.');
  }

  // ট্যাগগুলোকে কমা দিয়ে ভাগ করে একটি অ্যারেতে পরিণত করা হচ্ছে
  // এবং খালি ট্যাগ বাদ দেওয়া হচ্ছে
  const tagsArray = tags ? tags.split(',').map(tag => `#${tag.trim().replace(/^#/, '')}`).filter(tag => tag.length > 1) : [];


  // Prisma ব্যবহার করে ডেটাবেসে নতুন pact তৈরি করা হচ্ছে
  await prisma.pact.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      tags: tagsArray,
      authorId: session.user.id,
    },
  });

  // সফলভাবে তৈরি হওয়ার পর ব্যবহারকারীকে ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে
  redirect('/dashboard');
}

/**
 * এটি New Pact পেজের জন্য React Server Component
 */
export default async function NewPactPage() {
    // এই পেজটি সুরক্ষিত, তাই middleware এটিকে রক্ষা করবে।
    // আমরা এখানেও একবার সেশন চেক করতে পারি বাড়তি সুরক্ষার জন্য।
    const session = await auth();
    if (!session) {
        redirect('/api/auth/signin');
    }

  return (
    // এই UI টি এখন (dashboard) গ্রুপের লেআউটের <main> ট্যাগের ভেতরে রেন্ডার হবে (যদি লেআউট থাকে)
    <div className="mx-auto max-w-3xl">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Pact</h1>
        <p className="text-muted-foreground">
          What new goal will you commit to today?
        </p>
      </div>
      
      <form action={createPact} className="space-y-6 rounded-lg border p-8 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Pact Title</Label>
          <Input id="title" name="title" placeholder="e.g., Master Next.js App Router in 30 Days" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Describe your goal, why it's important, and how you'll achieve it..."
            rows={5}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="e.g., learning, nextjs, react" />
          </div>
        </div>
        
        <Button type="submit" className="w-full">Create and Commit</Button>
      </form>
    </div>
  );
}