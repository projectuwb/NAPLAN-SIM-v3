import { z } from 'zod';

export const DiagramDataSchema = z.object({
  type: z.enum(['protractor', 'measuring-jug', '3d-view', 'map', 'shape', 'rotation', 'bar-graph', 'clock', 'number-line', 'net', 'spinner', 'coordinates', 'triangle', 'polygon']),
  data: z.record(z.string(), z.unknown()),
});

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'place-value', 'map-reading', 'rotation', '3d-shapes', 'algebra', 'decimals',
    'probability', 'angles', 'equations', 'perimeter', 'patterns', 'statistics',
    'measurement', 'ordering', 'fractions', 'time', 'geometry', 'mean', 'balance',
    'area', 'mixed-numbers', 'volume', 'temperature', 'views', 'ratio', 'nets',
    'transformations', 'speed', 'estimation', 'clock', 'number-line', 'postage',
    'enlargement', 'symmetry', 'isosceles', 'bar-graph', 'scale', 'profit',
    'coordinates', 'polygon', 'spinner'
  ]),
  mode: z.enum(['non-calculator', 'calculator']),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  questionText: z.string().min(1),
  answerFormat: z.enum(['multiple-choice', 'numeric']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  userAnswer: z.union([z.string(), z.number()]).optional(),
  diagram: DiagramDataSchema.optional(),
  workedSolution: z.string().min(1),
  category: z.enum(['number-algebra', 'measurement-geometry', 'statistics-probability']),
});

export const TestStateSchema = z.object({
  mode: z.enum(['non-calculator', 'calculator']),
  questions: z.array(QuestionSchema),
  currentQuestionIndex: z.number().int().min(0),
  timeRemaining: z.number().int().min(0),
  isComplete: z.boolean(),
  startTime: z.number().int(),
  endTime: z.number().int().optional(),
});

export const QuestionResultSchema = z.object({
  questionId: z.string(),
  questionType: z.string(),
  correct: z.boolean(),
  userAnswer: z.union([z.string(), z.number()]).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
});

export const TestResultSchema = z.object({
  mode: z.enum(['non-calculator', 'calculator']),
  totalQuestions: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
  score: z.number().min(0).max(100),
  timeTaken: z.number().int().min(0),
  questionResults: z.array(QuestionResultSchema),
  completedAt: z.string(),
});

export const StoredTestSchema = z.object({
  id: z.string(),
  result: TestResultSchema,
});

// Validation helper functions
export function validateQuestion(question: unknown): { success: boolean; error?: string } {
  const result = QuestionSchema.safeParse(question);
  if (result.success) {
    return { success: true };
  }
  return { success: false, error: result.error.message };
}

export function validateTestState(state: unknown): { success: boolean; error?: string } {
  const result = TestStateSchema.safeParse(state);
  if (result.success) {
    return { success: true };
  }
  return { success: false, error: result.error.message };
}

export function validateTestResult(result: unknown): { success: boolean; error?: string } {
  const parseResult = TestResultSchema.safeParse(result);
  if (parseResult.success) {
    return { success: true };
  }
  return { success: false, error: parseResult.error.message };
}
