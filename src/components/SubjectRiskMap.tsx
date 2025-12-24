import { cn } from '@/lib/utils';
import { SubjectData, getSubjectRisk } from '@/lib/store';
import { BookOpen, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SubjectRiskMapProps {
  subjects: SubjectData[];
  className?: string;
}

const riskColors = {
  low: 'bg-mint border-success/30',
  medium: 'bg-amber-50 border-warning/30',
  high: 'bg-red-50 border-danger/30',
};

const riskIcons = {
  low: CheckCircle,
  medium: Clock,
  high: AlertTriangle,
};

const riskTextColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-danger',
};

export function SubjectRiskMap({ subjects, className }: SubjectRiskMapProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Smart Subject Risk Map
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((subject, index) => {
          const risk = getSubjectRisk(subject);
          const RiskIcon = riskIcons[risk];
          
          return (
            <div
              key={subject.id}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300 animate-fade-in",
                riskColors[risk],
                `stagger-${index + 1}`
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {subject.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {subject.code}
                  </span>
                </div>
                <div className={cn("p-1.5 rounded-full", riskTextColors[risk])}>
                  <RiskIcon className="w-4 h-4" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Attendance */}
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-bold",
                    subject.attendance >= 75 ? 'text-success' : 
                    subject.attendance >= 65 ? 'text-warning' : 'text-danger'
                  )}>
                    {subject.attendance}%
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Attendance
                  </div>
                </div>
                
                {/* Internal Marks */}
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-bold",
                    subject.internalMarks >= 70 ? 'text-success' : 
                    subject.internalMarks >= 50 ? 'text-warning' : 'text-danger'
                  )}>
                    {subject.internalMarks}%
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Marks
                  </div>
                </div>
                
                {/* Assignments */}
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-bold",
                    subject.assignmentsDone >= subject.totalAssignments ? 'text-success' : 'text-warning'
                  )}>
                    {subject.assignmentsDone}/{subject.totalAssignments}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Tasks
                  </div>
                </div>
              </div>
              
              {/* Insight */}
              {subject.insight && (
                <div className={cn(
                  "text-xs px-3 py-2 rounded-lg bg-background/60",
                  riskTextColors[risk]
                )}>
                  💡 {subject.insight}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
