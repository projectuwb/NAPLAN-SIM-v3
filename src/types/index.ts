// NAPLAN Year 7 Numeracy Test Generator - Type Definitions

export type QuestionType = 
  | 'place-value'
  | 'decimals'
  | 'fractions'
  | 'patterns'
  | 'equations'
  | 'ratio'
  | 'mean'
  | 'perimeter'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'probability'
  | 'statistics';

export type TestMode = 'non-calculator' | 'calculator';

export type AnswerFormat = 'multiple-choice' | 'numeric';

export interface Question {
  id: string;
  type: QuestionType;
  mode: TestMode;
  questionText: string;
  answerFormat: AnswerFormat;
  options?: string[];
  correctAnswer: string;
  workedSolution: string;
  category: 'number-algebra' | 'measurement-geometry' | 'statistics-probability';
}

export interface TestResult {
  id: string;
  mode: TestMode;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
  completedAt: string;
  questionResults: {
    questionId: string;
    questionType: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface TestState {
  mode: TestMode;
  questions: Question[];
  currentIndex: number;
  timeRemaining: number;
  answers: Record<string, string>;
}
