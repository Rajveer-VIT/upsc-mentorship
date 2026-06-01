export interface Option {
  id: string;
  content: string;
}

export interface Question {
  id: string;
  content: string;
  marks: number;
  negativeMarks: number;
  options: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  totalMarks: number;
  passingMarks: number;
  timeLimitMinutes: number;
  year?: number;
  examType: string;
  questions: Question[];
}

export interface QuizAttemptState {
  quizId: string | null;
  answers: Record<string, string>; // questionId -> optionId
  flagged: Record<string, boolean>; // questionId -> isFlagged
  timeRemaining: number;
  isSubmitting: boolean;
  isComplete: boolean;
}
