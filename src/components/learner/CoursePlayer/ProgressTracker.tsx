interface ProgressTrackerProps {
  progress: number;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gold">{progress}%</span>
    </div>
  );
}