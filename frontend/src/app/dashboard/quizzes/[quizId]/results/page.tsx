'use client';

import React, { useEffect, useState } from 'react';
import { PrimaryButton, GhostButton } from '@/components/ui';
import { CheckCircle2, XCircle, MinusCircle, Trophy, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { useQuizStore } from '@/store/quiz-store';

export default function QuizResultsPage() {
  const { clearQuiz } = useQuizStore();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Mock result fetch
    setTimeout(() => {
      setResult({
        score: 65, totalMarks: 100,
        correctAnswers: 35, wrongAnswers: 10, skippedAnswers: 5,
        timeTakenSeconds: 3450,
        accuracy: 78,
      });
      clearQuiz();
    }, 1000);
  }, [clearQuiz]);

  if (!result) return <div className="p-8 text-center animate-pulse text-lg font-bold text-navy">Calculating Results...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-navy dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold mb-2">Quiz Completed!</h1>
          <p className="text-cream/80 text-lg mb-8">Modern History Sectional Test</p>
          
          <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-6xl font-bold text-gold">{result.score}</span>
            <span className="text-xl text-cream/70 mb-2">/ {result.totalMarks} Marks</span>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/dashboard/quizzes"><GhostButton className="border-white/20 text-white hover:bg-white/10">Back to Quizzes</GhostButton></Link>
            <PrimaryButton className="bg-gold text-navy hover:bg-amber-400 hover:from-amber-400 hover:to-gold">Review Answers</PrimaryButton>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <Target className="w-8 h-8 text-navy dark:text-white mb-3" />
          <p className="text-sm text-slate-500 font-medium">Accuracy</p>
          <p className="text-2xl font-bold text-navy dark:text-white mt-1">{result.accuracy}%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <Clock className="w-8 h-8 text-navy dark:text-white mb-3" />
          <p className="text-sm text-slate-500 font-medium">Time Taken</p>
          <p className="text-2xl font-bold text-navy dark:text-white mt-1">{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
          <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium">Correct</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{result.correctAnswers}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 flex flex-col items-center justify-center text-center">
          <XCircle className="w-8 h-8 text-red-500 mb-3" />
          <p className="text-sm text-red-600 dark:text-red-500 font-medium">Incorrect</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">{result.wrongAnswers}</p>
        </div>
      </div>

      {/* Review Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
         <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Detailed Review Mode</h3>
         <p className="text-slate-500 max-w-lg mx-auto mb-6">Review every question, see exactly what went wrong, and read the comprehensive explanations to solidify your concepts.</p>
         <PrimaryButton>Start Question Review</PrimaryButton>
      </div>
    </div>
  );
}
