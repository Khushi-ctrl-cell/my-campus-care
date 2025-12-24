import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { ProgressChart } from '@/components/ProgressChart';
import { MoodChart } from '@/components/MoodChart';
import { StressChart } from '@/components/StressChart';
import { MoodAcademicsCorrelation } from '@/components/MoodAcademicsCorrelation';
import { WeeklyReflection } from '@/components/WeeklyReflection';
import { FocusMode } from '@/components/FocusMode';
import { getStudentData, StudentData } from '@/lib/store';
import { cn } from '@/lib/utils';

type TimeRange = '4weeks' | '6weeks';

export default function Progress() {
  const [data, setData] = useState<StudentData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('6weeks');

  useEffect(() => {
    setData(getStudentData());
  }, []);

  if (!data) return null;

  const getFilteredData = <T extends { date: string }>(arr: T[]): T[] => {
    const weeks = timeRange === '4weeks' ? 4 : 6;
    return arr.slice(-weeks);
  };

  const attendanceData = getFilteredData(data.attendance).map(r => ({
    date: r.date,
    value: r.percentage,
  }));

  const marksData = getFilteredData(data.marks).map(r => ({
    date: r.date,
    value: r.average,
  }));

  const wellBeingData = getFilteredData(data.wellBeing);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-peach">
              <TrendingUp className="w-6 h-6 text-peach-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Progress</h1>
              <p className="text-sm text-muted-foreground">Track your journey</p>
            </div>
          </div>

          {/* Time Range Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setTimeRange('4weeks')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === '4weeks' 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              4 Weeks
            </button>
            <button
              onClick={() => setTimeRange('6weeks')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === '6weeks' 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              6 Weeks
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Focus Mode */}
          <FocusMode subjects={data.subjects} className="animate-fade-in" />
          
          {/* Attendance Chart */}
          <ProgressChart
            title="Attendance"
            data={attendanceData}
            color="primary"
            suffix="%"
            className="animate-fade-in stagger-1"
          />

          {/* Marks Chart */}
          <ProgressChart
            title="Average Internal Marks"
            data={marksData}
            color="lavender"
            suffix="%"
            className="animate-fade-in stagger-2"
          />

          {/* Mood Chart */}
          <MoodChart 
            data={wellBeingData}
            className="animate-fade-in stagger-3"
          />

          {/* Stress Chart */}
          <StressChart
            data={wellBeingData}
            className="animate-fade-in stagger-4"
          />
          
          {/* Mood × Academics Correlation */}
          <MoodAcademicsCorrelation
            wellBeing={data.wellBeing}
            attendance={data.attendance}
            marks={data.marks}
            className="animate-fade-in"
          />
          
          {/* Weekly Reflection */}
          <WeeklyReflection 
            reflections={data.weeklyReflections}
            className="animate-fade-in"
          />

          {/* Summary Card */}
          <div className="p-4 rounded-2xl bg-mint border-2 border-success/20 animate-fade-in stagger-5">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-mint-foreground" />
              <h3 className="font-semibold text-mint-foreground">Weekly Summary</h3>
            </div>
            <p className="text-sm text-mint-foreground/80 leading-relaxed">
              {attendanceData[attendanceData.length - 1]?.value >= 80 
                ? "Great attendance this week! Keep showing up — consistency builds success."
                : "Attendance needs a boost. Every class counts towards your goals!"
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}