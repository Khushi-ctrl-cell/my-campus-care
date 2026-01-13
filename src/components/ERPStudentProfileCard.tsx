import { User, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ERPStudent, parseCIEMarks, calculateERPRiskLevel } from '@/integrations/erp';

interface ERPStudentProfileCardProps {
  student: ERPStudent;
  className?: string;
}

const riskColors = {
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-danger',
};

export function ERPStudentProfileCard({ student, className }: ERPStudentProfileCardProps) {
  const riskLevel = calculateERPRiskLevel(student);
  const marksPercentage = parseCIEMarks(student.cie_marks);

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-card soft-shadow animate-fade-in",
      className
    )}>
      <div className="relative">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary overflow-hidden flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className={cn(
          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
          riskColors[riskLevel]
        )}>
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-foreground truncate">
          {student.name}
        </h2>
        <p className="text-sm text-primary font-medium">
          {student.branch} • {student.roll_no}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className={cn(
            "font-medium",
            student.attendance < 75 ? "text-danger" : "text-foreground"
          )}>
            Attendance: {student.attendance}%
          </span>
          <span>•</span>
          <span className={cn(
            "font-medium",
            marksPercentage < 60 ? "text-warning" : "text-foreground"
          )}>
            CIE: {student.cie_marks}
          </span>
        </div>
      </div>
      
      <div className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        student.status === 'Regular' ? 'bg-success/10 text-success' :
        student.status === 'Low Attendance' ? 'bg-warning/10 text-warning' :
        'bg-danger/10 text-danger'
      )}>
        {student.status}
      </div>
    </div>
  );
}
