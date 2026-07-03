export default function PersonaSwitcher({ personas, activeId, onSwitch }) {
  return (
    <div className="flex gap-1 px-3 pt-3">
      {personas.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={() => onSwitch(p.id)}
            className={[
              'group relative px-4 py-2.5 rounded-t-lg font-mono text-xs tracking-wide transition-all',
              active
                ? 'bg-panel text-parchment'
                : 'bg-transparent text-parchment/40 hover:text-parchment/70',
            ].join(' ')}
            style={active ? { boxShadow: `inset 0 3px 0 0 ${p.color}` } : undefined}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color, opacity: active ? 1 : 0.4 }}
              />
              {p.displayName}.persona
            </span>
          </button>
        );
      })}
    </div>
  );
}
