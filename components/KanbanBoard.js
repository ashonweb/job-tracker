'use client';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import AddModal from './AddModal';
import ApplicationCard from './ApplicationCard';

const COLUMNS = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const COL_STYLES = {
  Applied:   { dot: 'bg-blue-400',   label: 'text-blue-400',   border: 'border-blue-400/20' },
  Screening: { dot: 'bg-amber-400',  label: 'text-amber-400',  border: 'border-amber-400/20' },
  Interview: { dot: 'bg-violet-400', label: 'text-violet-400', border: 'border-violet-400/20' },
  Offer:     { dot: 'bg-emerald-400',label: 'text-emerald-400',border: 'border-emerald-400/20' },
  Rejected:  { dot: 'bg-red-400',    label: 'text-red-400',    border: 'border-red-400/20' },
};

export default function KanbanBoard({ initialApps, userName }) {
  const [apps, setApps]         = useState(initialApps);
  const [showAdd, setShowAdd]   = useState(false);
  const [dragId, setDragId]     = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const byStatus = status => apps.filter(a => a.status === status);
  const total    = apps.length;
  const active   = apps.filter(a => !['Rejected'].includes(a.status)).length;
  const offers   = apps.filter(a => a.status === 'Offer').length;

  async function handleAdd(data) {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    setApps(prev => [created, ...prev]);
    setShowAdd(false);
  }

  async function handleDelete(id) {
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    setApps(prev => prev.filter(a => a._id !== id));
  }

  async function handleStatusChange(id, status) {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setApps(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  }

  function onDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, col) {
    e.preventDefault();
    setDragOver(col);
  }

  function onDrop(e, col) {
    e.preventDefault();
    if (dragId) handleStatusChange(dragId, col);
    setDragId(null);
    setDragOver(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight">TrackJobs</span>
          <span className="text-white/20 text-sm hidden sm:block">·</span>
          <span className="text-white/40 text-sm hidden sm:block">Hey, {userName?.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-5 text-sm text-white/40">
            <span><span className="text-white font-semibold">{total}</span> total</span>
            <span><span className="text-white font-semibold">{active}</span> active</span>
            <span><span className="text-emerald-400 font-semibold">{offers}</span> offers</span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Job
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-x-auto p-6">
        {apps.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-white/25 text-sm gap-3">
            <p>No applications yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-violet-400 hover:text-violet-300 transition-colors">
              Add your first job →
            </button>
          </div>
        )}

        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(col => {
            const s = COL_STYLES[col];
            const colApps = byStatus(col);
            const isOver = dragOver === col;
            return (
              <div
                key={col}
                onDragOver={e => onDragOver(e, col)}
                onDrop={e => onDrop(e, col)}
                onDragLeave={() => setDragOver(null)}
                className={`w-72 flex flex-col rounded-xl border transition-colors ${isOver ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}
              >
                {/* Column header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                    <span className={`text-xs font-semibold ${s.label}`}>{col}</span>
                  </div>
                  <span className="text-xs text-white/30 font-medium">{colApps.length}</span>
                </div>

                {/* Cards */}
                <div className="flex-1 p-3 flex flex-col gap-2 min-h-[200px]">
                  {colApps.map(app => (
                    <ApplicationCard
                      key={app._id}
                      app={app}
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
