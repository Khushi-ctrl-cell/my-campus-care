import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MentorAssignment {
  id: string;
  mentor_id: string;
  student_id: string;
  assigned_by: string | null;
  assigned_at: string;
  notes: string | null;
  mentor_profile?: {
    full_name: string | null;
  };
  student_profile?: {
    full_name: string | null;
    roll_number: string | null;
    course: string | null;
  };
}

interface UseMentorAssignmentsReturn {
  assignments: MentorAssignment[];
  loading: boolean;
  error: string | null;
  assignStudent: (mentorId: string, studentId: string, notes?: string) => Promise<boolean>;
  removeAssignment: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useMentorAssignments(mentorId?: string): UseMentorAssignmentsReturn {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('mentor_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (mentorId) {
        query = query.eq('mentor_id', mentorId);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Fetch profiles for mentors and students
      const mentorIds = [...new Set(data?.map(a => a.mentor_id) || [])];
      const studentIds = [...new Set(data?.map(a => a.student_id) || [])];
      const allIds = [...new Set([...mentorIds, ...studentIds])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, roll_number, course')
        .in('user_id', allIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const assignmentsWithProfiles: MentorAssignment[] = (data || []).map(a => ({
        ...a,
        mentor_profile: profilesMap.get(a.mentor_id) as MentorAssignment['mentor_profile'],
        student_profile: profilesMap.get(a.student_id) as MentorAssignment['student_profile'],
      }));

      setAssignments(assignmentsWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const assignStudent = useCallback(async (
    targetMentorId: string, 
    studentId: string, 
    notes?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mentor_assignments')
        .insert({
          mentor_id: targetMentorId,
          student_id: studentId,
          assigned_by: user?.id,
          notes: notes || null,
        });

      if (error) {
        if (error.code === '23505') {
          setError('This student is already assigned to this mentor');
          return false;
        }
        throw error;
      }

      await fetchAssignments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign student');
      return false;
    }
  }, [user, fetchAssignments]);

  const removeAssignment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mentor_assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssignments(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove assignment');
      return false;
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    assignStudent,
    removeAssignment,
    refetch: fetchAssignments,
  };
}
