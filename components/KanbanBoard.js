'use client';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import AddModal from './AddModal';
import ApplicationCard from './ApplicationCard';

const COLUMNS = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const COL = {
  Applied:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.15)',  glow: 'rgba(96,165,250,0.12)'  },
  Screening: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.15)',  glow: 'rgba(251,191,36,0.12)'  },
  Interview: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)', glow: 'rgba(167,139,250,0.12)' },
  Offer:     { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.15)',  glow: 'rgba(52,211,153,0.12)'  },
  Rejected:  { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)', glow: 'rgba(248,113,113,0.12)' },
};

export default function KanbanBoard({ initialApps, userName }) {
  const [apps, setApps]       = useState(initialApps);
  const [showAdd, setShowAdd] = useState(false);
  const [dragId, setDragId]   = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const byStatus = s => apps.filter(a => a.status === s);
  const total    = apps.length;
  const active   = apps.filter(a => a.status !== 'Rejected').length;
  const offers   = apps.filter(a => a.status === 'Offer').length;

  async function handleAdd(data) {
    const res = await fetch('/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    setApps(p => [created, ...p]);
    setShowAdd(false);
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 60,
        background: 'rgba(255,255,255,0.025)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
            Track<span style={{ color: '#a78bfa' }}>Jobs</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 14 }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            Hey, {userName?.split(' ')[0]}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Total',  value: total,  color: 'rgba(255,255,255,0.8)' },
              { label: 'Active', value: active, color: 'rgba(255,255,255,0.8)' },
              { label: 'Offers', value: offers, color: '#34d399' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', marginTop: 2 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowAdd(true)} style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700,
            padding: '8px 18px', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            transition: 'all 0.2s',
          }}>
            + Add Job
          </button>

          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
            fontSize: 12, cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </header>

      {/* Board */}
      <main style={{ flex: 1, overflowX: 'auto', padding: '28px 24px' }}>
        {apps.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
            <div style={{ fontSize: 32, opacity: 0.2 }}>◫</div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No applications yet</p>
            <button onClick={() => setShowAdd(true)} style={{
              background: 'none', border: 'none', color: '#a78bfa',
              fontSize: 13, cursor: 'pointer',
            }}>
              Add your first job →
            </button>
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
                {/* Column header */}
                <div style={{
                  padding: '14px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: c.color,
                      boxShadow: `0 0 8px ${c.color}`,
                      display: 'inline-block',
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.color, letterSpacing: '0.08em' }}>
                      {col.toUpperCase()}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: colApps.length ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 20, padding: '2px 8px',
                  }}>
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
                  {colApps.map(app => (
                    <ApplicationCard
                      key={app._id} app={app} colColor={c.color}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onDragStart={onDragStart}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
