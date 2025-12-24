// Student Data Store with localStorage persistence

export interface StudentProfile {
  id: string;
  name: string;
  photo: string;
  course: string;
  semester: number;
  section: string;
  rollNumber: string;
}

export interface AttendanceRecord {
  date: string;
  percentage: number;
}

export interface MarksRecord {
  date: string;
  average: number;
}

export interface WellBeingRecord {
  date: string;
  mood: number;
  stress: number;
  sleep: number;
  motivation: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export interface StudentData {
  profile: StudentProfile;
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  wellBeing: WellBeingRecord[];
  assignments: Assignment[];
  goals: {
    weeklyTarget: number;
    completed: number;
  };
}

const STORAGE_KEY = 'ggct_student_data';

const defaultStudentData: StudentData = {
  profile: {
    id: 'STU001',
    name: 'Aryan Sharma',
    photo: '',
    course: 'B.Tech CSE',
    semester: 5,
    section: 'A',
    rollNumber: '0201CS211001',
  },
  attendance: [
    { date: '2024-11-18', percentage: 78 },
    { date: '2024-11-25', percentage: 82 },
    { date: '2024-12-02', percentage: 75 },
    { date: '2024-12-09', percentage: 80 },
    { date: '2024-12-16', percentage: 85 },
    { date: '2024-12-23', percentage: 79 },
  ],
  marks: [
    { date: '2024-11-18', average: 72 },
    { date: '2024-11-25', average: 75 },
    { date: '2024-12-02', average: 70 },
    { date: '2024-12-09', average: 78 },
    { date: '2024-12-16', average: 82 },
    { date: '2024-12-23', average: 76 },
  ],
  wellBeing: [
    { date: '2024-11-18', mood: 4, stress: 3, sleep: 3, motivation: 4 },
    { date: '2024-11-25', mood: 3, stress: 4, sleep: 2, motivation: 3 },
    { date: '2024-12-02', mood: 3, stress: 3, sleep: 3, motivation: 3 },
    { date: '2024-12-09', mood: 4, stress: 2, sleep: 4, motivation: 4 },
    { date: '2024-12-16', mood: 5, stress: 2, sleep: 4, motivation: 5 },
    { date: '2024-12-23', mood: 4, stress: 3, sleep: 3, motivation: 4 },
  ],
  assignments: [
    { id: '1', title: 'Data Structures Lab Report', subject: 'DSA', dueDate: '2024-12-28', completed: false },
    { id: '2', title: 'DBMS Project Submission', subject: 'DBMS', dueDate: '2024-12-30', completed: false },
    { id: '3', title: 'Software Engineering Case Study', subject: 'SE', dueDate: '2025-01-02', completed: false },
  ],
  goals: {
    weeklyTarget: 10,
    completed: 7,
  },
};

export function getStudentData(): StudentData {
  if (typeof window === 'undefined') return defaultStudentData;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultStudentData;
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudentData));
  return defaultStudentData;
}

export function saveStudentData(data: StudentData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateProfile(profile: Partial<StudentProfile>): StudentData {
  const data = getStudentData();
  data.profile = { ...data.profile, ...profile };
  saveStudentData(data);
  return data;
}

export function addWellBeingRecord(record: Omit<WellBeingRecord, 'date'>): StudentData {
  const data = getStudentData();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if today's record exists
  const existingIndex = data.wellBeing.findIndex(r => r.date === today);
  if (existingIndex >= 0) {
    data.wellBeing[existingIndex] = { ...record, date: today };
  } else {
    data.wellBeing.push({ ...record, date: today });
  }
  
  saveStudentData(data);
  return data;
}

export function toggleAssignment(id: string): StudentData {
  const data = getStudentData();
  const assignment = data.assignments.find(a => a.id === id);
  if (assignment) {
    assignment.completed = !assignment.completed;
    if (assignment.completed) {
      data.goals.completed = Math.min(data.goals.completed + 1, data.goals.weeklyTarget);
    } else {
      data.goals.completed = Math.max(data.goals.completed - 1, 0);
    }
  }
  saveStudentData(data);
  return data;
}

export function calculateRiskLevel(data: StudentData): 'low' | 'medium' | 'high' {
  const latestAttendance = data.attendance[data.attendance.length - 1]?.percentage || 0;
  const latestMarks = data.marks[data.marks.length - 1]?.average || 0;
  const latestWellBeing = data.wellBeing[data.wellBeing.length - 1];
  
  let riskScore = 0;
  
  // Attendance risk
  if (latestAttendance < 65) riskScore += 3;
  else if (latestAttendance < 75) riskScore += 2;
  else if (latestAttendance < 85) riskScore += 1;
  
  // Marks risk
  if (latestMarks < 50) riskScore += 3;
  else if (latestMarks < 60) riskScore += 2;
  else if (latestMarks < 70) riskScore += 1;
  
  // Well-being risk
  if (latestWellBeing) {
    const avgWellBeing = (latestWellBeing.mood + latestWellBeing.sleep + latestWellBeing.motivation) / 3;
    if (avgWellBeing < 2) riskScore += 2;
    else if (avgWellBeing < 3) riskScore += 1;
    
    if (latestWellBeing.stress > 4) riskScore += 2;
    else if (latestWellBeing.stress > 3) riskScore += 1;
  }
  
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

export function getRiskMessage(level: 'low' | 'medium' | 'high', data: StudentData): string {
  const latestAttendance = data.attendance[data.attendance.length - 1]?.percentage || 0;
  
  switch (level) {
    case 'low':
      return "Great progress! Keep up the excellent work and maintain your momentum! 🌟";
    case 'medium':
      return latestAttendance < 80 
        ? "Medium risk: Attendance slightly low in some subjects. You've got this! 💪"
        : "Medium risk: Some areas need attention. Small steps lead to big improvements! 📈";
    case 'high':
      return "We're here to help! Let's work together to get back on track. Reach out to your mentor. 💙";
  }
}
