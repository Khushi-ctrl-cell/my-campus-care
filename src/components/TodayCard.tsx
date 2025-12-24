import { cn } from '@/lib/utils';
import { DailyScheduleItem } from '@/lib/store';
import { Calendar, BookOpen, ClipboardList, FileText, Sparkles } from 'lucide-react';

interface TodayCardProps {
  schedule: DailyScheduleItem[];
  className?: string;
}

const typeIcons = {
  class: BookOpen,
  assignment: ClipboardList,
  test: FileText,
};

const typeColors = {
  class: 'bg-sky text-sky-foreground',
  assignment: 'bg-peach text-peach-foreground',
  test: 'bg-lavender text-lavender-foreground',
};

export function TodayCard({ schedule, className }: TodayCardProps) {
  const classes = schedule.filter(s => s.type === 'class');
  const assignments = schedule.filter(s => s.type === 'assignment');
  const tests = schedule.filter(s => s.type === 'test');

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-2 px-1 mb-3">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Today at GGCT
        </h2>
      </div>
      
      <div className="p-4 rounded-2xl bg-gradient-to-br from-sky via-lavender/30 to-mint soft-shadow">
        {/* Quick Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{classes.length} Classes</span>
          </div>
          {assignments.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80">
              <ClipboardList className="w-4 h-4 text-peach-foreground" />
              <span className="text-sm font-medium">{assignments.length} Due</span>
            </div>
          )}
          {tests.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80">
              <FileText className="w-4 h-4 text-lavender-foreground" />
              <span className="text-sm font-medium">{tests.length} Test</span>
            </div>
          )}
        </div>
        
        {/* Schedule Items */}
        <div className="space-y-2 mb-4">
          {schedule.slice(0, 4).map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-background/70"
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  typeColors[item.type]
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {item.title || item.subject}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.subject} • {item.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Motivational Message */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-mint/50 border border-success/20">
          <Sparkles className="w-4 h-4 text-success flex-shrink-0" />
          <p className="text-xs text-mint-foreground">
            One small task today can reduce tomorrow's load 💙
          </p>
        </div>
      </div>
    </section>
  );
}
