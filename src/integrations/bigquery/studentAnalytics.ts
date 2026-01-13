// BigQuery Student Analytics Service
// Uses mock implementation for development
// Stores historical student data for analysis and ML features

import {
  createDataset,
  createTable,
  insertRows,
  queryTable,
  BigQueryRow
} from './mockBigQuery';

// Dataset and table names
const DATASET_ID = 'student_analytics';
const TABLES = {
  ATTENDANCE: 'attendance_history',
  MARKS: 'marks_history',
  WELLBEING: 'wellbeing_history',
  INTERVENTIONS: 'interventions',
  RISK_PREDICTIONS: 'risk_predictions'
};

// Interfaces for student analytics data
export interface AttendanceRecord {
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
}

export interface MarksRecord {
  student_id: string;
  subject: string;
  score: number;
  max_score: number;
  exam_type: 'quiz' | 'midterm' | 'final' | 'assignment';
  date: string;
}

export interface WellbeingRecord {
  student_id: string;
  date: string;
  mood_score: number;
  stress_level: number;
  sleep_hours: number;
  notes?: string;
}

export interface InterventionRecord {
  student_id: string;
  mentor_id: string;
  date: string;
  type: 'counseling' | 'academic_support' | 'parent_meeting' | 'follow_up';
  notes: string;
  outcome?: string;
}

export interface RiskPredictionRecord {
  student_id: string;
  prediction_date: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string;
  model_version: string;
}

/**
 * Initialize the student analytics dataset and tables
 */
export const initializeStudentAnalytics = async (): Promise<void> => {
  try {
    await createDataset(DATASET_ID);
    
    await createTable(DATASET_ID, TABLES.ATTENDANCE, [
      { name: 'student_id', type: 'STRING' },
      { name: 'date', type: 'DATE' },
      { name: 'status', type: 'STRING' },
      { name: 'subject', type: 'STRING' }
    ]);
    
    await createTable(DATASET_ID, TABLES.MARKS, [
      { name: 'student_id', type: 'STRING' },
      { name: 'subject', type: 'STRING' },
      { name: 'score', type: 'FLOAT' },
      { name: 'max_score', type: 'FLOAT' },
      { name: 'exam_type', type: 'STRING' },
      { name: 'date', type: 'DATE' }
    ]);
    
    await createTable(DATASET_ID, TABLES.WELLBEING, [
      { name: 'student_id', type: 'STRING' },
      { name: 'date', type: 'DATE' },
      { name: 'mood_score', type: 'INTEGER' },
      { name: 'stress_level', type: 'INTEGER' },
      { name: 'sleep_hours', type: 'FLOAT' },
      { name: 'notes', type: 'STRING' }
    ]);
    
    await createTable(DATASET_ID, TABLES.INTERVENTIONS, [
      { name: 'student_id', type: 'STRING' },
      { name: 'mentor_id', type: 'STRING' },
      { name: 'date', type: 'DATE' },
      { name: 'type', type: 'STRING' },
      { name: 'notes', type: 'STRING' },
      { name: 'outcome', type: 'STRING' }
    ]);
    
    await createTable(DATASET_ID, TABLES.RISK_PREDICTIONS, [
      { name: 'student_id', type: 'STRING' },
      { name: 'prediction_date', type: 'TIMESTAMP' },
      { name: 'risk_level', type: 'STRING' },
      { name: 'confidence', type: 'FLOAT' },
      { name: 'factors', type: 'STRING' },
      { name: 'model_version', type: 'STRING' }
    ]);
    
    console.log('Student analytics tables initialized');
  } catch (error) {
    console.error('Error initializing student analytics:', error);
    throw error;
  }
};

/**
 * Insert attendance records
 */
export const insertAttendanceRecords = async (
  records: AttendanceRecord[]
): Promise<{ insertedCount: number }> => {
  return insertRows(DATASET_ID, TABLES.ATTENDANCE, records as unknown as BigQueryRow[]);
};

/**
 * Insert marks records
 */
export const insertMarksRecords = async (
  records: MarksRecord[]
): Promise<{ insertedCount: number }> => {
  return insertRows(DATASET_ID, TABLES.MARKS, records as unknown as BigQueryRow[]);
};

/**
 * Insert wellbeing records
 */
export const insertWellbeingRecords = async (
  records: WellbeingRecord[]
): Promise<{ insertedCount: number }> => {
  return insertRows(DATASET_ID, TABLES.WELLBEING, records as unknown as BigQueryRow[]);
};

