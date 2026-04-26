export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-gold" aria-hidden="true">
        <g fill="currentColor">
          <circle cx="24" cy="24" r="6" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 24 + Math.cos(a) * 11;
            const y1 = 24 + Math.sin(a) * 11;
            const x2 = 24 + Math.cos(a) * 20;
            const y2 = 24 + Math.sin(a) * 20;
            return (
              <path
                key={i}
                d={`M${x1} ${y1} L${x2 - 3} ${y2 - 1} L${x2} ${y2} L${x2 - 1} ${y2 - 3} Z`}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      </svg>
      <span className="font-serif text-2xl font-semibold text-gold tracking-tight">
        Sandiwa
      </span>
    </div>
  );
}
