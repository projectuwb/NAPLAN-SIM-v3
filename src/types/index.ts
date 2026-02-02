// NAPLAN Year 7 Numeracy Test Generator - Type Definitions

export type QuestionType = 
  | 'place-value'
  | 'map-reading'
  | 'rotation'
  | '3d-shapes'
  | 'algebra'
  | 'decimals'
  | 'probability'
  | 'angles'
  | 'equations'
  | 'perimeter'
  | 'patterns'
  | 'statistics'
  | 'measurement'
  | 'ordering'
  | 'fractions'
  | 'time'
  | 'geometry'
  | 'mean'
  | 'balance'
  | 'area'
  | 'mixed-numbers'
  | 'volume'
  | 'temperature'
  | 'views'
  | 'ratio'
  | 'nets'
  | 'transformations'
  | 'speed'
  | 'estimation'
  | 'clock'
  | 'number-line'
  | 'postage'
  | 'enlargement'
  | 'symmetry'
  | 'isosceles'
  | 'bar-graph'
  | 'scale'
  | 'profit'
  | 'coordinates'
  | 'polygon'
  | 'spinner';

export type TestMode = 'non-calculator' | 'calculator';

export type AnswerFormat = 'multiple-choice' | 'numeric';

export interface Question {
  id: string;
  type: QuestionType;
  mode: TestMode;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questionText: string;
  answerFormat: AnswerFormat;
  options?: string[]; // For multiple choice A-D
  correctAnswer: string | number;
  userAnswer?: string | number;
  diagram?: DiagramData;
  workedSolution: string;
  category: 'number-algebra' | 'measurement-geometry' | 'statistics-probability';
}

export interface DiagramData {
  type: 'protractor' | 'measuring-jug' | '3d-view' | 'map' | 'shape' | 'rotation' | 'bar-graph' | 'clock' | 'number-line' | 'net' | 'spinner' | 'coordinates' | 'triangle' | 'polygon';
  data: Record<string, unknown>;
}

export interface TestState {
  mode: TestMode;
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  isComplete: boolean;
  startTime: number;
  endTime?: number;
}

export interface TestResult {
  mode: TestMode;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  timeTaken: number; // in seconds
  questionResults: QuestionResult[];
  completedAt: string;
}

export interface QuestionResult {
  questionId: string;
  questionType: QuestionType;
  correct: boolean;
  userAnswer?: string | number;
  correctAnswer: string | number;
}

export interface StoredTest {
  id: string;
  result: TestResult;
}

// Question generator function type
export type QuestionGenerator = () => Question;

// Category distribution for test generation
export interface CategoryDistribution {
  'number-algebra': number;
  'measurement-geometry': number;
  'statistics-probability': number;
}
