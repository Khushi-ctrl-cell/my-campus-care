import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Skill {
  id: string;
  user_id: string;
  type: 'certificate' | 'internship' | 'achievement' | 'extracurricular';
  title: string;
  description: string | null;
  issuing_authority: string | null;
  category: string | null;
  url: string | null;
  date_obtained: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSkillInput {
  type: Skill['type'];
  title: string;
  description?: string;
  issuing_authority?: string;
  category?: string;
  url?: string;
  date_obtained?: string;
}

interface UseSkillsReturn {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  addSkill: (skill: CreateSkillInput) => Promise<Skill | null>;
  updateSkill: (id: string, updates: Partial<CreateSkillInput>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  verifySkill: (id: string, status: 'verified' | 'rejected', notes?: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useSkills(userId?: string): UseSkillsReturn {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchSkills = useCallback(async () => {
    if (!targetUserId) {
      setSkills([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      // If viewing own skills or specific user
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setSkills((data as Skill[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, userId]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addSkill = useCallback(async (skill: CreateSkillInput): Promise<Skill | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          ...skill,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSkills(prev => [data as Skill, ...prev]);
      return data as Skill;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
      return null;
    }
  }, [user]);

  const updateSkill = useCallback(async (id: string, updates: Partial<CreateSkillInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
      return false;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
      return false;
    }
  }, []);

  const verifySkill = useCallback(async (
    id: string, 
    status: 'verified' | 'rejected', 
    notes?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('skills')
        .update({
          verification_status: status,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          verification_notes: notes || null,
        })
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.map(s => 
        s.id === id 
          ? { 
              ...s, 
              verification_status: status, 
              verified_by: user.id, 
              verified_at: new Date().toISOString(),
              verification_notes: notes || null 
            } 
          : s
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify skill');
      return false;
    }
  }, [user]);

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    verifySkill,
    refetch: fetchSkills,
  };
}
