'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/components/providers/app-provider';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useApp();

  useEffect(() => {
    (async () => {
      const valid = await adminApi.verifySession();
      if (valid) router.replace('/admin/dashboard');
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      await adminApi.login(password);
      toast.success(locale === 'ar' ? 'تم تسجيل الدخول' : 'Login successful');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-3 w-3" />
          {locale === 'ar' ? 'العودة للموقع' : 'Back to site'}
        </Link>

        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
            <Lock className="h-5 w-5 text-accent" />
          </div>

          <h1 className="font-heading text-2xl font-bold mb-2">
            {locale === 'ar' ? 'لوحة التحكم' : 'Admin Access'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {locale === 'ar' ? 'أدخل كلمة المرور للوصول إلى لوحة الإدارة' : 'Enter your password to access the dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'}
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-lg font-medium text-sm hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {locale === 'ar' ? 'دخول' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
