import { useState, useEffect } from 'react';
import { CalendarDays, BarChart3, ClipboardList, Sparkles } from 'lucide-react';
import { Header, DesktopHeader } from '@/components/Header';
import { StudentProfileCard } from '@/components/StudentProfileCard';
import { AIRiskBadge } from '@/components/AIRiskBadge';
import { SummaryCard } from '@/components/SummaryCard';
import { AssignmentsList } from '@/components/AssignmentsList';
import { GoalProgress } from '@/components/GoalProgress';
import { SubjectRiskMap } from '@/components/SubjectRiskMap';
import { TodayCard } from '@/components/TodayCard';
import { PositiveStreaks } from '@/components/PositiveStreaks';
import { BalanceMeter } from '@/components/BalanceMeter';
import { SilentHelpButton } from '@/components/SilentHelpButton';
import { 
  getStudentData, 
  toggleAssignment, 
  calculateBalanceMeter,
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
  const balanceData = calculateBalanceMeter(data);

  const handleToggleAssignment = (id: string) => {
    const updated = toggleAssignment(id);
    setData(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header />
      <DesktopHeader />
      
      <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Desktop: Two Column Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Profile & Risk Badge Row */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
              <StudentProfileCard profile={data.profile} />
              <AIRiskBadge />
            </div>
            
            {/* Quick Summary Cards */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <SummaryCard
                  icon={CalendarDays}
                  label="Attendance"
                  value={latestAttendance}
                  suffix="%"
                  variant="sky"
                  className="animate-fade-in"
                />
                <SummaryCard
                  icon={BarChart3}
                  label="Avg. Internal Marks"
                  value={latestMarks}
                  suffix="%"
                  variant="lavender"
                  className="animate-fade-in"
                />
                <SummaryCard
                  icon={ClipboardList}
                  label="Pending Tasks"
                  value={pendingAssignments}
                  variant="peach"
                  className="animate-fade-in"
                />
                <GoalProgress 
                  completed={data.goals.completed} 
                  target={data.goals.weeklyTarget}
                />
              </div>
            </section>

            {/* Today at GGCT */}
            <TodayCard schedule={data.todaySchedule} className="animate-fade-in" />
            
            {/* Subject Risk Map */}
            <SubjectRiskMap subjects={data.subjects} className="animate-fade-in" />
          </div>

          {/* Right Column - Secondary Content */}
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* Positive Streaks */}
            <PositiveStreaks streaks={data.streaks} className="animate-fade-in" />
            
            {/* Balance Meter */}
            <BalanceMeter 
              score={balanceData.score}
              status={balanceData.status}
              breakdown={balanceData.breakdown}
              className="animate-fade-in"
            />
            
            {/* Assignments List */}
            <AssignmentsList 
              assignments={data.assignments}
              onToggle={handleToggleAssignment}
            />
          </div>
        </div>
      </main>
      
      {/* Silent Help Button */}
      <SilentHelpButton />
    </div>
  );
}