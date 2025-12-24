import { WellBeingRecord } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface MoodChartProps {
  data: WellBeingRecord[];
  className?: string;
}

const moodEmojis = ['😢', '🙁', '😐', '🙂', '😁'];

export function MoodChart({ data, className }: MoodChartProps) {
  const latestData = data.slice(-6);

  return (
    <div className={cn("p-4 rounded-2xl bg-card soft-shadow", className)}>
      <h3 className="font-semibold text-foreground mb-4">Mood Trend</h3>
      
      <div className="space-y-3">
        {latestData.map((record, index) => (
          <div 
            key={record.date}
            className="flex items-center gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-xs text-muted-foreground w-12 shrink-0">
              {format(parseISO(record.date), 'MMM dd')}
            </span>
            
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  record.mood >= 4 ? "bg-success" : 
                  record.mood >= 3 ? "bg-warning" : 
                  "bg-danger"
                )}
                style={{ width: `${(record.mood / 5) * 100}%` }}
              />
            </div>
            
            <span className="text-lg shrink-0">
              {moodEmojis[record.mood - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Okay</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
      </div>
    </div>
  );
}
