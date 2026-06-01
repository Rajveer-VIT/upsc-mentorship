'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard-store';
import { SkeletonCard, StatCard, Heading } from '@/components/ui';
import { Clock, Award, Flame, Calendar, CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  const router = useRouter();
  const { profile, stats, weeklyData, upcomingSessions, dailyTargets, isLoading, toggleTarget, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    // Redirect admins to admin panel
    const userRole = localStorage.getItem('user_role') || localStorage.getItem('userRole');
    if (userRole === 'Admin') {
      router.push('/dashboard/admin');
      return;
    }
    fetchDashboardData();
  }, [fetchDashboardData, router]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2 h-[400px]" />
          <SkeletonCard className="h-[400px]" />
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      {/* Header with Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Heading level={1} className="text-4xl">
            Jai Hind, {profile?.name?.split(' ')[0]}
          </Heading>
          <p className="text-slate-500 font-medium mt-1">{currentDate}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-bold"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          YOUR PREPARATION IS ON TRACK
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Today's Study" 
          value={`${stats?.todayStudyHours}h`} 
          icon={<Clock className="text-navy dark:text-white" />} 
          trend={{ value: 12, isPositive: true }} 
          className="bg-white dark:bg-slate-900 shadow-sm"
        />
        <StatCard 
          label="Avg Quiz Score" 
          value={`${stats?.quizScore}%`} 
          icon={<Award className="text-gold" />} 
          trend={{ value: 5, isPositive: true }}
          className="bg-white dark:bg-slate-900 shadow-sm"
        />
        <StatCard 
          label="Current Streak" 
          value={`${stats?.streakDays} Days`} 
          icon={<Flame className="text-orange-500" />} 
          className="bg-white dark:bg-slate-900 shadow-sm"
        />
        <StatCard 
          label="Mentorship" 
          value={stats?.sessionsBooked || 0} 
          icon={<Calendar className="text-indigo-500" />} 
          className="bg-white dark:bg-slate-900 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Weekly Chart Container */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-8">
             <Heading level={3} className="text-xl">Weekly Momentum</Heading>
             <select className="bg-slate-50 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-gold outline-none">
               <option>Last 7 Days</option>
               <option>Last Month</option>
             </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(201,168,76,0.05)'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#0B1426', color: '#fff'}} 
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.day === new Date().toLocaleDateString('en-US', {weekday:'short'}) ? 'url(#barGradient)' : '#e2e8f0'} 
                      className="dark:fill-slate-800"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Targets with Premium UI */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Heading level={3} className="text-xl">Daily Targets</Heading>
            <div className="text-[10px] font-black bg-gold/10 text-gold px-2.5 py-1 rounded-full uppercase tracking-widest">
              {dailyTargets.filter(t => t.completed).length}/{dailyTargets.length} DONE
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {dailyTargets.map((target, idx) => (
              <motion.div 
                key={target.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleTarget(target.id)}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                  ${target.completed 
                    ? 'bg-slate-50 border-transparent dark:bg-slate-800/30' 
                    : 'bg-white border-slate-100 hover:border-gold/30 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-gold/30'}`}
              >
                {target.completed ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 group-hover:border-gold transition-colors dark:border-slate-700">
                    <Circle className="w-3 h-3 opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                  </div>
                )}
                <span className={`text-sm font-medium ${target.completed ? 'line-through text-slate-400' : 'text-navy dark:text-slate-200'}`}>
                  {target.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Upcoming Sessions - 3 columns */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Heading level={3} className="text-xl mb-8">Personalized Mentorship</Heading>
          <div className="grid grid-cols-1 gap-4">
            {upcomingSessions.map(session => (
              <div key={session.id} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="relative">
                  <img src={session.mentorAvatar} alt={session.mentorName} className="w-16 h-16 rounded-2xl object-cover border-2 border-gold/20" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-navy dark:text-white text-lg leading-tight">{session.topic}</h4>
                  <p className="text-sm text-slate-500 mt-1 font-medium italic">Mentored by {session.mentorName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-gold uppercase tracking-tighter mb-1">{session.date}</div>
                  <button className="flex items-center gap-1 text-sm font-bold text-navy hover:text-gold transition-colors dark:text-white">
                    JOIN CLASS <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Card - 2 columns */}
        <div className="lg:col-span-2 rounded-3xl bg-navy p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-center group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-gold mb-6">
              <div className="p-2 bg-gold/10 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.3em]">AI Insight Engine</span>
            </div>
            
            <p className="text-2xl font-serif font-medium leading-relaxed italic text-cream/90">
              "Your performance in <span className="text-gold">International Relations</span> is peak, but ethics case studies need immediate attention. Your decision-making speed is 20% below topper average."
            </p>
            
            <div className="mt-10 flex gap-4">
              <button className="flex-1 text-xs font-black bg-gold text-navy hover:bg-gold-light px-6 py-4 rounded-2xl transition-all shadow-lg shadow-gold/10">
                FIX WEAK AREAS
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                <Calendar className="w-5 h-5 text-gold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
