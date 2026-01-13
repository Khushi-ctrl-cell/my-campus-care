import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'student' | 'mentor' | 'counsellor' | 'admin' | 'super_admin';

interface UseUserRoleReturn {
  role: AppRole | null;
  roles: AppRole[];
  loading: boolean;
  error: string | null;
  hasRole: (role: AppRole) => boolean;
  isAtLeast: (role: AppRole) => boolean;
  refetch: () => Promise<void>;
}

const roleHierarchy: Record<AppRole, number> = {
  'student': 1,
  'counsellor': 2,
  'mentor': 3,
  'admin': 4,
  'super_admin': 5,
};

export function useUserRole(): UseUserRoleReturn {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (queryError) throw queryError;

      const userRoles = (data?.map(r => r.role) || ['student']) as AppRole[];
      setRoles(userRoles.length > 0 ? userRoles : ['student']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      setRoles(['student']); // Default to student on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Get highest role
  const role = roles.length > 0 
    ? roles.reduce((highest, current) => 
        roleHierarchy[current] > roleHierarchy[highest] ? current : highest
      )
    : null;

  const hasRole = useCallback((checkRole: AppRole) => {
    return roles.includes(checkRole);
  }, [roles]);

  const isAtLeast = useCallback((minRole: AppRole) => {
    if (!role) return false;
    return roleHierarchy[role] >= roleHierarchy[minRole];
  }, [role]);

  return {
    role,
    roles,
    loading,
    error,
    hasRole,
    isAtLeast,
    refetch: fetchRoles,
  };
}
