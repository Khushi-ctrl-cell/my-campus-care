// React hook for BigQuery student analytics

import { useState, useCallback, useEffect } from 'react';
import {
  initializeStudentAnalytics,
  insertAttendanceRecords,
  insertMarksRecords,
  insertWellbeingRecords,
  insertInterventionRecords,
  storeRiskPrediction,
  getAttendanceHistory,
  getMarksHistory,
  getWellbeingHistory,
  getRiskPredictionHistory,
  calculateStudentFeatures,
  AttendanceRecord,
  MarksRecord,
  WellbeingRecord,
  InterventionRecord,
  RiskPredictionRecord
} from '@/integrations/bigquery/studentAnalytics';

interface UseBigQueryAnalyticsReturn {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  
  // Insert functions
  addAttendance: (records: AttendanceRecord[]) => Promise<number>;
  addMarks: (records: MarksRecord[]) => Promise<number>;
  addWellbeing: (records: WellbeingRecord[]) => Promise<number>;
  addIntervention: (records: InterventionRecord[]) => Promise<number>;
  logRiskPrediction: (prediction: RiskPredictionRecord) => Promise<void>;
  
  // Query functions
  fetchAttendanceHistory: (studentId: string, limit?: number) => Promise<AttendanceRecord[]>;
  fetchMarksHistory: (studentId: string, limit?: number) => Promise<MarksRecord[]>;
  fetchWellbeingHistory: (studentId: string, limit?: number) => Promise<WellbeingRecord[]>;
  fetchRiskHistory: (studentId: string, limit?: number) => Promise<RiskPredictionRecord[]>;
  
  // Analytics
  getStudentFeatures: (studentId: string) => Promise<{
    avgAttendance: number;
    avgMarks: number;
    avgMood: number;
    avgStress: number;
    avgSleep: number;
    interventionCount: number;
  }>;
  
  clearError: () => void;
}

export const useBigQueryAnalytics = (): UseBigQueryAnalyticsReturn => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeStudentAnalytics();
        setInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize analytics');
      }
    };
    init();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const addAttendance = useCallback(async (records: AttendanceRecord[]): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const result = await insertAttendanceRecords(records);
      return result.insertedCount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert attendance');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMarks = useCallback(async (records: MarksRecord[]): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const result = await insertMarksRecords(records);
      return result.insertedCount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert marks');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const addWellbeing = useCallback(async (records: WellbeingRecord[]): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const result = await insertWellbeingRecords(records);
      return result.insertedCount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert wellbeing');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const addIntervention = useCallback(async (records: InterventionRecord[]): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const result = await insertInterventionRecords(records);
      return result.insertedCount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert intervention');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const logRiskPrediction = useCallback(async (prediction: RiskPredictionRecord): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await storeRiskPrediction(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log prediction');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttendanceHistory = useCallback(async (studentId: string, limit?: number): Promise<AttendanceRecord[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getAttendanceHistory(studentId, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMarksHistory = useCallback(async (studentId: string, limit?: number): Promise<MarksRecord[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getMarksHistory(studentId, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marks');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWellbeingHistory = useCallback(async (studentId: string, limit?: number): Promise<WellbeingRecord[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getWellbeingHistory(studentId, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wellbeing');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRiskHistory = useCallback(async (studentId: string, limit?: number): Promise<RiskPredictionRecord[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getRiskPredictionHistory(studentId, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk history');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentFeatures = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await calculateStudentFeatures(studentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate features');
      return {
        avgAttendance: 0,
        avgMarks: 0,
        avgMood: 0,
        avgStress: 0,
        avgSleep: 0,
        interventionCount: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    initialized,
    loading,
    error,
    addAttendance,
    addMarks,
    addWellbeing,
    addIntervention,
    logRiskPrediction,
    fetchAttendanceHistory,
    fetchMarksHistory,
    fetchWellbeingHistory,
    fetchRiskHistory,
    getStudentFeatures,
    clearError
  };
};
