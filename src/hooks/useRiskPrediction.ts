import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStudentData } from '@/lib/store';

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  recommendations: string[];
  subjectRisks: Array<{
    subject: string;
    risk: 'low' | 'medium' | 'high';
    reason: string;
  }>;
}

export function useRiskPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  const predictRisk = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication required. Please log in to use AI risk prediction.');
      }

      const data = getStudentData();
      
      // Calculate overall stats
      const totalAttendance = data.subjects.reduce((acc, s) => acc + s.attendance, 0) / data.subjects.length;
      const totalMarks = data.subjects.reduce((acc, s) => acc + s.internalMarks, 0) / data.subjects.length;
      const pendingAssignments = data.assignments.filter(a => !a.completed).length;

      // Get latest well-being data
      const latestWellbeing = data.wellBeing.length > 0 ? data.wellBeing[data.wellBeing.length - 1] : null;

      const studentData = {
        name: data.profile.name,
        course: data.profile.course,
        semester: data.profile.semester,
        subjects: data.subjects.map(s => ({
          name: s.name,
          attendance: s.attendance,
          marks: s.internalMarks,
          pendingAssignments: s.totalAssignments - s.assignmentsDone
        })),
        overallAttendance: Math.round(totalAttendance),
        averageMarks: Math.round(totalMarks),
        totalPendingAssignments: pendingAssignments,
        wellbeing: latestWellbeing ? {
          mood: latestWellbeing.mood,
          stress: latestWellbeing.stress,
          sleep: latestWellbeing.sleep
        } : null
      };

      const { data: responseData, error: fnError } = await supabase.functions.invoke('predict-risk', {
        body: { studentData }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      setAssessment(responseData as RiskAssessment);
      return responseData as RiskAssessment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to predict risk';
      setError(message);
      console.error('Risk prediction error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    predictRisk,
    assessment,
    isLoading,
    error,
    setAssessment
  };
}
