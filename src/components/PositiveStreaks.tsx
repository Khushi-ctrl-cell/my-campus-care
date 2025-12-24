import { cn } from '@/lib/utils';
import { Streak } from '@/lib/store';
import { Flame, CalendarCheck, ClipboardCheck, Heart, Trophy } from 'lucide-react';

interface PositiveStreaksProps {
  streaks: Streak[];
  className?: string;
}

const streakConfig = {
  attendance: {
    icon: CalendarCheck,
    label: 'Attendance',
    color: 'bg-sky text-sky-foreground',
  },
  assignment: {
    icon: ClipboardCheck,
    label: 'Assignments',
    color: 'bg-peach text-peach-foreground',
  },
  checkin: {
    icon: Heart,
    label: 'Check-ins',
    color: 'bg-lavender text-lavender-foreground',
  },
};

export function PositiveStreaks({ streaks, className }: PositiveStreaksProps) {
  const totalStreak = streaks.reduce((sum, s) => sum + s.current, 0);
  const bestStreak = Math.max(...streaks.map(s => s.best));

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-2 px-1 mb-3">
        <Flame className="w-4 h-4 text-orange-500" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Positive Streaks
        </h2>
      </div>
      
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 soft-shadow">
        {/* Main Streak Display */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 mb-2">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{totalStreak}</div>
            <div className="text-xs text-muted-foreground">Total Streak</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 mb-2">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{bestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
        
        {/* Individual Streaks */}
        <div className="grid grid-cols-3 gap-2">
          {streaks.map((streak) => {
            const config = streakConfig[streak.type];
            const Icon = config.icon;
            
            return (
              <div
                key={streak.type}
                className="p-3 rounded-xl bg-background/80 text-center"
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg mx-auto mb-2",
                  config.color
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {streak.current}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {config.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Encouragement */}
        {totalStreak >= 5 && (
          <div className="mt-4 p-3 rounded-xl bg-orange-100/50 text-center">
            <span className="text-sm text-orange-700">
              🌟 {totalStreak >= 10 ? 'Amazing consistency! Keep going!' : 'Great streak! Keep it up!'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
