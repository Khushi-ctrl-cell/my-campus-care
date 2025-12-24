import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'sky' | 'lavender' | 'mint' | 'peach';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-card',
  sky: 'bg-sky',
  lavender: 'bg-lavender',
  mint: 'bg-mint',
  peach: 'bg-peach',
};

const iconVariantStyles = {
  default: 'bg-primary/10 text-primary',
  sky: 'bg-sky-foreground/10 text-sky-foreground',
  lavender: 'bg-lavender-foreground/10 text-lavender-foreground',
  mint: 'bg-mint-foreground/10 text-mint-foreground',
  peach: 'bg-peach-foreground/10 text-peach-foreground',
};

const textVariantStyles = {
  default: 'text-foreground',
  sky: 'text-sky-foreground',
  lavender: 'text-lavender-foreground',
  mint: 'text-mint-foreground',
  peach: 'text-peach-foreground',
};

export function SummaryCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix, 
  variant = 'default',
  className,
  onClick 
}: SummaryCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "flex flex-col p-4 rounded-2xl soft-shadow transition-all duration-300 w-full text-left",
        variantStyles[variant],
        onClick && "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        !onClick && "cursor-default",
        className
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl mb-3",
        iconVariantStyles[variant]
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      <p className={cn(
        "text-xs font-medium mb-1 opacity-80",
        textVariantStyles[variant]
      )}>
        {label}
      </p>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-2xl font-bold",
          textVariantStyles[variant]
        )}>
          {value}
        </span>
        {suffix && (
          <span className={cn(
            "text-sm font-medium opacity-70",
            textVariantStyles[variant]
          )}>
            {suffix}
          </span>
        )}
      </div>
    </button>
  );
}
