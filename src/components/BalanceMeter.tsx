import { cn } from '@/lib/utils';
import { Scale, Activity, Moon, BookOpen, Brain } from 'lucide-react';

interface BalanceMeterProps {
  score: number;
  status: 'balanced' | 'overloaded' | 'under-engaged';
  breakdown: {
    attendance: number;
    stress: number;
    sleep: number;
    engagement: number;
  };
  className?: string;
}

const statusConfig = {
  balanced: {
    color: 'text-success',
    bg: 'bg-mint',
    label: 'Balanced',
    message: 'You\'re maintaining a healthy balance! Keep it up!',
    icon: '⚖️',
  },
  overloaded: {
    color: 'text-danger',
    bg: 'bg-red-50',
    label: 'Overloaded',
    message: 'You might be pushing too hard. Take some time to rest.',
    icon: '🔥',
  },
  'under-engaged': {
    color: 'text-warning',
    bg: 'bg-amber-50',
    label: 'Under-engaged',
    message: 'Try to increase your participation and attendance.',
    icon: '💤',
  },
};

const breakdownConfig = [
  { key: 'attendance', label: 'Attendance', icon: BookOpen, color: 'bg-sky' },
  { key: 'stress', label: 'Stress Level', icon: Brain, color: 'bg-lavender' },
  { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'bg-indigo-100' },
  { key: 'engagement', label: 'Engagement', icon: Activity, color: 'bg-peach' },
];

export function BalanceMeter({ score, status, breakdown, className }: BalanceMeterProps) {
  const config = statusConfig[status];

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-2 px-1 mb-3">
        <Scale className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          College Life Balance Meter
        </h2>
      </div>
      
      <div className={cn(
        "p-4 rounded-2xl border-2 soft-shadow",
        config.bg,
        status === 'balanced' ? 'border-success/30' : 
        status === 'overloaded' ? 'border-danger/30' : 'border-warning/30'
      )}>
        {/* Main Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <div className={cn("text-xl font-bold", config.color)}>
                {config.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {config.message}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", config.color)}>
              {score}%
            </div>
            <div className="text-xs text-muted-foreground">
              Overall
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 rounded-full bg-background/60 mb-4 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === 'balanced' ? 'bg-success' : 
              status === 'overloaded' ? 'bg-danger' : 'bg-warning'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        
        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          {breakdownConfig.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="flex items-center gap-2 p-2 rounded-lg bg-background/60"
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                color
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground truncate">
                  {label}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {breakdown[key as keyof typeof breakdown]}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
