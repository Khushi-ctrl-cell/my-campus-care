import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  message: string;
  className?: string;
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    label: 'Low Risk',
    bgClass: 'bg-mint',
    textClass: 'text-mint-foreground',
    iconClass: 'text-success',
    borderClass: 'border-success/30',
  },
  medium: {
    icon: Shield,
    label: 'Medium Risk',
    bgClass: 'bg-peach',
    textClass: 'text-peach-foreground',
    iconClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  high: {
    icon: AlertTriangle,
    label: 'High Risk',
    bgClass: 'bg-danger/10',
    textClass: 'text-danger',
    iconClass: 'text-danger',
    borderClass: 'border-danger/30',
  },
};

export function RiskBadge({ level, message, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 animate-fade-in stagger-1",
      config.bgClass,
      config.borderClass,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          level === 'low' ? 'bg-success/20' : level === 'medium' ? 'bg-warning/20' : 'bg-danger/20'
        )}>
          <Icon className={cn("w-6 h-6", config.iconClass)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              level === 'low' ? 'bg-success text-success-foreground' : 
              level === 'medium' ? 'bg-warning text-warning-foreground' : 
              'bg-danger text-danger-foreground'
            )}>
              {config.label}
            </span>
          </div>
          <p className={cn("text-sm font-medium leading-relaxed", config.textClass)}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
