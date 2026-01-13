import { useState, useEffect, useCallback } from 'react';
import { 
  ERPStudent, 
  ERPNotice, 
  fetchStudents, 
  fetchNotices,
  findStudentByRollNo,
  getAtRiskStudents,
  parseCIEMarks,
  calculateERPRiskLevel
} from '@/integrations/erp';

interface UseERPDataReturn {
  students: ERPStudent[];
  notices: ERPNotice[];
  currentStudent: ERPStudent | null;
  atRiskStudents: ERPStudent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  findStudent: (rollNo: string) => Promise<ERPStudent | null>;
}

export function useERPData(currentRollNo?: string): UseERPDataReturn {
  const [students, setStudents] = useState<ERPStudent[]>([]);
  const [notices, setNotices] = useState<ERPNotice[]>([]);
  const [currentStudent, setCurrentStudent] = useState<ERPStudent | null>(null);
  const [atRiskStudents, setAtRiskStudents] = useState<ERPStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [studentsResponse, noticesResponse] = await Promise.all([
        fetchStudents(),
        fetchNotices()
      ]);

      setStudents(studentsResponse.data);
      setNotices(noticesResponse.data);

      // Get at-risk students
      const atRisk = await getAtRiskStudents();
      setAtRiskStudents(atRisk);

      // Find current student if roll number provided
      if (currentRollNo) {
        const student = studentsResponse.data.find(s => s.roll_no === currentRollNo);
        setCurrentStudent(student || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ERP data');
      console.error('ERP Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentRollNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const findStudent = useCallback(async (rollNo: string) => {
    const student = await findStudentByRollNo(rollNo);
    return student;
  }, []);

  return {
    students,
    notices,
    currentStudent,
    atRiskStudents,
    loading,
    error,
    refetch: fetchData,
    findStudent
  };
}

// Export utility functions for use in components
export { parseCIEMarks, calculateERPRiskLevel };
