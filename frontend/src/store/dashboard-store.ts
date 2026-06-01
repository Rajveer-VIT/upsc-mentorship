// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\src\store\dashboard-store.ts
import { create } from 'zustand';
import { DashboardState } from '@/types/dashboard.types';

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  stats: null,
  weeklyData: [],
  subjectProgress: [],
  upcomingSessions: [],
  dailyTargets: [],
  isLoading: true,

  toggleTarget: (id) => set((state) => ({
    dailyTargets: state.dailyTargets.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  })),

  fetchDashboardData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set({
      profile: { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Student' },
      stats: { todayStudyHours: 6.5, quizScore: 85, streakDays: 14, sessionsBooked: 2 },
      weeklyData: [
        { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 6 },
        { day: 'Wed', hours: 5 }, { day: 'Thu', hours: 8 },
        { day: 'Fri', hours: 7 }, { day: 'Sat', hours: 9 },
        { day: 'Sun', hours: 6 },
      ],
      subjectProgress: [
        { subject: 'Prelims', progress: 75, color: '#C9A84C' },
        { subject: 'Mains', progress: 45, color: '#0B1426' },
        { subject: 'Essay', progress: 60, color: '#10B981' },
      ],
      upcomingSessions: [
        { id: '1', mentorName: 'Dr. Priya Patel', date: 'Today, 4:00 PM', topic: 'Polity Answer Writing', mentorAvatar: 'https://via.placeholder.com/40' },
        { id: '2', mentorName: 'Amit Singh', date: 'Tomorrow, 10:00 AM', topic: 'Economy Doubts', mentorAvatar: 'https://via.placeholder.com/40' },
      ],
      dailyTargets: [
        { id: '1', title: 'Read Hindu Editorial', completed: true },
        { id: '2', title: 'Complete Polity Chapter 4', completed: false },
        { id: '3', title: 'Write 2 Mains Answers', completed: false },
      ],
      isLoading: false
    });
  }
}));
