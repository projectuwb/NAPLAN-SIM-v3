import type { Question, TestMode } from '@/types';
import { uuidv4, shuffleArray, makeDistractors } from '@/lib/utils';

// Import all question generators from category files
import {
  generatePlaceValueQuestion,
  generateDecimalQuestion,
  generateOrderingQuestion,
  generateFractionQuestion,
  generateAlgebraQuestion,
  generatePatternQuestion,
  generateEquationQuestion,
  generateRatioQuestion,
  generateMeanQuestion,
  generateMixedNumberQuestion,
  generatePercentageQuestion,
} from './numberAlgebra';

import {
  generatePerimeterQuestion,
  generateAreaQuestion,
  generateVolumeQuestion,
  generateMeasurementQuestion,
  generateTimeQuestion,
  generateTemperatureQuestion,
  generateSpeedQuestion,
  generate3DViewQuestion,
  generateNetQuestion,
  generateRotationQuestion,
  generateTransformationQuestion,
  generateCoordinatesQuestion,
  generateAngleQuestion,
  generateScaleQuestion,
  generatePolygonQuestion,
  generateIsoscelesQuestion,
  generateSymmetryQuestion,
  generateSurfaceAreaQuestion,
  generateBestBuyQuestion,
} from './measurementGeometry';

import {
  generateProbabilityQuestion,
  generateStatisticsQuestion,
  generateBarGraphQuestion,
  generatePercentageQuantityQuestion,
  generateFractionNumberQuestion,
  generateMapReadingQuestion,
  generateDirectionQuestion,
  generateEnlargementQuestion,
  generateProfitQuestion,
  generatePostageQuestion,
} from './statisticsProbability';

// Registry of all question generators by mode
const nonCalcGenerators = [
  // Number & Algebra (non-calculator)
  generatePlaceValueQuestion,
  generateDecimalQuestion,
  generateOrderingQuestion,
  generateFractionQuestion,
  generateAlgebraQuestion,
  generatePatternQuestion,
  generateEquationQuestion,
  generateMixedNumberQuestion,
  generatePercentageQuestion,
  
  // Measurement & Geometry (non-calculator)
  generatePerimeterQuestion,
  generateAreaQuestion,
  generateMeasurementQuestion,
  generateTimeQuestion,
  generateTemperatureQuestion,
  generateSpeedQuestion,
  generate3DViewQuestion,
  generateNetQuestion,
  generateRotationQuestion,
  generateTransformationQuestion,
  generateCoordinatesQuestion,
  generateAngleQuestion,
  generateScaleQuestion,
  generatePolygonQuestion,
  generateIsoscelesQuestion,
  generateSymmetryQuestion,
  generateSurfaceAreaQuestion,
  generateBestBuyQuestion,
  
  // Statistics & Probability (non-calculator)
  generateProbabilityQuestion,
  generateMapReadingQuestion,
  generateDirectionQuestion,
  generateFractionNumberQuestion,
];

const calcGenerators = [
  ...nonCalcGenerators,
  // Calculator-only questions
  generateRatioQuestion,
  generateMeanQuestion,
  generateVolumeQuestion,
  generateStatisticsQuestion,
  generateBarGraphQuestion,
  generatePercentageQuantityQuestion,
  generateEnlargementQuestion,
  generateProfitQuestion,
  generatePostageQuestion,
];

// Type for generator functions
type QuestionGenerator = (mode: 'non-calculator' | 'calculator') => Question;

// Generate a complete test
export function generateTest(mode: TestMode, count: number = 32): Question[] {
  const generators = mode === 'non-calculator' ? nonCalcGenerators : calcGenerators;
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const gen = generators[Math.floor(Math.random() * generators.length)];
    questions.push(gen(mode));
  }
  
  return questions;
}

// Export individual generators for testing/selection
export {
  // Number & Algebra
  generatePlaceValueQuestion,
  generateDecimalQuestion,
  generateOrderingQuestion,
  generateFractionQuestion,
  generateAlgebraQuestion,
  generatePatternQuestion,
  generateEquationQuestion,
  generateRatioQuestion,
  generateMeanQuestion,
  generateMixedNumberQuestion,
  generatePercentageQuestion,
  
  // Measurement & Geometry
  generatePerimeterQuestion,
  generateAreaQuestion,
  generateVolumeQuestion,
  generateMeasurementQuestion,
  generateTimeQuestion,
  generateTemperatureQuestion,
  generateSpeedQuestion,
  generate3DViewQuestion,
  generateNetQuestion,
  generateRotationQuestion,
  generateTransformationQuestion,
  generateCoordinatesQuestion,
  generateAngleQuestion,
  generateScaleQuestion,
  generatePolygonQuestion,
  generateIsoscelesQuestion,
  generateSymmetryQuestion,
  generateSurfaceAreaQuestion,
  generateBestBuyQuestion,
  
  // Statistics & Probability
  generateProbabilityQuestion,
  generateStatisticsQuestion,
  generateBarGraphQuestion,
  generatePercentageQuantityQuestion,
  generateFractionNumberQuestion,
  generateMapReadingQuestion,
  generateDirectionQuestion,
  generateEnlargementQuestion,
  generateProfitQuestion,
  generatePostageQuestion,
};
