import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizAttemptState } from '@/features/quizzes/types';

interface QuizStore extends QuizAttemptState {
  startQuiz: (quizId: string, durationMinutes: number) => void;
  selectOption: (questionId: string, optionId: string) => void;
  toggleFlag: (questionId: string) => void;
  decrementTimer: () => void;
  clearQuiz: () => void;
  setSubmitting: (status: boolean) => void;
  completeQuiz: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quizId: null,
      answers: {},
      flagged: {},
      timeRemaining: 0,
      isSubmitting: false,
      isComplete: false,

      startQuiz: (quizId, durationMinutes) => {
        // Only reset if it's a new quiz, else resume from persistence
        if (get().quizId !== quizId) {
          set({
            quizId,
            answers: {},
            flagged: {},
            timeRemaining: durationMinutes * 60,
            isSubmitting: false,
            isComplete: false,
          });
        }
      },

      selectOption: (questionId, optionId) => 
        set((state) => ({ answers: { ...state.answers, [questionId]: optionId } })),

      toggleFlag: (questionId) =>
        set((state) => ({ flagged: { ...state.flagged, [questionId]: !state.flagged[questionId] } })),

      decrementTimer: () => 
        set((state) => ({ timeRemaining: Math.max(0, state.timeRemaining - 1) })),

      setSubmitting: (status) => set({ isSubmitting: status }),
      
      completeQuiz: () => set({ isComplete: true, isSubmitting: false }),

      clearQuiz: () => set({ quizId: null, answers: {}, flagged: {}, timeRemaining: 0, isComplete: false }),
    }),
    {
      name: 'upsc-quiz-storage',
    }
  )
);
