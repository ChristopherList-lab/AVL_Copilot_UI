import type { ChatMessage, Thread } from './types';
import mockData from './mock-data.json';

export const STARTER_PROMPTS: string[] = mockData.starter_prompts;
export const SEED_THREADS: Thread[] = mockData.threads as Thread[];
export const SEED_USER = mockData.user;

// A rotating pool of canned assistant replies lifted from the seed threads.
const ASSISTANT_POOL: Omit<ChatMessage, 'id' | 'timestamp'>[] = (mockData.threads as Thread[])
  .flatMap((t) => t.messages)
  .filter((m) => m.role === 'assistant')
  .map((m) => ({ role: 'assistant' as const, content: m.content, steps: m.steps }));

// Heuristic first-reply for starter prompts: pick a canned diagnostic.
const STARTER_REPLIES: Array<{ match: RegExp; reply: Omit<ChatMessage, 'id' | 'timestamp'> }> = [
  {
    match: /mic|wireless|dropout|cutting/i,
    reply: {
      role: 'assistant',
      content: 'Let me narrow this down:',
      steps: [
        'What frequency band and channel count are running?',
        'Any LED walls or panels within 10 feet of the antennas?',
        'Has the dropout started recently or been ongoing?',
      ],
    },
  },
  {
    match: /dmx|flicker|truss|terminate/i,
    reply: {
      role: 'assistant',
      content: 'Sounds like a DMX signal integrity issue. Two quick checks:',
      steps: [
        'Is a 120-ohm terminator in place at the last fixture?',
        'What is the total cable run from console to last fixture?',
      ],
    },
  },
  {
    match: /projector|no signal|switcher/i,
    reply: {
      role: 'assistant',
      content: 'Switcher output drops are usually EDID or cable. Try:',
      steps: [
        'Swap the HDMI/SDI cable between switcher and projector.',
        'Force-output the switcher to 1080p60 and confirm the projector is set to auto.',
      ],
    },
  },
  {
    match: /buzz|hum|ground|led/i,
    reply: {
      role: 'assistant',
      content: 'Classic LED-driver hum on a shared ground. Try:',
      steps: [
        'Isolate the LED circuit on its own breaker and test.',
        'Insert a Jensen or Radial DI with the ground lift engaged on the offending channel.',
      ],
    },
  },
  {
    match: /gain|chapel|structure|mixer/i,
    reply: {
      role: 'assistant',
      content: 'Start clean at the source, then work forward:',
      steps: [
        'Set each mic preamp so peaks sit around -18 dBFS on the console meter.',
        'Leave channel faders at unity, ride the subgroup/bus to taste.',
        'Keep your master at unity — never make up gain there.',
      ],
    },
  },
];

function idFor(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function generateAssistantReply(userText: string, messageCount: number): ChatMessage {
  const now = new Date().toISOString();
  // First reply in a thread: try to match a starter prompt diagnostic.
  if (messageCount <= 1) {
    const match = STARTER_REPLIES.find((r) => r.match.test(userText));
    if (match) {
      return { id: idFor('m'), timestamp: now, ...match.reply };
    }
  }
  // Otherwise cycle through the pool.
  const idx = messageCount % ASSISTANT_POOL.length;
  const pick = ASSISTANT_POOL[idx];
  return { id: idFor('m'), timestamp: now, ...pick };
}

export function createUserMessage(content: string, imageUrl?: string): ChatMessage {
  return {
    id: idFor('m'),
    role: 'user',
    content,
    imageUrl,
    timestamp: new Date().toISOString(),
  };
}

export function deriveThreadTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= 48) return trimmed;
  return trimmed.slice(0, 45).trimEnd() + '…';
}

export function newThread(firstMessage: ChatMessage): Thread {
  return {
    id: idFor('t'),
    title: deriveThreadTitle(firstMessage.content),
    createdAt: firstMessage.timestamp,
    lastMessageAt: firstMessage.timestamp,
    messages: [firstMessage],
  };
}
