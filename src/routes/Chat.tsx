import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell, SidebarLogoHeader, ThreadHeader } from '../components/AppShell';
import { AccountPopover } from '../components/AccountPopover';
import { ChatInput } from '../components/ChatBubble';
import { ChatThread } from '../components/ChatThread';
import { EmptyState } from '../components/EmptyState';
import { ThreadList } from '../components/ThreadList';
import { IconButton } from '../components/Buttons';
import { useThreads } from '../lib/threads';
import { createUserMessage } from '../lib/mock';

export function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const activeId = params.id;
  const {
    threads,
    getThread,
    createThread,
    appendMessage,
    renameThread,
    deleteThread,
    simulateAssistantReply,
  } = useThreads();

  const [typingThreadId, setTypingThreadId] = useState<string | null>(null);

  const activeThread = useMemo(() => (activeId ? getThread(activeId) : null), [activeId, getThread]);

  // If the active id was deleted, redirect to the empty state.
  useEffect(() => {
    if (activeId && !activeThread) {
      navigate('/', { replace: true });
    }
  }, [activeId, activeThread, navigate]);

  const handleStart = (text: string, imageUrl?: string) => {
    const thread = createThread(text, imageUrl);
    navigate(`/thread/${thread.id}`);
    // Trigger an assistant reply after typing delay.
    scheduleReply(thread.id, text, 1);
  };

  const handleSend = (text: string, imageUrl?: string) => {
    if (!activeThread) return;
    const userMsg = createUserMessage(text, imageUrl);
    appendMessage(activeThread.id, userMsg);
    scheduleReply(activeThread.id, text, activeThread.messages.length + 1);
  };

  const scheduleReply = (threadId: string, userText: string, messageCountBefore: number) => {
    setTypingThreadId(threadId);
    const delay = 1500 + Math.floor(Math.random() * 500);
    window.setTimeout(() => {
      simulateAssistantReply(threadId, userText, messageCountBefore);
      setTypingThreadId((curr) => (curr === threadId ? null : curr));
    }, delay);
  };

  const handleNewThread = () => {
    navigate('/');
  };

  const handleRename = () => {
    if (!activeThread) return;
    const next = prompt('Rename thread', activeThread.title);
    if (next && next.trim()) renameThread(activeThread.id, next.trim());
  };

  const handleDelete = (id: string) => {
    deleteThread(id);
    if (activeId === id) navigate('/');
  };

  const sidebar = (
    <>
      <SidebarLogoHeader onNewThread={handleNewThread} />
      <div className="flex-1 overflow-y-auto scroll-thin">
        <ThreadList
          threads={threads}
          activeId={activeId}
          onSelect={(id) => navigate(`/thread/${id}`)}
          onDelete={handleDelete}
        />
      </div>
      <AccountPopover />
    </>
  );

  return (
    <AppShell sidebar={sidebar}>
      {activeThread ? (
        <>
          <ThreadHeader
            title={activeThread.title}
            subtitle={`${activeThread.messages.length} messages`}
            actions={
              <>
                <IconButton label="Rename thread" onClick={handleRename}>
                  <span className="material-symbols-outlined text-base">edit</span>
                </IconButton>
                <IconButton
                  label="Delete thread"
                  onClick={() => {
                    if (confirm('Delete this thread?')) handleDelete(activeThread.id);
                  }}
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </IconButton>
              </>
            }
          />
          <ChatThread
            messages={activeThread.messages}
            isTyping={typingThreadId === activeThread.id}
          />
          <ChatInput onSend={handleSend} disabled={typingThreadId === activeThread.id} />
        </>
      ) : (
        <EmptyState onStart={handleStart} />
      )}
    </AppShell>
  );
}
