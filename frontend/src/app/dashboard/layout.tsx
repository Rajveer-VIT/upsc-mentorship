// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\src\app\dashboard\layout.tsx
import React from 'react';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';

export const metadata = {
  title: 'Student Dashboard | UPSC with Eshwar',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 w-full flex-col mt-16 md:mt-0 max-w-full overflow-x-hidden p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
