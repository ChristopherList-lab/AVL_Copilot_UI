import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function AccountPopover() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!user) return null;

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="px-5 py-4 border-t border-white/5 relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 w-full text-left hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center font-mono text-xs text-primary">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">{user.name}</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest truncate">
            {user.role}
          </div>
        </div>
        <span className="material-symbols-outlined text-base text-on-surface-variant">more_vert</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-[calc(100%+4px)] left-3 right-3 bg-surface-container-highest border border-white/10 py-1 shadow-xl"
        >
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-white/5"
            role="menuitem"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            Settings
          </Link>
          <a
            href="mailto:support@maybeck.com"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-white/5"
            role="menuitem"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            Talk to a human
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
              navigate('/signin');
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
