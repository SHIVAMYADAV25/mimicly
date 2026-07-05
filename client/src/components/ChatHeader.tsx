import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Plus } from 'lucide-react';
import Avatar from './Avatar';
import PersonaSwitchList from './PersonaSwitchList';
import type { Persona, PersonaId } from '../types';

interface ChatHeaderProps {
  persona: Persona;
  personas: Persona[];
  onSwitchPersona: (id: PersonaId) => void;
  onReset: () => void;
  // messages: ChatMessage[];
  onMenuToggle?: () => void;
}

export default function ChatHeader({
  persona,
  personas,
  onSwitchPersona,
  onReset,
  // messages,
  onMenuToggle,
}: ChatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // COMMENTED OUT UNUSED STATE TO FIX BUILD ERROR
  // const [copied, setCopied] = useState(false); 
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // COMMENTED OUT UNUSED FUNCTION TO FIX BUILD ERROR
  /*
  async function handleCopySession(): Promise<void> {
    const text = messages
      .map((m) => `${m.role === 'user' ? 'You' : persona.displayName}: ${m.content}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
    }
  }
  */

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border rounded-2xl relative">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden mr-1 text-ink-faint hover:text-ink transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 min-w-0 rounded-lg px-1.5 py-1 hover:bg-subtle transition-colors"
          >
            <Avatar persona={persona} size="sm" />
            <span className="font-display font-semibold text-ink text-[14px] truncate">
              Chat with {persona.displayName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-ink-quiet transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-white shadow-popover p-2.5 z-20">
              <p className="px-1.5 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-quiet">
                Switch persona
              </p>
              <PersonaSwitchList
                personas={personas}
                activeId={persona.id}
                onSwitch={(id) => {
                  onSwitchPersona(id);
                  setMenuOpen(false);
                }}
                compact
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* <button
          type="button"
          onClick={handleCopySession}
          disabled={!messages.length}
          className="flex items-center gap-1.5 text-[12px] font-medium text-ink-faint hover:text-ink border border-border rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" strokeWidth={2} />
              Copy session
            </>
          )}
        </button> */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-[12px] font-medium text-ink-faint hover:text-ink border border-border rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          New chat
        </button>
      </div>
    </div>
  );
}