import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#fff', fontFamily: 'inherit' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, background: 'rgba(8,8,16,0.9)',
        backdropFilter: 'blur(20px)', zIndex: 10,
      }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
          Track<span style={{ color: '#a78bfa' }}>Jobs</span>
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/signup" style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px' }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700,
          color: '#a78bfa', background: 'rgba(167,139,250,0.1)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 20, padding: '5px 14px', letterSpacing: '0.1em',
          marginBottom: 28,
        }}>
          FREE TO USE
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 900,
          lineHeight: 1.05, letterSpacing: '-0.03em',
          marginBottom: 24, maxWidth: 720, margin: '0 auto 24px',
        }}>
          Stop losing track of{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            your applications
          </span>
        </h1>

        <p style={{
          fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 480,
          margin: '0 auto 44px', lineHeight: 1.7,
        }}>
          A clean Kanban board to track every job you apply to — from applied to offer.
        </p>

        <Link href="/signup" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          padding: '14px 36px', borderRadius: 10, textDecoration: 'none',
          boxShadow: '0 0 40px rgba(124,58,237,0.4)',
        }}>
          Start tracking for free →
        </Link>
      </section>

      {/* Board preview */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '24px',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
        }}>
          {/* Fake header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Track<span style={{ color: '#a78bfa' }}>Jobs</span></span>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['6', 'TOTAL'], ['5', 'ACTIVE'], ['1', 'OFFERS']].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: l === 'OFFERS' ? '#34d399' : 'rgba(255,255,255,0.8)' }}>{v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fake columns */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
            {[
              { col: 'Applied',   color: '#60a5fa', cards: [{ company: 'Stripe', role: 'Frontend Engineer', loc: 'Remote', sal: '$130k' }, { company: 'Linear', role: 'React Developer', loc: 'Remote', sal: '$120k' }] },
              { col: 'Screening', color: '#fbbf24', cards: [{ company: 'Anthropic', role: 'Software Engineer', loc: 'SF', sal: '$160k' }] },
              { col: 'Interview', color: '#a78bfa', cards: [{ company: 'Vercel', role: 'Product Engineer', loc: 'Remote', sal: '$140k' }] },
              { col: 'Offer',     color: '#34d399', cards: [{ company: 'Figma', role: 'Senior Engineer', loc: 'SF', sal: '$180k' }] },
              { col: 'Rejected',  color: '#f87171', cards: [] },
            ].map(({ col, color, cards }) => (
              <div key={col} style={{ minWidth: 150, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em' }}>{col.toUpperCase()}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '1px 7px' }}>{cards.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cards.map(c => (
                    <div key={c.company} style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                      borderLeft: `3px solid ${color}`, borderRadius: 8, padding: '10px 12px',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{c.company}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{c.role}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', borderRadius: 3, padding: '2px 5px' }}>{c.loc}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', borderRadius: 3, padding: '2px 5px' }}>{c.sal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 100px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: '⬛', title: 'Kanban board', desc: '5 columns — Applied, Screening, Interview, Offer, Rejected. Drag and drop between them.' },
            { icon: '🔒', title: 'Private & secure', desc: 'Each account sees only their own applications. Passwords are encrypted.' },
            { icon: '📱', title: 'Works on mobile', desc: 'Add and manage applications from your phone between interviews.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '24px',
            }}>
              <div style={{ fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 100px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 40, textAlign: 'center' }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            {
              q: 'Is TrackJobs really free?',
              a: 'Yes. Create an account and track unlimited job applications for free. No credit card required.',
            },
            {
              q: 'What is a job application tracker?',
              a: 'A job application tracker helps you stay organized during your job search. Instead of losing track of where you applied in spreadsheets or sticky notes, you get a visual Kanban board that shows every application and its current status.',
            },
            {
              q: 'How is this better than a spreadsheet?',
              a: 'Spreadsheets work but they take effort to maintain. TrackJobs gives you a visual board where you drag cards between columns — Applied, Screening, Interview, Offer, Rejected — so the status of every application is clear at a glance.',
            },
            {
              q: 'Can I export my data?',
              a: 'Yes. Use the Export CSV button in the dashboard to download all your applications at any time.',
            },
            {
              q: 'Is my data private?',
              a: 'Yes. Each account is isolated — you only see your own applications. Passwords are hashed and never stored in plain text.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '20px 0',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{q}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Ready to get organized?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>
          Free forever. No credit card required.
        </p>
        <Link href="/signup" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          padding: '14px 36px', borderRadius: 10, textDecoration: 'none',
          boxShadow: '0 0 40px rgba(124,58,237,0.4)',
        }}>
          Create free account →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 800, fontSize: 14 }}>
          Track<span style={{ color: '#a78bfa' }}>Jobs</span>
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          Free job application tracker
        </span>
      </footer>
    </div>
  );
}
