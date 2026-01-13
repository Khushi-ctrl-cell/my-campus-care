// ERP API Response Types

export interface ERPStudent {
  id: string;
  roll_no: string;
  name: string;
  branch: string;
  attendance: number;
  cie_marks: string; // Format: "18/20"
  status: 'Regular' | 'Low Attendance' | 'Detained';
  created_at: string;
  updated_at: string;
}

export interface ERPProgress {
  id: string;
  student_id: string;
  subject: string;
  attendance: number;
  marks: number;
  assignments_done: number;
  total_assignments: number;
  created_at: string;
}

export interface ERPNotice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'exam' | 'assignment' | 'event';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  expires_at?: string;
}

export interface ERPApiResponse<T> {
  data: T[];
  count: number;
}
