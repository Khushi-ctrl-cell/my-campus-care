// React hook for Firestore user operations

import { useState, useCallback } from 'react';
import { 
  FirestoreUser, 
  createUser, 
  getUserById, 
  getUserByEmail,
  getAllUsers, 
  updateUser, 
  deleteUser 
} from '@/integrations/firebase/userService';

interface UseFirestoreUsersReturn {
  users: FirestoreUser[];
  loading: boolean;
  error: string | null;
  fetchAllUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<FirestoreUser | null>;
  fetchUserByEmail: (email: string) => Promise<FirestoreUser | null>;
  addUser: (userData: { name: string; email: string; age: number }) => Promise<string | null>;
  editUser: (id: string, updates: Partial<{ name: string; email: string; age: number }>) => Promise<boolean>;
  removeUser: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useFirestoreUsers = (): UseFirestoreUsersReturn => {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string): Promise<FirestoreUser | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getUserById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email: string): Promise<FirestoreUser | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getUserByEmail(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData: { name: string; email: string; age: number }): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await createUser(userData);
      // Refresh users list after adding
      await fetchAllUsers();
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  const editUser = useCallback(async (
    id: string, 
    updates: Partial<{ name: string; email: string; age: number }>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await updateUser(id, updates);
      // Refresh users list after updating
      await fetchAllUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  const removeUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      // Refresh users list after deleting
      await fetchAllUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  return {
    users,
    loading,
    error,
    fetchAllUsers,
    fetchUserById,
    fetchUserByEmail,
    addUser,
    editUser,
    removeUser,
    clearError
  };
};
