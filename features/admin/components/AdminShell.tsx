'use client';

import { useState } from 'react';

import { Navbar } from '@/features/admin/components/Navbar';
import { Sidebar } from '@/features/admin/components/Sidebar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { useAdminProtection } from '@/features/admin/hooks/useAdminProtection';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAdminProtection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton mode="shell" />;
  }

  const userName = user?.email?.split('@')[0] ?? 'Admin';

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar userName={userName} onMenuClick={() => setSidebarOpen((open) => !open)} />
          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
