import type { Question, TestMode, CategoryDistribution } from '@/types';
import { validateQuestion } from '@/lib/validation';

// Import all question generators
import * as numberAlgebra from './numberAlgebra';
import * as measurementGeometry from './measurementGeometry';
import * as statisticsProbability from './statisticsProbability';

// Question generator registry
const questionGenerators: Record<string, (mode: TestMode) => Question> = {
  // Number & Algebra
  'place-value': numberAlgebra.generatePlaceValueQuestion,
  'decimals': numberAlgebra.generateDecimalQuestion,
  'ordering': numberAlgebra.generateOrderingQuestion,
  'fractions': numberAlgebra.generateFractionQuestion,
  'algebra': numberAlgebra.generateAlgebraQuestion,
  'patterns': numberAlgebra.generatePatternQuestion,
  'equations': numberAlgebra.generateEquationQuestion,
  'ratio': numberAlgebra.generateRatioQuestion,
  'mean': numberAlgebra.generateMeanQuestion,
  'mixed-numbers': numberAlgebra.generateMixedNumberQuestion,
  
  // Measurement & Geometry
  'perimeter': measurementGeometry.generatePerimeterQuestion,
  'area': measurementGeometry.generateAreaQuestion,
  'volume': measurementGeometry.generateVolumeQuestion,
  'measurement': measurementGeometry.generateMeasurementQuestion,
  'time': measurementGeometry.generateTimeQuestion,
  'temperature': measurementGeometry.generateTemperatureQuestion,
  'speed': measurementGeometry.generateSpeedQuestion,
  'views': measurementGeometry.generate3DViewQuestion,
  'nets': measurementGeometry.generateNetQuestion,
  'rotation': measurementGeometry.generateRotationQuestion,
  'transformations': measurementGeometry.generateTransformationQuestion,
  'coordinates': measurementGeometry.generateCoordinatesQuestion,
  'angles': measurementGeometry.generateAngleQuestion,
  'scale': measurementGeometry.generateScaleQuestion,
  'polygon': measurementGeometry.generatePolygonQuestion,
  'isosceles': measurementGeometry.generateIsoscelesQuestion,
  'symmetry': measurementGeometry.generateSymmetryQuestion,
  'geometry': measurementGeometry.generateSurfaceAreaQuestion,
  
  // Statistics & Probability
  'probability': statisticsProbability.generateProbabilityQuestion,
  'spinner': statisticsProbability.generateProbabilityQuestion,
  'statistics': statisticsProbability.generateStatisticsQuestion,
  'bar-graph': statisticsProbability.generateBarGraphQuestion,
  'map-reading': statisticsProbability.generateMapReadingQuestion,
  'enlargement': statisticsProbability.generateEnlargementQuestion,
  'profit': statisticsProbability.generateProfitQuestion,
  'postage': statisticsProbability.generatePostageQuestion,
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
    const generator = questionGenerators[type];
    if (!generator) {
      console.warn(`No generator found for type: ${type}`);
      return null;
    }
    
    const question = generator(mode);
    
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
  const maxAttempts = numQuestions * 10;
  let attempts = 0;
  
  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    
    // Determine which category needs more questions
    const neededCategories = Object.entries(distribution)
      .filter(([cat, target]) => categoryCounts[cat] < target)
      .map(([cat]) => cat);
    
    // Filter types by needed categories
    const candidateTypes = availableTypes.filter(type => {
      const generator = questionGenerators[type];
      if (!generator) return false;
      
      // Test generate to get category
      const testQ = generator(mode);
      return neededCategories.includes(testQ.category);
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
