import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GoalProgressProps {
  completed: number;
  target: number;
  className?: string;
}

export function GoalProgress({ completed, target, className }: GoalProgressProps) {
  const percentage = Math.round((completed / target) * 100);

  return (
    <div className={cn(
      "p-4 rounded-2xl bg-lavender soft-shadow animate-fade-in stagger-4",
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-lavender-foreground/10">
          <Target className="w-5 h-5 text-lavender-foreground" />
        </div>
        <div>
          <p className="text-xs font-medium text-lavender-foreground/70">Weekly Goals</p>
          <p className="text-lg font-bold text-lavender-foreground">
            {completed}/{target} completed
          </p>
        </div>
      </div>
      
      <Progress value={percentage} className="h-3 bg-lavender-foreground/10" />
      
      <p className="text-xs text-lavender-foreground/70 mt-2 text-center">
        {percentage >= 100 
          ? "Amazing! You've hit your weekly target! 🌟" 
          : `${target - completed} more to go — you're doing great! 💪`
        }
      </p>
    </div>
  );
}
