// NAPLAN Year 7 Numeracy Test Generator - Type Definitions

export type QuestionType = 
  // Number & Algebra
  | 'place-value'
  | 'decimals'
  | 'fractions'
  | 'patterns'
  | 'equations'
  | 'ratio'
  | 'mean'
  | 'algebra'
  | 'ordering'
  | 'mixed-numbers'
  // Measurement & Geometry
  | 'perimeter'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'measurement'
  | 'temperature'
  | 'L-shape'
  | 'shape'
  | 'triangle'
  | 'views'
  | '3d-view'
  | 'net'
  | 'nets'
  | 'rotation'
  | 'transformations'
  | 'coordinates'
  | 'angles'
  | 'protractor'
  | 'scale'
  | 'polygon'
  | 'isosceles'
  | 'symmetry'
  | 'geometry'
  // Statistics & Probability
  | 'probability'
  | 'statistics'
  | 'spinner'
  | 'bar-graph'
  | 'map'
  | 'map-reading'
  | 'enlargement'
  | 'postage'
  | 'profit';

export type TestMode = 'non-calculator' | 'calculator';

export type AnswerFormat = 'multiple-choice' | 'numeric';

export interface Question {
  id: string;
  type: QuestionType;
  mode: TestMode;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  questionText: string;
  answerFormat: AnswerFormat;
  options?: string[];
  correctAnswer: string | number;
  workedSolution: string;
  category: 'number-algebra' | 'measurement-geometry' | 'statistics-probability';
  diagram?: {
    type: string;
    data: Record<string, unknown>;
  };
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
