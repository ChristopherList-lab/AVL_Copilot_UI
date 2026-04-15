import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../lib/types';
import { AssistantBubble, TypingIndicator, UserBubble } from './ChatBubble';

interface ChatThreadProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatThread({ messages, isTyping }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto scroll-thin px-6 py-6 space-y-5"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((m) =>
        m.role === 'user' ? (
          <UserBubble key={m.id} message={m} />
        ) : (
          <AssistantBubble key={m.id} message={m} />
        ),
      )}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
