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

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  attendance: number;
  internalMarks: number;
  assignmentsDone: number;
  totalAssignments: number;
  classesNeeded?: number;
  insight?: string;
}

export interface DailyScheduleItem {
  id: string;
  type: 'class' | 'assignment' | 'test';
  subject: string;
  time: string;
  title?: string;
}

export interface Streak {
  type: 'attendance' | 'assignment' | 'checkin';
  current: number;
  best: number;
  lastDate: string;
}

export interface WeeklyReflection {
  date: string;
  wentWell: string;
  toImprove: string;
}

export interface FocusSession {
  id: string;
  subject: string;
  duration: number;
  completedAt: string;
}

export interface StudentData {
  profile: StudentProfile;
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  wellBeing: WellBeingRecord[];
  assignments: Assignment[];
  subjects: SubjectData[];
  todaySchedule: DailyScheduleItem[];
  streaks: Streak[];
  weeklyReflections: WeeklyReflection[];
  focusSessions: FocusSession[];
  goals: {
    weeklyTarget: number;
    completed: number;
    items: string[];
  };
}

const STORAGE_KEY = 'ggct_student_data';

const defaultSubjects: SubjectData[] = [
  { 
    id: '1', 
    name: 'Theory of Computation', 
    code: 'TOC', 
    attendance: 72, 
    internalMarks: 68, 
    assignmentsDone: 2, 
    totalAssignments: 3,
    classesNeeded: 3,
    insight: 'Needs 3 more classes this month'
  },
  { 
    id: '2', 
    name: 'Database Management System', 
    code: 'DBMS', 
    attendance: 85, 
    internalMarks: 78, 
    assignmentsDone: 3, 
    totalAssignments: 3,
    insight: 'On track! Keep it up'
  },
  { 
    id: '3', 
    name: 'Cyber Security', 
    code: 'CS', 
    attendance: 78, 
    internalMarks: 72, 
    assignmentsDone: 2, 
    totalAssignments: 3,
    classesNeeded: 2,
    insight: 'Needs 2 more classes'
  },
  { 
    id: '4', 
    name: 'Internet & Web Technology', 
    code: 'IWT', 
    attendance: 90, 
    internalMarks: 82, 
    assignmentsDone: 3, 
    totalAssignments: 3,
    insight: 'Excellent performance!'
  },
  { 
    id: '5', 
    name: 'Python Practicals', 
    code: 'PP', 
    attendance: 88, 
    internalMarks: 85, 
    assignmentsDone: 4, 
    totalAssignments: 4,
    insight: 'Great lab work!'
  },
];

const defaultTodaySchedule: DailyScheduleItem[] = [
  { id: '1', type: 'class', subject: 'TOC', time: '9:00 AM', title: 'Regular Expression' },
  { id: '2', type: 'class', subject: 'DBMS', time: '10:00 AM', title: 'Normalization' },
  { id: '3', type: 'assignment', subject: 'CS', time: '5:00 PM', title: 'Network Security Report' },
  { id: '4', type: 'class', subject: 'IWT', time: '2:00 PM', title: 'React Basics' },
];

const defaultStreaks: Streak[] = [
  { type: 'attendance', current: 5, best: 12, lastDate: new Date().toISOString().split('T')[0] },
  { type: 'assignment', current: 3, best: 8, lastDate: new Date().toISOString().split('T')[0] },
  { type: 'checkin', current: 7, best: 14, lastDate: new Date().toISOString().split('T')[0] },
];

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
    { id: '1', title: 'TOC Assignment - Regular Expressions', subject: 'TOC', dueDate: '2024-12-28', completed: false },
    { id: '2', title: 'DBMS Project Submission', subject: 'DBMS', dueDate: '2024-12-30', completed: false },
    { id: '3', title: 'Cyber Security Case Study', subject: 'CS', dueDate: '2025-01-02', completed: false },
    { id: '4', title: 'IWT React Project', subject: 'IWT', dueDate: '2025-01-05', completed: false },
    { id: '5', title: 'Python Lab File', subject: 'PP', dueDate: '2025-01-03', completed: true },
  ],
  subjects: defaultSubjects,
  todaySchedule: defaultTodaySchedule,
  streaks: defaultStreaks,
  weeklyReflections: [
    { date: '2024-12-15', wentWell: 'Completed all DBMS assignments', toImprove: 'Need to focus on TOC' },
    { date: '2024-12-22', wentWell: 'Improved attendance this week', toImprove: 'Better sleep schedule' },
  ],
  focusSessions: [
    { id: '1', subject: 'TOC', duration: 25, completedAt: '2024-12-22T10:30:00' },
    { id: '2', subject: 'DBMS', duration: 40, completedAt: '2024-12-22T14:30:00' },
  ],
  goals: {
    weeklyTarget: 10,
    completed: 7,
    items: [
      'Complete TOC assignment',
      'Attend all DBMS classes',
      'Submit Cyber Security report',
      'Practice IWT React components',
      'Complete Python practicals',
    ],
  },
};

