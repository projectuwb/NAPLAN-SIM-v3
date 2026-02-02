import type { Question, TestMode, CategoryDistribution } from '@/types';
import { validateQuestion } from '@/lib/validation';

// Import all question generators
import * as numberAlgebra from './numberAlgebra';
import * as measurementGeometry from './measurementGeometry';
import * as statisticsProbability from './statisticsProbability';

// Question generator registry with category info
interface GeneratorInfo {
  fn: (mode: TestMode) => Question;
  category: 'number-algebra' | 'measurement-geometry' | 'statistics-probability';
}

const questionGenerators: Record<string, GeneratorInfo> = {
  // Number & Algebra
  'place-value': { fn: numberAlgebra.generatePlaceValueQuestion, category: 'number-algebra' },
  'decimals': { fn: numberAlgebra.generateDecimalQuestion, category: 'number-algebra' },
  'ordering': { fn: numberAlgebra.generateOrderingQuestion, category: 'number-algebra' },
  'fractions': { fn: numberAlgebra.generateFractionQuestion, category: 'number-algebra' },
  'algebra': { fn: numberAlgebra.generateAlgebraQuestion, category: 'number-algebra' },
  'patterns': { fn: numberAlgebra.generatePatternQuestion, category: 'number-algebra' },
  'equations': { fn: numberAlgebra.generateEquationQuestion, category: 'number-algebra' },
  'ratio': { fn: numberAlgebra.generateRatioQuestion, category: 'number-algebra' },
  'mean': { fn: numberAlgebra.generateMeanQuestion, category: 'number-algebra' },
  'mixed-numbers': { fn: numberAlgebra.generateMixedNumberQuestion, category: 'number-algebra' },
  
  // Measurement & Geometry
  'perimeter': { fn: measurementGeometry.generatePerimeterQuestion, category: 'measurement-geometry' },
  'area': { fn: measurementGeometry.generateAreaQuestion, category: 'measurement-geometry' },
  'volume': { fn: measurementGeometry.generateVolumeQuestion, category: 'measurement-geometry' },
  'measurement': { fn: measurementGeometry.generateMeasurementQuestion, category: 'measurement-geometry' },
  'time': { fn: measurementGeometry.generateTimeQuestion, category: 'measurement-geometry' },
  'temperature': { fn: measurementGeometry.generateTemperatureQuestion, category: 'measurement-geometry' },
  'speed': { fn: measurementGeometry.generateSpeedQuestion, category: 'measurement-geometry' },
  'views': { fn: measurementGeometry.generate3DViewQuestion, category: 'measurement-geometry' },
  'nets': { fn: measurementGeometry.generateNetQuestion, category: 'measurement-geometry' },
  'rotation': { fn: measurementGeometry.generateRotationQuestion, category: 'measurement-geometry' },
  'transformations': { fn: measurementGeometry.generateTransformationQuestion, category: 'measurement-geometry' },
  'coordinates': { fn: measurementGeometry.generateCoordinatesQuestion, category: 'measurement-geometry' },
  'angles': { fn: measurementGeometry.generateAngleQuestion, category: 'measurement-geometry' },
  'scale': { fn: measurementGeometry.generateScaleQuestion, category: 'measurement-geometry' },
  'polygon': { fn: measurementGeometry.generatePolygonQuestion, category: 'measurement-geometry' },
  'isosceles': { fn: measurementGeometry.generateIsoscelesQuestion, category: 'measurement-geometry' },
  'symmetry': { fn: measurementGeometry.generateSymmetryQuestion, category: 'measurement-geometry' },
  'geometry': { fn: measurementGeometry.generateSurfaceAreaQuestion, category: 'measurement-geometry' },
  
  // Statistics & Probability
  'probability': { fn: statisticsProbability.generateProbabilityQuestion, category: 'statistics-probability' },
  'spinner': { fn: statisticsProbability.generateProbabilityQuestion, category: 'statistics-probability' },
  'statistics': { fn: statisticsProbability.generateStatisticsQuestion, category: 'statistics-probability' },
  'bar-graph': { fn: statisticsProbability.generateBarGraphQuestion, category: 'statistics-probability' },
  'map-reading': { fn: statisticsProbability.generateMapReadingQuestion, category: 'statistics-probability' },
  'enlargement': { fn: statisticsProbability.generateEnlargementQuestion, category: 'statistics-probability' },
  'profit': { fn: statisticsProbability.generateProfitQuestion, category: 'statistics-probability' },
  'postage': { fn: statisticsProbability.generatePostageQuestion, category: 'statistics-probability' },
};

