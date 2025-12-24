import { CheckCircle, Circle, Calendar } from 'lucide-react';
import { Assignment } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, parseISO, isAfter } from 'date-fns';

interface AssignmentsListProps {
  assignments: Assignment[];
  onToggle: (id: string) => void;
}

export function AssignmentsList({ assignments, onToggle }: AssignmentsListProps) {
  const pendingAssignments = assignments.filter(a => !a.completed);

  if (pendingAssignments.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-mint text-center animate-fade-in">
        <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
        <p className="text-mint-foreground font-medium">All caught up! 🎉</p>
        <p className="text-sm text-mint-foreground/70">No pending assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in stagger-3">
      <h3 className="text-sm font-semibold text-muted-foreground px-1">
        Pending Assignments
      </h3>
      
      {pendingAssignments.slice(0, 3).map((assignment) => {
        const dueDate = parseISO(assignment.dueDate);
        const isOverdue = isAfter(new Date(), dueDate);
        
        return (
          <button
            key={assignment.id}
            onClick={() => onToggle(assignment.id)}
            className={cn(
              "flex items-center gap-3 w-full p-4 rounded-xl bg-card soft-shadow",
              "transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
              assignment.completed ? "bg-success/20" : "bg-muted"
            )}>
              {assignment.completed ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 text-left">
              <p className={cn(
                "font-medium text-sm",
                assignment.completed && "line-through text-muted-foreground"
              )}>
                {assignment.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {assignment.subject}
                </span>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-danger" : "text-muted-foreground"
                )}>
                  <Calendar className="w-3 h-3" />
                  {format(dueDate, 'MMM dd')}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
