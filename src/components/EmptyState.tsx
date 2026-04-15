import { STARTER_PROMPTS } from '../lib/mock';
import { ChatInput } from './ChatBubble';
import { useSidebar } from './AppShell';

interface EmptyStateProps {
  onStart: (text: string, imageUrl?: string) => void;
}

export function EmptyState({ onStart }: EmptyStateProps) {
  const { toggle } = useSidebar();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mobile-only top bar so the hamburger is reachable from empty state */}
      <header className="md:hidden flex items-center gap-2 px-3 py-3 border-b border-white/5 bg-surface-container-low">
        <button
          type="button"
          onClick={toggle}
          aria-label="Open menu"
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <img
          src={`${import.meta.env.BASE_URL}logo-icon.png`}
          alt="AVL Copilot"
          className="h-6 w-auto"
        />
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-8 md:py-10 overflow-y-auto">
        <div className="w-full max-w-2xl text-center">
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase mb-3 md:mb-4">
            // AVL Copilot
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight mb-6 md:mb-8 leading-[1.05]">
            What can we troubleshoot?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onStart(prompt)}
                className="text-left px-4 py-3.5 md:py-3 bg-surface-container-low border border-white/5 text-[15px] md:text-sm text-on-surface hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ChatInput onSend={onStart} />
    </div>
  );
}
