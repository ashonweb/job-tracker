'use client';
import { useState } from 'react';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationCard({ app, colColor, onDelete, onStatusChange, onDragStart }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, app._id)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${colColor}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'grab',
        transition: 'background 0.15s, transform 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {app.company}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {app.role}
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
            cursor: 'pointer', fontSize: 10, padding: '2px 4px', flexShrink: 0,
            marginTop: 2,
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        {app.location && (
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.28)',
            background: 'rgba(255,255,255,0.05)', borderRadius: 4,
            padding: '2px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100,
          }}>
            {app.location}
          </span>
        )}
        {app.salary && (
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.28)',
            background: 'rgba(255,255,255,0.05)', borderRadius: 4,
            padding: '2px 6px',
          }}>
            {app.salary}
          </span>
        )}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto', flexShrink: 0 }}>
          {date}
        </span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {app.notes && (
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 10 }}>
              {app.notes}
            </p>
          )}
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noreferrer" style={{
              fontSize: 11, color: '#a78bfa', display: 'block',
              marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              View posting →
            </a>
          )}

          {/* Move to */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: 6 }}>MOVE TO</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {STATUSES.filter(s => s !== app.status).map(s => (
                <button key={s} onClick={() => onStatusChange(app._id, s)} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 5,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => onDelete(app._id)} style={{
            background: 'none', border: 'none',
            color: 'rgba(248,113,113,0.45)', fontSize: 11,
            cursor: 'pointer', padding: 0,
          }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