/**
 * Insert intervention records
 */
export const insertInterventionRecords = async (
  records: InterventionRecord[]
): Promise<{ insertedCount: number }> => {
  return insertRows(DATASET_ID, TABLES.INTERVENTIONS, records as unknown as BigQueryRow[]);
};

/**
 * Store risk prediction for audit/analysis
 */
export const storeRiskPrediction = async (
  prediction: RiskPredictionRecord
): Promise<void> => {
  await insertRows(DATASET_ID, TABLES.RISK_PREDICTIONS, [prediction as unknown as BigQueryRow]);
};

/**
 * Get attendance history for a student
 */
export const getAttendanceHistory = async (
  studentId: string,
  limit?: number
): Promise<AttendanceRecord[]> => {
  const results = await queryTable(DATASET_ID, TABLES.ATTENDANCE, {
    where: { field: 'student_id', operator: '=', value: studentId },
    orderBy: { field: 'date', direction: 'DESC' },
    limit
  });
  return results as unknown as AttendanceRecord[];
};

/**
 * Get marks history for a student
 */
export const getMarksHistory = async (
  studentId: string,
  limit?: number
): Promise<MarksRecord[]> => {
  const results = await queryTable(DATASET_ID, TABLES.MARKS, {
    where: { field: 'student_id', operator: '=', value: studentId },
    orderBy: { field: 'date', direction: 'DESC' },
    limit
  });
  return results as unknown as MarksRecord[];
};

/**
 * Get wellbeing history for a student
 */
export const getWellbeingHistory = async (
  studentId: string,
  limit?: number
): Promise<WellbeingRecord[]> => {
  const results = await queryTable(DATASET_ID, TABLES.WELLBEING, {
    where: { field: 'student_id', operator: '=', value: studentId },
    orderBy: { field: 'date', direction: 'DESC' },
    limit
  });
  return results as unknown as WellbeingRecord[];
};

/**
 * Get risk prediction history for a student
 */
export const getRiskPredictionHistory = async (
  studentId: string,
  limit?: number
): Promise<RiskPredictionRecord[]> => {
  const results = await queryTable(DATASET_ID, TABLES.RISK_PREDICTIONS, {
    where: { field: 'student_id', operator: '=', value: studentId },
    orderBy: { field: 'prediction_date', direction: 'DESC' },
    limit
  });
  return results as unknown as RiskPredictionRecord[];
};

/**
 * Calculate analytics features for ML model
 */
export const calculateStudentFeatures = async (studentId: string): Promise<{
  avgAttendance: number;
  avgMarks: number;
  avgMood: number;
  avgStress: number;
  avgSleep: number;
  interventionCount: number;
}> => {
  const [attendance, marks, wellbeing, interventions] = await Promise.all([
    queryTable(DATASET_ID, TABLES.ATTENDANCE, {
      where: { field: 'student_id', operator: '=', value: studentId }
    }),
    queryTable(DATASET_ID, TABLES.MARKS, {
      where: { field: 'student_id', operator: '=', value: studentId }
    }),
    queryTable(DATASET_ID, TABLES.WELLBEING, {
      where: { field: 'student_id', operator: '=', value: studentId }
    }),
    queryTable(DATASET_ID, TABLES.INTERVENTIONS, {
      where: { field: 'student_id', operator: '=', value: studentId }
    })
  ]);
  
  const presentCount = attendance.filter(r => r.status === 'present').length;
  const avgAttendance = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;
  
  const avgMarks = marks.length > 0
    ? marks.reduce((sum, r) => sum + ((r.score as number) / (r.max_score as number)) * 100, 0) / marks.length
    : 0;
  
  const avgMood = wellbeing.length > 0
    ? wellbeing.reduce((sum, r) => sum + (r.mood_score as number), 0) / wellbeing.length
    : 0;
  
  const avgStress = wellbeing.length > 0
    ? wellbeing.reduce((sum, r) => sum + (r.stress_level as number), 0) / wellbeing.length
    : 0;
  
  const avgSleep = wellbeing.length > 0
    ? wellbeing.reduce((sum, r) => sum + (r.sleep_hours as number), 0) / wellbeing.length
    : 0;
  
  return {
    avgAttendance,
    avgMarks,
    avgMood,
    avgStress,
    avgSleep,
    interventionCount: interventions.length
  };
};
