import type { Persona } from '../types';

interface TypingIndicatorProps {
  persona: Persona;
}

export default function TypingIndicator({ persona }: TypingIndicatorProps) {
  const label = persona.id === 'hitesh' ? 'chai brew ho rahi hai' : 'compiling response';

  return (
    <div className="flex justify-start px-4 gap-3">
      <div
        className="mt-1 shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-mono text-[10px] font-bold"
        style={{ backgroundColor: `${persona.color}22`, color: persona.color }}
      >
        {persona.displayName[0]}
      </div>
      <div className="bg-panel rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <span className="font-mono text-[11px] text-parchment/40">{label}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-blink"
              style={{ backgroundColor: persona.color, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
