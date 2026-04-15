import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatMessage, Thread } from './types';
import { SEED_THREADS, createUserMessage, generateAssistantReply, newThread, deriveThreadTitle } from './mock';

const STORAGE_KEY = 'avl.threads';
const SEEDED_KEY = 'avl.threadsSeeded';

function loadThreads(): Thread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Thread[];
  } catch {
    /* fallthrough */
  }
  // First launch — seed with the sample threads so the UI has life.
  if (!localStorage.getItem(SEEDED_KEY)) {
    localStorage.setItem(SEEDED_KEY, '1');
    return SEED_THREADS;
  }
  return [];
}

function persistThreads(threads: Thread[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads());

  useEffect(() => {
    persistThreads(threads);
  }, [threads]);

  const sorted = useMemo(
    () => [...threads].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    [threads],
  );

  const getThread = useCallback(
    (id: string) => threads.find((t) => t.id === id) ?? null,
    [threads],
  );

  const createThread = useCallback((firstMessageText: string, imageUrl?: string): Thread => {
    const firstMessage = createUserMessage(firstMessageText, imageUrl);
    const thread = newThread(firstMessage);
    setThreads((curr) => [thread, ...curr]);
    return thread;
  }, []);

  const appendMessage = useCallback((threadId: string, message: ChatMessage) => {
    setThreads((curr) =>
      curr.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, message],
              lastMessageAt: message.timestamp,
              title: t.messages.length === 0 ? deriveThreadTitle(message.content) : t.title,
            }
          : t,
      ),
    );
  }, []);

  const renameThread = useCallback((threadId: string, title: string) => {
    setThreads((curr) => curr.map((t) => (t.id === threadId ? { ...t, title } : t)));
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    setThreads((curr) => curr.filter((t) => t.id !== threadId));
  }, []);

  const simulateAssistantReply = useCallback(
    (threadId: string, userText: string, messageCountBefore: number) => {
      const reply = generateAssistantReply(userText, messageCountBefore);
      appendMessage(threadId, reply);
      return reply;
    },
    [appendMessage],
  );

  return {
    threads: sorted,
    getThread,
    createThread,
    appendMessage,
    renameThread,
    deleteThread,
    simulateAssistantReply,
  };
}
