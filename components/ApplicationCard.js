'use client';
import { useState } from 'react';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationCard({ app, onDelete, onStatusChange, onDragStart }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, app._id)}
      className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight truncate">{app.company}</div>
          <div className="text-white/50 text-xs truncate mt-0.5">{app.role}</div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-white/20 hover:text-white/60 text-xs flex-shrink-0 mt-0.5 transition-colors"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2.5">
        {app.location && (
          <span className="text-white/30 text-xs truncate">{app.location}</span>
        )}
        <span className="text-white/20 text-xs ml-auto flex-shrink-0">{date}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.07] space-y-3">
          {app.salary && (
            <div className="text-xs text-white/40">{app.salary}</div>
          )}
          {app.notes && (
            <p className="text-xs text-white/50 leading-relaxed">{app.notes}</p>
          )}
          {app.jobUrl && (
            <a
              href={app.jobUrl} target="_blank" rel="noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors block truncate"
            >
              View posting →
            </a>
          )}

          {/* Move to */}
          <div>
            <div className="text-xs text-white/25 mb-1.5">Move to</div>
            <div className="flex flex-wrap gap-1">
              {STATUSES.filter(s => s !== app.status).map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(app._id, s)}
                  className="text-xs px-2 py-0.5 rounded border border-white/10 hover:border-white/30 text-white/40 hover:text-white/80 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onDelete(app._id)}
            className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
