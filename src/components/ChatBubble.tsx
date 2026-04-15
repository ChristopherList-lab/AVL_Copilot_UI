import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import type { ChatMessage } from '../lib/types';

export function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-surface-container-high border border-white/10 px-4 py-3 text-sm text-on-surface leading-relaxed">
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Attached"
            className="mb-2 max-h-48 w-auto border border-white/5 object-cover"
          />
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}

export function AssistantBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-on-surface leading-relaxed">
        {message.content && <p className={message.steps?.length ? 'mb-3' : ''}>{message.content}</p>}
        {message.steps && message.steps.length > 0 && (
          <ol className="space-y-2 pl-4 list-decimal text-on-surface-variant marker:text-primary">
            {message.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="Copilot is typing">
      <div className="bg-primary/10 border border-primary/30 px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

interface ChatInputProps {
  onSend: (text: string, imageUrl?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Describe your issue...' }: ChatInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [attachedName, setAttachedName] = useState<string | null>(null);

  const clearAttachment = () => {
    if (attachedUrl) URL.revokeObjectURL(attachedUrl);
    setAttachedUrl(null);
    setAttachedName(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('msg') as HTMLInputElement;
    const text = input.value.trim();
    if (!text && !attachedUrl) return;
    onSend(text, attachedUrl ?? undefined);
    input.value = '';
    clearAttachment();
  };

  return (
    <form
      className="border-t border-white/5 bg-surface-container-high"
      onSubmit={handleSubmit}
    >
      {attachedUrl && (
        <div className="flex items-center gap-3 px-4 pt-3">
          <img
            src={attachedUrl}
            alt={attachedName ?? 'Attached image'}
            className="h-14 w-14 object-cover border border-white/10"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
              {attachedName}
            </div>
            <button
              type="button"
              onClick={clearAttachment}
              className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Attach image"
          title="Attach image"
          onClick={() => fileRef.current?.click()}
          className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">attach_file</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (attachedUrl) URL.revokeObjectURL(attachedUrl);
            setAttachedUrl(URL.createObjectURL(file));
            setAttachedName(file.name);
          }}
        />
        <input
          name="msg"
          type="text"
          placeholder={placeholder}
          aria-label="Describe your issue"
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 font-mono focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled}
          className="w-9 h-9 bg-primary flex items-center justify-center text-black hover:bg-white transition-all rounded-full disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">arrow_upward</span>
        </button>
      </div>
    </form>
  );
}
