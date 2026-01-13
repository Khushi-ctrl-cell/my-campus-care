// ERP API Client

import { ERPStudent, ERPProgress, ERPNotice, ERPApiResponse } from './types';

const ERP_BASE_URL = 'https://kemwxuuazkkxsddexscx.supabase.co/functions/v1';

async function fetchFromERP<T>(endpoint: string): Promise<ERPApiResponse<T>> {
  try {
    const response = await fetch(`${ERP_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ERP API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ERP ${endpoint}:`, error);
    return { data: [], count: 0 };
  }
}

export async function fetchStudents(): Promise<ERPApiResponse<ERPStudent>> {
  return fetchFromERP<ERPStudent>('api-students');
}

export async function fetchProgress(): Promise<ERPApiResponse<ERPProgress>> {
  return fetchFromERP<ERPProgress>('api-progress');
}

export async function fetchNotices(): Promise<ERPApiResponse<ERPNotice>> {
  return fetchFromERP<ERPNotice>('api-notices');
}

// Find student by roll number
export async function findStudentByRollNo(rollNo: string): Promise<ERPStudent | null> {
  const { data } = await fetchStudents();
  return data.find(student => student.roll_no === rollNo) || null;
}

// Get all students by branch
export async function getStudentsByBranch(branch: string): Promise<ERPStudent[]> {
  const { data } = await fetchStudents();
  return data.filter(student => student.branch === branch);
}

// Get at-risk students (Low Attendance or Detained)
export async function getAtRiskStudents(): Promise<ERPStudent[]> {
  const { data } = await fetchStudents();
  return data.filter(student => student.status !== 'Regular');
}

// Parse CIE marks string to percentage
export function parseCIEMarks(cieMarks: string): number {
  const [obtained, total] = cieMarks.split('/').map(Number);
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}

// Calculate risk level from ERP data
export function calculateERPRiskLevel(student: ERPStudent): 'low' | 'medium' | 'high' {
  const marksPercentage = parseCIEMarks(student.cie_marks);
  
  if (student.status === 'Detained' || student.attendance < 65 || marksPercentage < 50) {
    return 'high';
  }
  
  if (student.status === 'Low Attendance' || student.attendance < 75 || marksPercentage < 60) {
    return 'medium';
  }
  
  return 'low';
}