export function getStudentData(): StudentData {
  if (typeof window === 'undefined') return defaultStudentData;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new fields exist
      return {
        ...defaultStudentData,
        ...parsed,
        subjects: parsed.subjects || defaultSubjects,
        todaySchedule: parsed.todaySchedule || defaultTodaySchedule,
        streaks: parsed.streaks || defaultStreaks,
        weeklyReflections: parsed.weeklyReflections || [],
        focusSessions: parsed.focusSessions || [],
        goals: {
          ...defaultStudentData.goals,
          ...parsed.goals,
          items: parsed.goals?.items || defaultStudentData.goals.items,
        },
      };
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
    // Update check-in streak
    const checkinStreak = data.streaks.find(s => s.type === 'checkin');
    if (checkinStreak) {
      checkinStreak.current += 1;
      checkinStreak.best = Math.max(checkinStreak.best, checkinStreak.current);
      checkinStreak.lastDate = today;
    }
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
      // Update assignment streak
      const assignmentStreak = data.streaks.find(s => s.type === 'assignment');
      if (assignmentStreak) {
        assignmentStreak.current += 1;
        assignmentStreak.best = Math.max(assignmentStreak.best, assignmentStreak.current);
        assignmentStreak.lastDate = new Date().toISOString().split('T')[0];
      }
    } else {
      data.goals.completed = Math.max(data.goals.completed - 1, 0);
    }
  }
  saveStudentData(data);
  return data;
}

export function addFocusSession(subject: string, duration: number): StudentData {
  const data = getStudentData();
  const session: FocusSession = {
    id: Date.now().toString(),
    subject,
    duration,
    completedAt: new Date().toISOString(),
  };
  data.focusSessions.push(session);
  data.goals.completed = Math.min(data.goals.completed + 1, data.goals.weeklyTarget);
  saveStudentData(data);
  return data;
}

export function addWeeklyReflection(wentWell: string, toImprove: string): StudentData {
  const data = getStudentData();
  const today = new Date().toISOString().split('T')[0];
  
  const existingIndex = data.weeklyReflections.findIndex(r => r.date === today);
  if (existingIndex >= 0) {
    data.weeklyReflections[existingIndex] = { date: today, wentWell, toImprove };
  } else {
    data.weeklyReflections.push({ date: today, wentWell, toImprove });
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
  const lowAttendanceSubjects = data.subjects.filter(s => s.attendance < 75);
  const pendingAssignments = data.assignments.filter(a => !a.completed).length;
  
  switch (level) {
    case 'low':
      return "Great progress! Keep up the excellent work and maintain your momentum!";
    case 'medium':
      if (lowAttendanceSubjects.length > 0) {
        return `Medium risk: Low attendance in ${lowAttendanceSubjects.map(s => s.code).join(', ')}. ${pendingAssignments > 0 ? `${pendingAssignments} assignments pending.` : ''}`;
      }
      return "Medium risk: Some areas need attention. Small steps lead to big improvements!";
    case 'high':
      return "We're here to help! Let's work together to get back on track. Reach out to your mentor.";
  }
}

export function calculateBalanceMeter(data: StudentData): {
  score: number;
  status: 'balanced' | 'overloaded' | 'under-engaged';
  breakdown: { attendance: number; stress: number; sleep: number; engagement: number };
} {
  const latestAttendance = data.attendance[data.attendance.length - 1]?.percentage || 0;
  const latestWellBeing = data.wellBeing[data.wellBeing.length - 1];
  const assignmentCompletion = data.assignments.length > 0 
    ? (data.assignments.filter(a => a.completed).length / data.assignments.length) * 100 
    : 50;
  
  const attendanceScore = Math.min(latestAttendance, 100);
  const stressScore = latestWellBeing ? (5 - latestWellBeing.stress) * 20 : 50; // Invert stress
  const sleepScore = latestWellBeing ? latestWellBeing.sleep * 20 : 50;
  const engagementScore = assignmentCompletion;
  
  const overallScore = (attendanceScore + stressScore + sleepScore + engagementScore) / 4;
  
  let status: 'balanced' | 'overloaded' | 'under-engaged' = 'balanced';
  if (stressScore < 40 && overallScore < 60) {
    status = 'overloaded';
  } else if (attendanceScore < 70 && engagementScore < 50) {
    status = 'under-engaged';
  }
  
  return {
    score: Math.round(overallScore),
    status,
    breakdown: {
      attendance: Math.round(attendanceScore),
      stress: Math.round(stressScore),
      sleep: Math.round(sleepScore),
      engagement: Math.round(engagementScore),
    },
  };
}

export function getSubjectRisk(subject: SubjectData): 'low' | 'medium' | 'high' {
  let riskScore = 0;
  
  if (subject.attendance < 65) riskScore += 2;
  else if (subject.attendance < 75) riskScore += 1;
  
  if (subject.internalMarks < 50) riskScore += 2;
  else if (subject.internalMarks < 60) riskScore += 1;
  
  if (subject.assignmentsDone < subject.totalAssignments) riskScore += 1;
  
  if (riskScore >= 3) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}
