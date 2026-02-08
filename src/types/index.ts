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
  | 'ordering-numbers'
  | 'mixed-numbers'
  | 'algebra-patterns'
  | 'percentage-discount'
  | 'percentage-of-quantity'
  | 'fraction-decimal-percent'
  | 'negative-numbers'
  | 'index-notation'
  | 'square-root'
  // Measurement & Geometry
  | 'perimeter'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'l-shape-area'
  | 'l-shape-perimeter'
  | 'triangle-area'
  | 'parallelogram-area'
  | 'trapezium-area'
  | 'circle-circumference'
  | 'circle-area'
  | 'composite-shape'
  | 'net-cube'
  | 'net-rectangular-prism'
  | 'volume-prism'
  | 'surface-area'
  | 'capacity'
  | 'mass'
  | 'temperature'
  | 'length-conversion'
  | 'angle-types'
  | 'angles-on-line'
  | 'angles-in-triangle'
  | 'angles-in-quadrilateral'
  | 'bearing'
  | 'compass-directions'
  | 'coordinates'
  | 'reflection'
  | 'rotation'
  | 'translation'
  | 'symmetry'
  | 'scale-reading'
  | 'timetable'
  | 'calendar'
  // Statistics & Probability
  | 'probability'
  | 'statistics'
  | 'bar-graph'
  | 'pie-chart'
  | 'line-graph'
  | 'stem-leaf'
  | 'dot-plot'
  | 'two-way-table'
  | 'venn-diagram'
  | 'map-reading'
  | 'spinner'
  | 'dice-probability'
  | 'card-probability'
  | 'experimental-probability'
  | 'tree-diagram';

export type TestMode = 'non-calculator' | 'calculator';

export type AnswerFormat = 'multiple-choice' | 'numeric';

export interface Diagram {
  type: 'bar-graph' | 'spinner' | 'shape' | 'map' | 'number-line' | 'clock' | 'measuring-jug' | 'protractor' | 'rotation-shape' | 'view-3d' | 'net' | 'coordinates' | 'pie-chart' | 'line-graph' | 'stem-leaf' | 'two-way-table' | 'venn-diagram' | 'tree-diagram';
  data?: any;
}

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
  diagram?: Diagram;
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
