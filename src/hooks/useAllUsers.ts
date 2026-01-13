import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  roll_number: string | null;
  course: string | null;
  semester: number | null;
  email?: string;
  roles: string[];
  created_at: string;
}

interface UseAllUsersReturn {
  users: UserWithRole[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  assignRole: (userId: string, role: string) => Promise<boolean>;
  removeRole: (userId: string, role: string) => Promise<boolean>;
}

export function useAllUsers(): UseAllUsersReturn {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const rolesMap = new Map<string, string[]>();
      roles?.forEach(r => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      const usersWithRoles: UserWithRole[] = (profiles || []).map(p => ({
        ...p,
        roles: rolesMap.get(p.user_id) || ['student'],
      }));

      setUsers(usersWithRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const assignRole = useCallback(async (userId: string, role: 'student' | 'mentor' | 'counsellor' | 'admin' | 'super_admin'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role }]);

      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') {
          return true; // Role already exists
        }
        throw error;
      }

      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign role');
      return false;
    }
  }, [fetchUsers]);

  const removeRole = useCallback(async (userId: string, role: 'student' | 'mentor' | 'counsellor' | 'admin' | 'super_admin'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove role');
      return false;
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    assignRole,
    removeRole,
  };
}
