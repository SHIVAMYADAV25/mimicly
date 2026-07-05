import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ChevronDown, Contact, Send, Sparkles } from 'lucide-react';
import PersonaSwitchList from './PersonaSwitchList';
import type { Persona, PersonaId } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  persona: Persona;
  personas: Persona[];
  onSwitchPersona: (id: PersonaId) => void;
}

export default function ChatInput({
  onSend,
  disabled,
  persona,
  personas,
  onSwitchPersona,
}: ChatInputProps) {
  const [value, setValue] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function submit(e: FormEvent): void {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      submit(e);
    }
  }

  return (
    <div className="p-3 border-t border-border bg-surface">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-white focus-within:border-ink-quiet transition-colors">
        <div className="flex items-start gap-2 px-4 pt-3">
          <Sparkles className="w-4 h-4 text-ink-quiet mt-0.5 shrink-0" strokeWidth={2} />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent resize-none text-[14px] text-ink placeholder:text-ink-quiet py-1 max-h-32 border-none outline-none focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink hover:bg-subtle transition-colors"
            >
              <Contact className="w-3.5 h-3.5" style={{ color: persona.color }} strokeWidth={2} />
              {persona.displayName.split(' ')[0]}&rsquo;s Perspective
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-quiet transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
                strokeWidth={2}
              />
            </button>

            {pickerOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-border bg-white shadow-popover p-2 z-20">
                <PersonaSwitchList
                  personas={personas}
                  activeId={persona.id}
                  onSwitch={(id) => {
                    onSwitchPersona(id);
                    setPickerOpen(false);
                  }}
                  compact
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold disabled:opacity-30 transition-opacity bg-ink text-white hover:bg-ink-soft"
          >
            Send
            <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </form>
      <p className="text-[11px] text-ink-quiet mt-1.5 px-1">
        Persona AI may not always be accurate. Please verify important information.
      </p>
    </div>
  );
}
