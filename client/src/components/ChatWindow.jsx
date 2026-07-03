import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, persona, isTyping }) {
  const bottomRef = useRef(null);

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
