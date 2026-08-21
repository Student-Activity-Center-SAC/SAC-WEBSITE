'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login failed');
      toast.success(`Welcome back, ${data.name}!`);
      window.location.href = '/admin';
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--muted)' }}>
      <div className="w-full max-w-md rounded-2xl border shadow-lg p-8"
           style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">⚡</div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>KL SAC Admin</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Sign in to manage website content</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required
                   className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
                   style={{ borderColor: 'var(--border)', background: 'var(--muted)',
                            '--tw-ring-color': 'var(--primary)' } as any} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                   className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
                   style={{ borderColor: 'var(--border)', background: 'var(--muted)' }} />
          </div>
          <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white mt-2 transition-opacity disabled:opacity-60"
                  style={{ background: 'var(--primary)' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
