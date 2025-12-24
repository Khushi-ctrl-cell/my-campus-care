import { useState, useEffect } from 'react';
import { CalendarDays, BarChart3, ClipboardList, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { StudentProfileCard } from '@/components/StudentProfileCard';
import { RiskBadge } from '@/components/RiskBadge';
import { SummaryCard } from '@/components/SummaryCard';
import { AssignmentsList } from '@/components/AssignmentsList';
import { GoalProgress } from '@/components/GoalProgress';
import { 
  getStudentData, 
  toggleAssignment, 
  calculateRiskLevel,
  getRiskMessage,
  StudentData 
} from '@/lib/store';

export default function Home() {
  const [data, setData] = useState<StudentData | null>(null);

  useEffect(() => {
    setData(getStudentData());
  }, []);

  if (!data) return null;

  const latestAttendance = data.attendance[data.attendance.length - 1]?.percentage || 0;
  const latestMarks = data.marks[data.marks.length - 1]?.average || 0;
  const pendingAssignments = data.assignments.filter(a => !a.completed).length;
  const riskLevel = calculateRiskLevel(data);
  const riskMessage = getRiskMessage(riskLevel, data);

  const handleToggleAssignment = (id: string) => {
    const updated = toggleAssignment(id);
    setData(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Student Profile */}
        <StudentProfileCard profile={data.profile} />
        
        {/* Risk Badge */}
        <RiskBadge level={riskLevel} message={riskMessage} />
        
        {/* Quick Summary Cards */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              icon={CalendarDays}
              label="Attendance"
              value={latestAttendance}
              suffix="%"
              variant="sky"
              className="animate-fade-in stagger-2"
            />
            <SummaryCard
              icon={BarChart3}
              label="Avg. Internal Marks"
              value={latestMarks}
              suffix="%"
              variant="lavender"
              className="animate-fade-in stagger-2"
            />
            <SummaryCard
              icon={ClipboardList}
              label="Pending Tasks"
              value={pendingAssignments}
              variant="peach"
              className="animate-fade-in stagger-3"
            />
            <GoalProgress 
              completed={data.goals.completed} 
              target={data.goals.weeklyTarget}
            />
          </div>
        </section>
        
        {/* Assignments List */}
        <AssignmentsList 
          assignments={data.assignments}
          onToggle={handleToggleAssignment}
        />
      </main>
    </div>
  );
}
