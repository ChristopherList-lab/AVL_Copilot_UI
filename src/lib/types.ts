export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: 'trial' | 'active';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  steps?: string[];
  imageUrl?: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}
