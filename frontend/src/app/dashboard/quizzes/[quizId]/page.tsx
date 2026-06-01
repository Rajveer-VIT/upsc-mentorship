'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quiz-store';
import { PrimaryButton, GhostButton } from '@/components/ui';
import { Clock, Flag, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Quiz } from '@/features/quizzes/types';

export default function QuizAttemptPage({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter();
  const { quizId } = use(params);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    startQuiz, selectOption, toggleFlag, decrementTimer,
    setSubmitting, completeQuiz, timeRemaining, answers, flagged, isSubmitting
  } = useQuizStore();

  useEffect(() => {
    // Mock fetch quiz
    const mockQuiz: Quiz = {
      id: quizId, title: 'Modern History Sectional Test', description: '', category: 'History',
      totalMarks: 100, passingMarks: 50, timeLimitMinutes: 60, examType: 'Mock',
      questions: Array(50).fill(0).map((_, i) => ({
        id: `q-${i}`,
        content: `What was the primary objective of the Cripps Mission in 1942? (Question ${i + 1})`,
        marks: 2, negativeMarks: 1,
        options: [
          { id: `o-1-${i}`, content: 'To grant full independence to India' },
          { id: `o-2-${i}`, content: 'To secure Indian cooperation for the British war effort' },
          { id: `o-3-${i}`, content: 'To partition India' },
          { id: `o-4-${i}`, content: 'To establish a constituent assembly immediately' }
        ]
      }))
    };
    setQuiz(mockQuiz);
    startQuiz(quizId, mockQuiz.timeLimitMinutes);
  }, [quizId, startQuiz]);

  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementTimer]);

  useEffect(() => {
    if (timeRemaining === 0 && quiz) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    completeQuiz();
    router.push(`/dashboard/quizzes/${quizId}/results`);
  };

  if (!quiz) return <div className="p-8 text-center animate-pulse text-lg font-bold text-navy">Loading Quiz Engine...</div>;

  const currentQuestion = quiz.questions[currentIndex];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Main Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-navy dark:text-white">{quiz.title}</h2>
            <p className="text-sm text-slate-500">Question {currentIndex + 1} of {quiz.questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeRemaining < 300 ? 'text-red-500' : 'text-navy dark:text-white'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              <span className="font-bold text-navy dark:text-white mr-2">{currentIndex + 1}.</span>
              {currentQuestion.content}
            </h3>
            <button 
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`p-2 rounded-lg transition-colors ${flagged[currentQuestion.id] ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Flag className={`w-5 h-5 ${flagged[currentQuestion.id] ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 mt-8">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(currentQuestion.id, opt.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3
                    ${isSelected 
                      ? 'border-navy bg-navy/5 dark:border-white dark:bg-white/10 text-navy dark:text-white' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-navy/30 dark:hover:border-white/30 text-slate-700 dark:text-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-navy dark:border-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-navy dark:bg-white" />}
                  </div>
                  {opt.content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-900/50">
          <GhostButton 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 border-slate-300 dark:border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </GhostButton>
          
          {currentIndex === quiz.questions.length - 1 ? (
            <PrimaryButton onClick={handleSubmit} isLoading={isSubmitting} className="bg-emerald-600 hover:from-emerald-700 hover:to-emerald-600">
              Submit Quiz
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setCurrentIndex(prev => prev + 1)} className="flex items-center gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Sidebar Overview */}
      <div className="lg:w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-navy dark:text-white">Question Overview</h3>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-navy dark:bg-white"></div> Answered</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Flagged</div>
          </div>
        </div>
        <div className="p-4 grid grid-cols-5 gap-2 overflow-y-auto flex-1 content-start">
          {quiz.questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = flagged[q.id];
            const isActive = currentIndex === i;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`h-10 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors relative
                  ${isActive ? 'ring-2 ring-navy dark:ring-white ring-offset-2 dark:ring-offset-slate-900' : ''}
                  ${isAnswered ? 'bg-navy text-white dark:bg-white dark:text-navy' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'}
                `}
              >
                {i + 1}
                {isFlagged && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900"></div>}
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <GhostButton onClick={handleSubmit} isLoading={isSubmitting} className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900/30">
            End Quiz Early
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
