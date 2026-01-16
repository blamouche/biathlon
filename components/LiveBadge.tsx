interface LiveBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  position?: 'absolute' | 'relative';
}

export function LiveBadge({ size = 'md', position = 'absolute' }: LiveBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const positionClasses = position === 'absolute' ? 'absolute top-3 right-3' : '';

  return (
    <div className={`${positionClasses} z-10`}>
      <div className={`${sizeClasses[size]} inline-flex items-center gap-1.5 bg-red-500 text-white font-bold rounded-full shadow-lg`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span>LIVE</span>
      </div>
    </div>
  );
}
