import { STARTER_PROMPTS } from '../lib/mock';
import { ChatInput } from './ChatBubble';

interface EmptyStateProps {
  onStart: (text: string, imageUrl?: string) => void;
}

export function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-2xl text-center">
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase mb-4">
            // AVL Copilot
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-8">
            What can we troubleshoot?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onStart(prompt)}
                className="text-left px-4 py-3 bg-surface-container-low border border-white/5 text-sm text-on-surface hover:border-primary/40 hover:bg-primary/5 transition-all"
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
