import { Lightbulb, Wind, Moon, Timer, Heart } from 'lucide-react';
import { WellBeingRecord } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Tip {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'sky' | 'lavender' | 'mint' | 'peach';
}

function getTipsForWellBeing(record: Omit<WellBeingRecord, 'date'>): Tip[] {
  const tips: Tip[] = [];

  if (record.stress > 3) {
    tips.push({
      icon: Wind,
      title: 'Quick Breathing',
      description: 'Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Repeat 3 times.',
      color: 'sky',
    });
  }

  if (record.sleep < 3) {
    tips.push({
      icon: Moon,
      title: 'Sleep Hygiene',
      description: 'Aim for 7-8 hours. Avoid screens 30 mins before bed.',
      color: 'lavender',
    });
  }

  if (record.motivation < 3) {
    tips.push({
      icon: Timer,
      title: 'Pomodoro Technique',
      description: 'Study 25 mins, break 5 mins. Makes tasks feel manageable!',
      color: 'peach',
    });
  }

  if (record.mood < 3) {
    tips.push({
      icon: Heart,
      title: 'Self-Care Moment',
      description: 'Take a short walk or listen to your favorite song. Small joys matter!',
      color: 'mint',
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: Lightbulb,
      title: "You're Doing Great!",
      description: 'Keep up the positive momentum. Consider sharing your strategies with peers!',
      color: 'mint',
    });
  }

  return tips.slice(0, 3);
}

const colorStyles = {
  sky: 'bg-sky border-sky-foreground/20',
  lavender: 'bg-lavender border-lavender-foreground/20',
  mint: 'bg-mint border-mint-foreground/20',
  peach: 'bg-peach border-peach-foreground/20',
};

const iconStyles = {
  sky: 'bg-sky-foreground/10 text-sky-foreground',
  lavender: 'bg-lavender-foreground/10 text-lavender-foreground',
  mint: 'bg-mint-foreground/10 text-mint-foreground',
  peach: 'bg-peach-foreground/10 text-peach-foreground',
};

const textStyles = {
  sky: 'text-sky-foreground',
  lavender: 'text-lavender-foreground',
  mint: 'text-mint-foreground',
  peach: 'text-peach-foreground',
};

interface WellBeingTipsProps {
  record: Omit<WellBeingRecord, 'date'>;
}

export function WellBeingTips({ record }: WellBeingTipsProps) {
  const tips = getTipsForWellBeing(record);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="w-4 h-4" />
        <span>Personalized tips based on your check-in</span>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01]",
                colorStyles[tip.color]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                  iconStyles[tip.color]
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={cn("font-semibold text-sm mb-1", textStyles[tip.color])}>
                    {tip.title}
                  </h4>
                  <p className={cn("text-sm opacity-80", textStyles[tip.color])}>
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
