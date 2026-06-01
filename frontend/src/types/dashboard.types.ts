// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\src\types\dashboard.types.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Mentor' | 'Admin';
  avatarUrl?: string;
}

export interface StatSummary {
  todayStudyHours: number;
  quizScore: number;
  streakDays: number;
  sessionsBooked: number;
}

export interface WeeklyStudyData {
  day: string;
  hours: number;
}

export interface SubjectProgress {
  subject: string;
  progress: number; // 0 to 100
  color: string;
}

export interface UpcomingSession {
  id: string;
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  topic: string;
}

export interface DailyTarget {
  id: string;
  title: string;
  completed: boolean;
}

export interface DashboardState {
  profile: UserProfile | null;
  stats: StatSummary | null;
  weeklyData: WeeklyStudyData[];
  subjectProgress: SubjectProgress[];
  upcomingSessions: UpcomingSession[];
  dailyTargets: DailyTarget[];
  isLoading: boolean;
  
  // Actions
  toggleTarget: (id: string) => void;
  fetchDashboardData: () => Promise<void>;
}
