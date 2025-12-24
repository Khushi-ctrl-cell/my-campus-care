import { cn } from '@/lib/utils';

interface EmojiSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  emojis: string[];
  labels?: string[];
}

export function EmojiSelector({ label, value, onChange, emojis, labels }: EmojiSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="flex items-center justify-between gap-2">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onChange(index + 1)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 flex-1",
              value === index + 1 
                ? "bg-primary/10 scale-110 ring-2 ring-primary" 
                : "bg-muted hover:bg-muted/80 hover:scale-105"
            )}
          >
            <span className="text-2xl">{emoji}</span>
            {labels && (
              <span className="text-[10px] text-muted-foreground font-medium">
                {labels[index]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
