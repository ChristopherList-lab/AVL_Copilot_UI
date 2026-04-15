import type { Thread } from '../lib/types';

interface ThreadListProps {
  threads: Thread[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ThreadList({ threads, activeId, onSelect, onDelete }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="px-5 py-6 text-sm text-on-surface-variant">
        <div className="font-headline text-on-surface mb-1">No threads yet.</div>
        <div>Start one above.</div>
      </div>
    );
  }

  return (
    <ul className="py-2">
      {threads.map((t, i) => {
        const active = t.id === activeId;
        return (
          <li
            key={t.id}
            className="thread-fade-in group relative"
            style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
          >
            <button
              onClick={() => onSelect(t.id)}
              className={[
                'w-full text-left pl-5 pr-12 py-3 text-sm transition-colors border-l-2',
                active
                  ? 'bg-primary/10 text-on-surface border-primary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-transparent',
              ].join(' ')}
            >
              <div className="truncate">{t.title}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
                {formatShortDate(t.lastMessageAt)}
              </div>
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this thread?')) onDelete(t.id);
              }}
              aria-label="Delete thread"
              title="Delete thread"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-red-400 hover:bg-red-500/10"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
