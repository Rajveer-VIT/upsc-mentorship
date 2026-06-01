'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Award } from 'lucide-react';
import { PrimaryButton } from '@/components/ui';
import { Quiz } from '@/features/quizzes/types';

export default function QuizListingPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('user_role') || localStorage.getItem('userRole');
    if (userRole === 'Admin') {
      router.push('/dashboard/admin');
      return;
    }
    // Mock fetch
    setTimeout(() => {
      setQuizzes([
        {
          id: 'mock-uuid-1', title: 'UPSC Prelims 2023 - GS Paper 1', description: 'Official Previous Year Paper',
          category: 'All Subjects', totalMarks: 200, passingMarks: 100, timeLimitMinutes: 120, year: 2023, examType: 'Prelims',
          questions: Array(100).fill({} as any)
        },
        {
          id: 'mock-uuid-2', title: 'Modern History Sectional Test', description: 'Focus on 1857 to 1947',
          category: 'History', totalMarks: 100, passingMarks: 50, timeLimitMinutes: 60, year: undefined, examType: 'Mock',
          questions: Array(50).fill({} as any)
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy dark:text-white">PYQs & Mock Tests</h1>
        <p className="text-slate-500 mt-1">Practice with real exam questions and timed mocks.</p>
      </div>

      <div className="flex gap-4">
        <select className="border border-slate-200 rounded-lg px-4 py-2 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <option>All Subjects</option>
          <option>History</option>
          <option>Polity</option>
        </select>
        <select className="border border-slate-200 rounded-lg px-4 py-2 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <option>All Years</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase">{quiz.category}</span>
                {quiz.year && <span className="bg-navy/5 text-navy dark:bg-white/5 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">{quiz.year}</span>}
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{quiz.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 flex-1">{quiz.description}</p>
              
              <div className="grid grid-cols-3 gap-2 my-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <BookOpen className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{quiz.questions.length} Qs</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-l border-r border-slate-100 dark:border-slate-800">
                  <Clock className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{quiz.timeLimitMinutes} min</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Award className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{quiz.totalMarks} Marks</span>
                </div>
              </div>
              
              <Link href={`/dashboard/quizzes/${quiz.id}`} className="block mt-auto">
                <PrimaryButton className="w-full">Start Attempt</PrimaryButton>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
