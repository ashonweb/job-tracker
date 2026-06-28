'use client';
import { useState } from 'react';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export default function AddModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ company: '', role: '', location: '', jobUrl: '', salary: '', status: 'Applied', notes: '' });
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-base">Add Application</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Company *</label>
              <input required value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="Google" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Role *</label>
              <input required value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="Frontend Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="Remote" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Salary</label>
              <input value={form.salary} onChange={e => set('salary', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="$120k–140k" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Job URL</label>
            <input type="url" value={form.jobUrl} onChange={e => set('jobUrl', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
              placeholder="https://jobs.google.com/..." />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors text-white">
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#13131a]">{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
              placeholder="Referral from John, recruiter name, next steps…" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-white/10 rounded-lg py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg py-2.5 text-sm font-semibold transition-colors">
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
