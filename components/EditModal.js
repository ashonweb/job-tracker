'use client';
import { useState } from 'react';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: 'rgba(255,255,255,0.88)',
  outline: 'none', transition: 'border-color 0.15s', fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block', fontSize: 10, fontWeight: 600,
  color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 6,
};

export default function EditModal({ app, onClose, onSave }) {
  const [form, setForm] = useState({
    company: app.company || '', role: app.role || '',
    location: app.location || '', salary: app.salary || '',
    jobUrl: app.jobUrl || '', status: app.status || 'Applied',
    notes: app.notes || '',
  });
  const [loading, setLoading] = useState(false);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSave(app._id, form);
    setLoading(false);
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, background: '#111118',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Edit Application</h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{app.company}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 16,
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>COMPANY *</label>
              <input required value={form.company} onChange={e => set('company', e.target.value)} style={inputStyle} placeholder="Stripe" />
            </div>
            <div>
              <label style={labelStyle}>ROLE *</label>
              <input required value={form.role} onChange={e => set('role', e.target.value)} style={inputStyle} placeholder="Frontend Engineer" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>LOCATION</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} style={inputStyle} placeholder="Remote" />
            </div>
            <div>
              <label style={labelStyle}>SALARY</label>
              <input value={form.salary} onChange={e => set('salary', e.target.value)} style={inputStyle} placeholder="$120k–140k" />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>JOB URL</label>
            <input type="url" value={form.jobUrl} onChange={e => set('jobUrl', e.target.value)} style={inputStyle} placeholder="https://..." />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>STATUS</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#111118' }}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>NOTES</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              placeholder="Recruiter name, referral, next steps…" />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
              padding: '11px', fontSize: 13, color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: '1px solid rgba(139,92,246,0.4)', borderRadius: 9,
              padding: '11px', fontSize: 13, fontWeight: 700,
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
