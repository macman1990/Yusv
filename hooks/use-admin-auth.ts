'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useRouter, usePathname } from 'next/navigation';

export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const valid = await adminApi.verifySession();
      setAuthenticated(valid);
      setChecking(false);
      if (!valid && pathname !== '/admin') {
        router.replace('/admin');
      }
    })();
  }, [router, pathname]);

  return { authenticated, checking };
}
