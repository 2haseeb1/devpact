// app/(dashboard)/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-secondary p-6 hidden md:block border-r">
        <h2 className="text-xl font-bold mb-6">DevPact Menu</h2>
        {/* এখানে আপনি ড্যাশবোর্ডের নেভিগেশন লিঙ্কগুলো রাখতে পারেন */}
        <nav className="flex flex-col gap-4">
          <a href="/dashboard">Dashboard</a>
          <a href="/pacts/new">New Pact</a>
          {/* Add more links later */}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}