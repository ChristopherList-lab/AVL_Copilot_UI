import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden">
      {/* Main column */}
      <aside className="w-64 lg:w-72 flex-shrink-0 bg-surface-container-lowest border-r border-white/5 flex flex-col">
        {sidebar}
      </aside>
      <main id="main" className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}

export function ThreadHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-container-low">
      <div className="min-w-0">
        <div className="font-headline font-bold truncate">{title}</div>
        {subtitle && (
          <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

export function SidebarLogoHeader({ onNewThread }: { onNewThread: () => void }) {
  return (
    <div className="px-5 py-5 border-b border-white/5">
      <Link to="/" className="block mb-5" aria-label="AVL Copilot home">
        <img src="/logo-icon.png" alt="AVL Copilot" className="h-7 w-auto" />
      </Link>
      <button
        onClick={onNewThread}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-black px-4 py-2.5 font-mono font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all rounded-full"
      >
        <span className="material-symbols-outlined text-base">add</span>
        New Thread
      </button>
    </div>
  );
}
