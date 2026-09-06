'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardShell } from '@/components/admin/dashboard-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      if (pathname === '/admin') {
        setReady(true);
        return;
      }
      const valid = await adminApi.verifySession();
      if (!valid) {
        router.replace('/admin');
        return;
      }
      setReady(true);
    })();
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (pathname === '/admin') return children;

  return <DashboardShell>{children}</DashboardShell>;
}
