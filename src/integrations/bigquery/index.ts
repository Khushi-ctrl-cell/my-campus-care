// BigQuery Integration exports
export { clearMockBigQuery } from './mockBigQuery';
export {
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
  type AttendanceRecord,
  type MarksRecord,
  type WellbeingRecord,
  type InterventionRecord,
  type RiskPredictionRecord
} from './studentAnalytics';
