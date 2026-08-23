'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server did not respond correctly. Please try again.');
      }

      if (!res.ok) throw new Error(data?.error ?? 'Login failed');

      toast.success(`Welcome back, ${data.name}!`);
      window.location.href = '/admin';
    } catch (err: any) {
      toast.error(err.message ?? 'Login failed');
      setPassword('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
         style={{ background: '#F7F7F8' }}>
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl border shadow-sm p-8 sm:p-10"
             style={{ background: '#fff', borderColor: '#E4E4E7' }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: '#8B000012' }}>
              <Lock size={20} style={{ color: '#8B0000' }} />
            </div>
            <h1 className="text-xl font-black" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
              KL SAC Admin
            </h1>
            <p className="text-sm mt-1.5" style={{ color: '#71717A' }}>
              Sign in to manage website content
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-bold" style={{ color: '#0D0D0D' }}>
                Username
              </label>
              <div className="relative">
                <User size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#A1A1AA' }} />
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                  placeholder="Your admin username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-shadow
                             focus:ring-2 focus:ring-offset-0 disabled:opacity-60"
                  style={{
                    borderColor: '#E4E4E7',
                    background: '#F7F7F8',
                    ['--tw-ring-color' as any]: '#8B000030',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-bold" style={{ color: '#0D0D0D' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#A1A1AA' }} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm outline-none transition-shadow
                             focus:ring-2 focus:ring-offset-0 disabled:opacity-60"
                  style={{
                    borderColor: '#E4E4E7',
                    background: '#F7F7F8',
                    ['--tw-ring-color' as any]: '#8B000030',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                             flex items-center justify-center transition-colors hover:bg-black/5">
                  {showPassword
                    ? <EyeOff size={15} style={{ color: '#71717A' }} />
                    : <Eye    size={15} style={{ color: '#71717A' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1
                         flex items-center justify-center gap-2
                         transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#8B0000' }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#A1A1AA' }}>
          Student Activity Centre · KL University
        </p>
      </div>
    </div>
  );
}
