// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\src\app\dashboard\analytics\page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role') || localStorage.getItem('userRole');
    if (userRole === 'Admin') {
      router.push('/dashboard/admin');
    }
  }, [router]);

  const performanceData = [
    { month: 'Jan', score: 65 }, { month: 'Feb', score: 68 },
    { month: 'Mar', score: 75 }, { month: 'Apr', score: 72 },
    { month: 'May', score: 85 }, { month: 'Jun', score: 88 },
  ];

  const timeData = [
    { name: 'Polity', value: 35 },
    { name: 'History', value: 25 },
    { name: 'Geography', value: 20 },
    { name: 'Economy', value: 20 },
  ];
  const COLORS = ['#0B1426', '#C9A84C', '#10B981', '#3B82F6'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-navy dark:text-white">Detailed Analytics</h1>
        <p className="text-slate-500 mt-1">Track your progress and identify weak areas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Line Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-navy dark:text-white mb-6">Monthly Mock Test Performance</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="score" stroke="#C9A84C" strokeWidth={3} dot={{r: 4, fill: '#C9A84C', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-navy dark:text-white mb-6">Time Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Subject Heatmap Placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-navy dark:text-white mb-6">Subject Accuracy Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { subject: 'Modern History', acc: '85%', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
            { subject: 'Polity', acc: '92%', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
            { subject: 'Geography', acc: '45%', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
            { subject: 'Economy', acc: '68%', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <p className="text-sm font-medium mb-1">{item.subject}</p>
              <p className="text-2xl font-bold">{item.acc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
