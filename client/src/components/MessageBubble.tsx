import ReactMarkdown from 'react-markdown';
import type { ChatRole, Persona } from '../types';

interface MessageBubbleProps {
  role: ChatRole;
  content: string;
  persona: Persona;
}

export default function MessageBubble({ role, content, persona }: MessageBubbleProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[80%] bg-panelLight rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-parchment/90">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 gap-3">
      <div
        className="mt-1 shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-mono text-[10px] font-bold"
        style={{ backgroundColor: `${persona.color}22`, color: persona.color }}
      >
        {persona.displayName[0]}
      </div>
      <div
        className="max-w-[80%] bg-panel rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-parchment/90 prose-persona border-l-2"
        style={{ borderColor: persona.color }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
