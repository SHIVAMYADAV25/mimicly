import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Persona } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  persona: Persona;
}

export default function ChatInput({ onSend, disabled, persona }: ChatInputProps) {
  const [value, setValue] = useState<string>('');

  function submit(e: FormEvent): void {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      submit(e);
    }
  }

  return (
    <form onSubmit={submit} className="p-3 border-t border-white/5">
      <div className="flex items-end gap-2 bg-panelLight rounded-xl px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={`Message ${persona.displayName}...`}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-parchment placeholder:text-parchment/30 py-1.5 max-h-32"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold disabled:opacity-30 transition-opacity"
          style={{ backgroundColor: persona.color, color: '#171512' }}
        >
          Send
        </button>
      </div>
      <p className="text-[10px] text-parchment/25 mt-1.5 px-1 font-mono">
        Enter to send · Shift+Enter for new line
      </p>
    </form>
  );
}
