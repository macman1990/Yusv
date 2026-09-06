'use client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const EDGE_URL = `${SUPABASE_URL}/functions/v1/admin-api`;

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('admin_token');
}

async function adminFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${EDGE_URL}/${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  async login(password: string) {
    const data = await adminFetch('auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password }),
    });
    if (data.token) setAdminToken(data.token);
    return data;
  },

  async logout() {
    const token = getAdminToken();
    try {
      await adminFetch('auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'logout', token }),
      });
    } catch {}
    clearAdminToken();
  },

  async verifySession(): Promise<boolean> {
    const token = getAdminToken();
    if (!token) return false;
    try {
      const data = await adminFetch('auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'verify', token }),
      });
      return data.valid === true;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return adminFetch('auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'change-password', currentPassword, newPassword }),
    });
  },

  async list<T = any>(table: string): Promise<T[]> {
    const data = await adminFetch(table);
    return data.data as T[];
  },

  async create<T = any>(table: string, item: Partial<T>): Promise<T> {
    const data = await adminFetch(table, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return data.data as T;
  },

  async update<T = any>(table: string, id: string, item: Partial<T>): Promise<T> {
    const data = await adminFetch(`${table}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return data.data as T;
  },

  async remove(table: string, id: string): Promise<void> {
    await adminFetch(`${table}/${id}`, { method: 'DELETE' });
  },

  async getSettings(): Promise<Record<string, any>> {
    const data = await adminFetch('settings');
    return data.data;
  },

  async updateSetting(key: string, value: any): Promise<void> {
    await adminFetch('settings', {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
  },

  async exportData(): Promise<Record<string, any>> {
    const data = await adminFetch('export');
    return data.data;
  },
};
