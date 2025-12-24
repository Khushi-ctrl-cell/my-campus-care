import { cn } from '@/lib/utils';
import { WellBeingRecord, AttendanceRecord, MarksRecord } from '@/lib/store';
import { TrendingUp, Brain, Moon, Activity } from 'lucide-react';

interface MoodAcademicsCorrelationProps {
  wellBeing: WellBeingRecord[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  className?: string;
}

function calculateCorrelation(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length || arr1.length < 2) return 0;
  
  const n = arr1.length;
  const sum1 = arr1.reduce((a, b) => a + b, 0);
  const sum2 = arr2.reduce((a, b) => a + b, 0);
  const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
  const pSum = arr1.reduce((a, b, i) => a + b * arr2[i], 0);
  
  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n));
  
  return den === 0 ? 0 : num / den;
}

export function MoodAcademicsCorrelation({ 
  wellBeing, 
  attendance, 
  marks, 
  className 
}: MoodAcademicsCorrelationProps) {
  // Get last 6 entries
  const recentWellBeing = wellBeing.slice(-6);
  const recentAttendance = attendance.slice(-6);
  const recentMarks = marks.slice(-6);
  
  // Calculate correlations
  const moodValues = recentWellBeing.map(w => w.mood);
  const stressValues = recentWellBeing.map(w => 5 - w.stress); // Invert stress
  const sleepValues = recentWellBeing.map(w => w.sleep);
  const attendanceValues = recentAttendance.map(a => a.percentage);
  const marksValues = recentMarks.map(m => m.average);
  
  const moodAttendanceCorr = calculateCorrelation(moodValues, attendanceValues);
  const sleepAttendanceCorr = calculateCorrelation(sleepValues, attendanceValues);
  const stressMarksCorr = calculateCorrelation(stressValues, marksValues);
  
  // Generate insights
  const insights: { icon: React.ElementType; text: string; positive: boolean }[] = [];
  
  if (sleepAttendanceCorr > 0.3) {
    insights.push({
      icon: Moon,
      text: "Weeks with better sleep had higher attendance.",
      positive: true,
    });
  } else if (sleepAttendanceCorr < -0.3) {
    insights.push({
      icon: Moon,
      text: "Sleep patterns may be affecting your attendance.",
      positive: false,
    });
  }
  
  if (moodAttendanceCorr > 0.3) {
    insights.push({
      icon: Activity,
      text: "Better mood correlates with higher attendance.",
      positive: true,
    });
  }
  
  if (stressMarksCorr > 0.3) {
    insights.push({
      icon: Brain,
      text: "Lower stress weeks show better marks.",
      positive: true,
    });
  } else if (stressMarksCorr < -0.3) {
    insights.push({
      icon: Brain,
      text: "High stress may be impacting your performance.",
      positive: false,
    });
  }
  
  // Default insight if none calculated
  if (insights.length === 0) {
    insights.push({
      icon: TrendingUp,
      text: "Keep tracking to see patterns between mood and academics!",
      positive: true,
    });
  }

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-2 px-1 mb-3">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Mood × Academics Correlation
        </h2>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-200/50 soft-shadow">
        <p className="text-sm text-muted-foreground mb-4">
          See how your well-being affects your academics 🔍
        </p>
        
        {/* Correlation Bars */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground">Mood → Attendance</div>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  moodAttendanceCorr > 0 ? "bg-success" : "bg-warning"
                )}
                style={{ width: `${Math.abs(moodAttendanceCorr) * 100}%` }}
              />
            </div>
            <div className="text-xs font-medium w-12 text-right">
              {(moodAttendanceCorr * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground">Sleep → Attendance</div>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  sleepAttendanceCorr > 0 ? "bg-success" : "bg-warning"
                )}
                style={{ width: `${Math.abs(sleepAttendanceCorr) * 100}%` }}
              />
            </div>
            <div className="text-xs font-medium w-12 text-right">
              {(sleepAttendanceCorr * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground">Calm → Marks</div>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  stressMarksCorr > 0 ? "bg-success" : "bg-warning"
                )}
                style={{ width: `${Math.abs(stressMarksCorr) * 100}%` }}
              />
            </div>
            <div className="text-xs font-medium w-12 text-right">
              {(stressMarksCorr * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        
        {/* Insights */}
        <div className="space-y-2">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl",
                  insight.positive ? "bg-mint/50" : "bg-amber-50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 flex-shrink-0",
                  insight.positive ? "text-success" : "text-warning"
                )} />
                <span className={cn(
                  "text-xs",
                  insight.positive ? "text-mint-foreground" : "text-amber-700"
                )}>
                  💡 {insight.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
