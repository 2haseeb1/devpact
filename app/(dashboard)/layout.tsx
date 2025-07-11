// app/(dashboard)/layout.tsx
import Link from 'next/link'; // next/link থেকে Link ইম্পোর্ট করতে হবে

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-secondary p-6 hidden md:block border-r">
        <h2 className="text-xl font-bold mb-6">DevPact Menu</h2>
        {/* --- মূল পরিবর্তন এখানে --- */}
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/pacts/new">New Pact</Link>
          {/* Add more links later */}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}