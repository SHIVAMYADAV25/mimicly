import type { Persona } from '../types';

interface PersonaHeaderProps {
  persona: Persona;
  onReset: () => void;
}

export default function PersonaHeader({ persona, onReset }: PersonaHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-panel border-b border-white/5">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: persona.color }} />
          <h1 className="font-display font-semibold text-parchment text-sm">
            {persona.displayName}
          </h1>
          <span className="font-mono text-[10px] text-parchment/30">AI persona · simulation</span>
        </div>
        <p className="text-xs text-parchment/40 mt-0.5">{persona.tagline}</p>
      </div>
      <button
        onClick={onReset}
        className="font-mono text-[10px] text-parchment/40 hover:text-parchment/80 border border-white/10 rounded-md px-2.5 py-1.5 transition-colors"
      >
        reset chat
      </button>
    </div>
  );
}
