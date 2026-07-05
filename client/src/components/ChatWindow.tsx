import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import type { ChatMessage, Persona } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  persona: Persona;
  isTyping: boolean;
}

export default function ChatWindow({ messages, persona, isTyping }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 bg-panel/40">
      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} persona={persona} />
      ))}
      {isTyping && <TypingIndicator persona={persona} />}
      <div ref={bottomRef} />
    </div>
  );
}