// Question type distribution by mode
const nonCalculatorTypes = [
  'place-value', 'decimals', 'ordering', 'fractions', 'algebra',
  'patterns', 'equations', 'ratio', 'mean', 'perimeter', 'area',
  'volume', 'measurement', 'time', 'temperature', 'speed', 'views',
  'nets', 'rotation', 'transformations', 'coordinates', 'angles',
  'scale', 'polygon', 'symmetry', 'probability', 'statistics',
  'map-reading', 'bar-graph', 'enlargement', 'profit', 'postage',
];

const calculatorTypes = [
  ...nonCalculatorTypes,
  'mixed-numbers', 'isosceles', 'geometry', 'spinner',
];

// Category distribution for balanced tests
const defaultDistribution: CategoryDistribution = {
  'number-algebra': 12,
  'measurement-geometry': 12,
  'statistics-probability': 8,
};

// Generate a single question with error handling
export function generateQuestion(type: string, mode: TestMode): Question | null {
  try {
    const generatorInfo = questionGenerators[type];
    if (!generatorInfo) {
      console.warn(`No generator found for type: ${type}`);
      return null;
    }
    
    const question = generatorInfo.fn(mode);
    
    // Validate the generated question
    const validation = validateQuestion(question);
    if (!validation.success) {
      console.error('Question validation failed:', validation.error);
      return null;
    }
    
    return question;
  } catch (error) {
    console.error(`Error generating question of type ${type}:`, error);
    return null;
  }
}

// Generate a complete test
export function generateTest(
  mode: TestMode,
  numQuestions: number = 32,
  distribution: CategoryDistribution = defaultDistribution
): Question[] {
  const questions: Question[] = [];
  const availableTypes = mode === 'non-calculator' ? nonCalculatorTypes : calculatorTypes;
  
  // Track category counts
  const categoryCounts: Record<string, number> = {
    'number-algebra': 0,
    'measurement-geometry': 0,
    'statistics-probability': 0,
  };
  
  // Maximum attempts to prevent infinite loops
  const maxAttempts = numQuestions * 20;
  let attempts = 0;
  
  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    
    // Determine which category needs more questions
    const neededCategories = Object.entries(distribution)
      .filter(([cat, target]) => categoryCounts[cat] < target)
      .map(([cat]) => cat);
    
    // Filter types by needed categories using pre-defined categories
    const candidateTypes = availableTypes.filter(type => {
      const generatorInfo = questionGenerators[type];
      if (!generatorInfo) return false;
      return neededCategories.includes(generatorInfo.category);
    });
    
    // If no candidates, use all available types
    const typesToUse = candidateTypes.length > 0 ? candidateTypes : availableTypes;
    
    // Randomly select a question type
    const randomType = typesToUse[Math.floor(Math.random() * typesToUse.length)];
    
    // Generate the question
    const question = generateQuestion(randomType, mode);
    
    if (question) {
      questions.push(question);
      categoryCounts[question.category]++;
    }
  }
  
  // Shuffle questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions;
}

// Get available question types
export function getAvailableTypes(mode: TestMode): string[] {
  return mode === 'non-calculator' ? nonCalculatorTypes : calculatorTypes;
}

// Get question count by category
export function getQuestionCounts(questions: Question[]): Record<string, number> {
  return questions.reduce((counts, q) => {
    counts[q.category] = (counts[q.category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}
