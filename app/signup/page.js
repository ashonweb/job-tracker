'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
  padding: '11px 14px', fontSize: 14, color: 'rgba(255,255,255,0.88)',
  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Track<span style={{ color: '#a78bfa' }}>Jobs</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Create your account — it's free</p>
        </div>

        <div style={{
          background: '#111118', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '32px 28px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 7 }}>NAME</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle} placeholder="Your name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 7 }}>EMAIL</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle} placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 7 }}>PASSWORD</label>
              <input type="password" required minLength={6} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={inputStyle} placeholder="Min. 6 characters" />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 7, padding: '8px 12px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: 4, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: '1px solid rgba(139,92,246,0.4)', borderRadius: 9,
              padding: '12px', fontSize: 14, fontWeight: 700, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 0 24px rgba(124,58,237,0.3)',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#a78bfa' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
