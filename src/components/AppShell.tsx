import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    // Outside AppShell — return noop so callers don't have to guard.
    return { isOpen: false, open: () => {}, close: () => {}, toggle: () => {} };
  }
  return ctx;
}

export function AppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the drawer on route change.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open on mobile.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      <div className="relative flex h-dvh bg-surface text-on-surface overflow-hidden">
        {/* Sidebar — static on desktop, slide-in drawer on mobile */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 w-[86vw] max-w-[320px]',
            'bg-surface-container-lowest border-r border-white/5',
            'flex flex-col',
            'transform transition-transform duration-200 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full',
            'md:static md:translate-x-0 md:w-64 lg:w-72 md:max-w-none md:flex-shrink-0',
          ].join(' ')}
          aria-hidden={!isOpen ? undefined : undefined}
        >
          {sidebar}
        </aside>

        {/* Backdrop — mobile only, closes drawer on tap */}
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
          className={[
            'fixed inset-0 z-30 bg-black/60 md:hidden',
            'transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
          ].join(' ')}
        />

        {/* Main column */}
        <main id="main" className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
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
  const { toggle } = useSidebar();
  return (
    <header className="flex items-center gap-2 px-3 py-3 md:px-6 md:py-4 border-b border-white/5 bg-surface-container-low">
      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-white/5 active:bg-white/10 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="font-headline font-bold truncate text-[15px] md:text-base">{title}</div>
        {subtitle && (
          <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant truncate">
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>}
    </header>
  );
}

export function SidebarLogoHeader({ onNewThread }: { onNewThread: () => void }) {
  const { close } = useSidebar();
  return (
    <div className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-5 border-b border-white/5">
      <div className="flex items-center justify-between mb-5">
        <Link to="/" className="block" aria-label="AVL Copilot home">
          <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="AVL Copilot" className="h-7 w-auto" />
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
      <button
        onClick={onNewThread}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-black px-4 py-3 font-mono font-bold uppercase text-[10px] tracking-widest hover:bg-white active:bg-white transition-all rounded-full"
      >
        <span className="material-symbols-outlined text-base">add</span>
        New Thread
      </button>
    </div>
  );
}
