'use client';
import { useState, useMemo } from 'react';
import { signOut } from 'next-auth/react';
import AddModal from './AddModal';
import EditModal from './EditModal';
import ApplicationCard from './ApplicationCard';

const COLUMNS = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const COL = {
  Applied:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.15)',  glow: 'rgba(96,165,250,0.12)'  },
  Screening: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.15)',  glow: 'rgba(251,191,36,0.12)'  },
  Interview: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)', glow: 'rgba(167,139,250,0.12)' },
  Offer:     { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.15)',  glow: 'rgba(52,211,153,0.12)'  },
  Rejected:  { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)', glow: 'rgba(248,113,113,0.12)' },
};

function exportCSV(apps) {
  const headers = ['Company', 'Role', 'Status', 'Location', 'Salary', 'Job URL', 'Date Applied', 'Notes'];
  const rows = apps.map(a => [
    a.company, a.role, a.status, a.location || '', a.salary || '',
    a.jobUrl || '',
    new Date(a.dateApplied).toLocaleDateString(),
    (a.notes || '').replace(/"/g, '""'),
  ].map(v => `"${v}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'applications.csv'; a.click();
  URL.revokeObjectURL(url);
}

const FREE_LIMIT = 10;
const GUMROAD_URL = 'https://meghpal.gumroad.com/l/gpvho';

export default function KanbanBoard({ initialApps, userName, plan }) {
  const [apps, setApps]         = useState(initialApps);
  const [showAdd, setShowAdd]   = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [editApp, setEditApp]   = useState(null);
  const [search, setSearch]     = useState('');
  const [dragId, setDragId]     = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return apps;
    const q = search.toLowerCase();
    return apps.filter(a =>
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      (a.location || '').toLowerCase().includes(q)
    );
  }, [apps, search]);

  const byStatus = s => filtered.filter(a => a.status === s);
  const total  = apps.length;
  const active = apps.filter(a => a.status !== 'Rejected').length;
  const offers = apps.filter(a => a.status === 'Offer').length;

  function tryAdd() {
    if (plan !== 'pro' && apps.length >= FREE_LIMIT) {
      setShowUpgrade(true);
    } else {
      setShowAdd(true);
    }
  }

  async function handleAdd(data) {
    const res = await fetch('/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.status === 403) { setShowAdd(false); setShowUpgrade(true); return; }
    const created = await res.json();
    setApps(p => [created, ...p]);
    setShowAdd(false);
  }

  async function handleEdit(id, data) {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setApps(p => p.map(a => a._id === id ? updated : a));
    setEditApp(null);
  }

  async function handleDelete(id) {
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    setApps(p => p.filter(a => a._id !== id));
  }

  async function handleStatusChange(id, status) {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setApps(p => p.map(a => a._id === id ? { ...a, status } : a));
  }

  function onDragStart(e, id) { setDragId(id); e.dataTransfer.effectAllowed = 'move'; }
  function onDragOver(e, col) { e.preventDefault(); setDragOver(col); }
  function onDrop(e, col) {
    e.preventDefault();
    if (dragId) handleStatusChange(dragId, col);
    setDragId(null); setDragOver(null);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#080810' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(8,8,16,0.9)',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56 }}>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', flexShrink: 0 }}>
            Track<span style={{ color: '#a78bfa' }}>Jobs</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={tryAdd} style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700,
              padding: '8px 16px', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              whiteSpace: 'nowrap',
            }}>
              + Add Job
            </button>
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
              fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Stats + search row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '8px 20px', borderTop: '1px solid rgba(255,255,255,0.04)',
          gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Hey, {userName?.split(' ')[0]}
          </span>
          {[
            { label: 'Total',  value: total,  color: 'rgba(255,255,255,0.7)' },
            { label: 'Active', value: active, color: 'rgba(255,255,255,0.7)' },
            { label: 'Offers', value: offers, color: '#34d399' },
          ].map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</span>
            </div>
          ))}

          {/* Search */}
          <div style={{ flex: 1, minWidth: 140, maxWidth: 260, marginLeft: 'auto', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company, role…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                padding: '6px 10px 6px 26px', fontSize: 12,
                color: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Plan badge / limit */}
          {plan === 'pro' ? (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap' }}>
              ⚡ PRO
            </span>
          ) : (
            <button onClick={() => setShowUpgrade(true)} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
              padding: '3px 10px', fontSize: 10, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {apps.length}/{FREE_LIMIT} free
            </button>
          )}

          {/* CSV export */}
          <button onClick={() => exportCSV(apps)} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600,
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Export CSV
          </button>
        </div>
      </header>

      {/* Board */}
      <main style={{ flex: 1, overflowX: 'auto', padding: '20px 16px', WebkitOverflowScrolling: 'touch' }}>
        {apps.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
            <div style={{ fontSize: 32, opacity: 0.2 }}>◫</div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No applications yet</p>
            <button onClick={tryAdd} style={{
              background: 'none', border: 'none', color: '#a78bfa', fontSize: 13, cursor: 'pointer',
            }}>
              Add your first job →
            </button>
          </div>
        )}

        {search && filtered.length === 0 && apps.length > 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            No results for "{search}"
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
          {COLUMNS.map(col => {
            const c = COL[col];
            const colApps = byStatus(col);
            const isOver = dragOver === col;

            return (
              <div key={col}
                onDragOver={e => onDragOver(e, col)}
                onDrop={e => onDrop(e, col)}
                onDragLeave={() => setDragOver(null)}
                style={{
                  width: 280, display: 'flex', flexDirection: 'column',
                  background: isOver ? c.bg : 'rgba(255,255,255,0.018)',
                  border: `1px solid ${isOver ? c.border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  boxShadow: isOver ? `0 0 30px ${c.glow}` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  padding: '14px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}`, display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.color, letterSpacing: '0.08em' }}>
                      {col.toUpperCase()}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: colApps.length ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '2px 8px',
                  }}>
                    {colApps.length}
                  </span>
                </div>

                <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
                  {colApps.map(app => (
                    <ApplicationCard
                      key={app._id} app={app} colColor={c.color}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onDragStart={onDragStart}
                      onEdit={setEditApp}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editApp && <EditModal app={editApp} onClose={() => setEditApp(null)} onSave={handleEdit} />}

      {/* Upgrade modal */}
      {showUpgrade && (
        <div onClick={() => setShowUpgrade(false)} style={{
          position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: 16,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 420, background: '#111118',
            border: '1px solid rgba(167,139,250,0.2)', borderRadius: 20, padding: '36px 32px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.1)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
              You've hit the free limit
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
              Free accounts can track up to {FREE_LIMIT} applications.<br/>
              Upgrade to <strong style={{ color: '#a78bfa' }}>TrackJobs Pro</strong> for unlimited tracking.
            </p>
            <div style={{
              background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)',
              borderRadius: 12, padding: '16px 20px', marginBottom: 24,
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 2 }}>$6<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/month</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Unlimited applications · Cancel anytime</div>
            </div>
            <a href={GUMROAD_URL} target="_blank" rel="noreferrer" style={{
              display: 'block', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff', fontSize: 14, fontWeight: 700, padding: '13px',
              borderRadius: 10, textDecoration: 'none', marginBottom: 12,
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            }}>
              Upgrade to Pro →
            </a>
            <button onClick={() => setShowUpgrade(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
              fontSize: 12, cursor: 'pointer',
            }}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
