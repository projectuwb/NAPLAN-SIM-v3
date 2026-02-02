import type { Question } from '@/types';
import { uuidv4, shuffle, generateDistractors } from '@/lib/utils';

// Place Value Questions
export const generatePlaceValueQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const thousands = Math.floor(Math.random() * 90) + 10; // 10-99
  const hundreds = Math.floor(Math.random() * 10);
  const tens = Math.floor(Math.random() * 10);
  const ones = Math.floor(Math.random() * 10);
  
  const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  
  // Format the word form
  const wordParts: string[] = [];
  if (thousands > 0) {
    wordParts.push(`${thousands} thousand`);
  }
  if (hundreds > 0) wordParts.push(`${['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][hundreds]} hundred`);
  if (tens > 0 || ones > 0) {
    const teenWords = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tenWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (tens === 1) {
      wordParts.push(teenWords[ones]);
    } else {
      const tensPart = tenWords[tens] || '';
      const onesPart = ones > 0 ? ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][ones] : '';
      if (tensPart || onesPart) wordParts.push(`${tensPart}${tensPart && onesPart ? ' ' : ''}${onesPart}`);
    }
  }
  
  const wordForm = wordParts.join(' and ').replace(' and ', ' ');
  
  // Format correct answer with spaces
  const correctAnswer = number.toLocaleString('en-US').replace(/,/g, ' ');
  
  // Generate distractors
  const distractorNumbers = generateDistractors(number, 3);
  const options = shuffle([
    correctAnswer,
    ...distractorNumbers.map(n => n.toLocaleString('en-US').replace(/,/g, ' '))
  ]);
  
  const correctIndex = options.indexOf(correctAnswer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'place-value',
    mode,
    difficulty: 'basic',
    questionText: `Which number is ${wordForm}?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `The number ${wordForm} is written as ${correctAnswer}.`,
    category: 'number-algebra',
  };
};

// Decimal Operations
export const generateDecimalQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'division' : 'multiplication';
  
  if (type === 'division') {
    const divisor = [0.2, 0.5, 0.25, 0.1, 0.4, 0.8][Math.floor(Math.random() * 6)];
    const quotient = Math.floor(Math.random() * 20) + 5;
    const dividend = parseFloat((divisor * quotient).toFixed(2));
    
    const correctAnswer = quotient;
    const distractors = generateDistractors(quotient, 3);
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'decimals',
      mode,
      difficulty: 'intermediate',
      questionText: `What is the answer to ${dividend} ÷ ${divisor}?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `${dividend} ÷ ${divisor} = ${dividend * (1/divisor)} = ${correctAnswer}.`,
      category: 'number-algebra',
    };
  } else {
    const a = parseFloat((Math.random() * 10 + 1).toFixed(1));
    const b = parseFloat((Math.random() * 5 + 0.5).toFixed(1));
    const correctAnswer = parseFloat((a * b).toFixed(2));
    
    return {
      id: uuidv4(),
      type: 'decimals',
      mode,
      difficulty: 'intermediate',
      questionText: `Calculate ${a} × ${b}`,
      answerFormat: 'numeric',
      correctAnswer,
      workedSolution: `${a} × ${b} = ${correctAnswer}`,
      category: 'number-algebra',
    };
  }
};

// Ordering Decimals
export const generateOrderingQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const decimals = [];
  for (let i = 0; i < 4; i++) {
    const whole = Math.floor(Math.random() * 10);
    const decimal = Math.floor(Math.random() * 1000);
    decimals.push(parseFloat(`${whole}.${decimal.toString().padStart(3, '0')}`));
  }
  
  const sorted = [...decimals].sort((a, b) => a - b);
  const correctOrder = sorted.join(', ');
  
  // Generate wrong orders
  const wrongOrders = [
    [...decimals].sort((a, b) => b - a).join(', '),
    shuffle([...decimals]).join(', '),
    shuffle([...decimals]).join(', '),
  ];
  
  const options = shuffle([correctOrder, ...wrongOrders]);
  const correctIndex = options.indexOf(correctOrder);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'ordering',
    mode,
    difficulty: 'intermediate',
    questionText: `Which set of decimals is ordered from lowest to highest?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `The correct order from lowest to highest is: ${correctOrder}`,
    category: 'number-algebra',
  };
};

// Fraction Questions
export const generateFractionQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'conversion' : 'comparison';
  
  if (type === 'conversion') {
    const whole = Math.floor(Math.random() * 5) + 1;
    const num = Math.floor(Math.random() * 5) + 1;
    const den = [3, 4, 5, 8][Math.floor(Math.random() * 4)];
    
    const improperNum = whole * den + num;
    const correctAnswer = `${improperNum}/${den}`;
    
    const distractors = [
      `${whole * num}/${den}`,
      `${whole + num}/${den}`,
      `${improperNum}/${num}`,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'fractions',
      mode,
      difficulty: 'intermediate',
      questionText: `Which fraction has the same value as ${whole} ${num}/${den}?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `${whole} ${num}/${den} = (${whole} × ${den} + ${num})/${den} = ${improperNum}/${den}`,
      category: 'number-algebra',
    };
  } else {
    // Find fraction halfway between two fractions
    const base = Math.floor(Math.random() * 3) + 2;
    const a = Math.floor(Math.random() * (base - 1)) + 1;
    const b = a + 1;
    
    const correctNum = a + b;
    const correctDen = base * 2;
    
    // Simplify if possible
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    const g = gcd(correctNum, correctDen);
    const simplifiedNum = correctNum / g;
    const simplifiedDen = correctDen / g;
    
    const correctAnswer = `${simplifiedNum}/${simplifiedDen}`;
    
    return {
      id: uuidv4(),
      type: 'fractions',
      mode,
      difficulty: 'advanced',
      questionText: `What fraction is halfway between ${a}/${base} and ${b}/${base}?`,
      answerFormat: 'numeric',
      correctAnswer,
      workedSolution: `Halfway between ${a}/${base} and ${b}/${base} is (${a}/${base} + ${b}/${base}) ÷ 2 = ${a + b}/${base * 2} = ${correctAnswer}`,
      category: 'number-algebra',
    };
  }
};

// Algebra/Equation Questions
export const generateAlgebraQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'simple' : 'pattern';
  
  if (type === 'simple') {
    const h = Math.floor(Math.random() * 8) + 2;
    const d = Math.floor(Math.random() * 8) + 2;
    const s = d + d - h;
    
    const correctAnswer = s;
    const distractors = generateDistractors(s, 3);
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'algebra',
      mode,
      difficulty: 'basic',
      questionText: `h = ${h} and d = ${d}. If h + s = d + d, what number does s represent?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `h + s = d + d means ${h} + s = ${d} + ${d} = ${d * 2}. So s = ${d * 2} - ${h} = ${correctAnswer}.`,
      category: 'number-algebra',
    };
  } else {
    // Pattern rule
    const subtract = Math.floor(Math.random() * 10) + 1;
    
    const hValues = [2, 3, 5, 8];
    const nValues = hValues.map(h => h * h - subtract);
    
    const correctAnswer = `n = h × h - ${subtract}`;
    const distractors = [
      `n = 5 × h - ${subtract + 5}`,
      `n = 3 × h - ${subtract}`,
      `n = h × h + ${subtract}`,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'patterns',
      mode,
      difficulty: 'advanced',
      questionText: `h and n stand for numbers that are related by a rule.\n\nh: ${hValues.join(', ')}\nn: ${nValues.join(', ')}\n\nWhat is the rule?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `Looking at the pattern: when h = ${hValues[0]}, n = ${nValues[0]}; when h = ${hValues[1]}, n = ${nValues[1]}. The rule is ${correctAnswer}.`,
      category: 'number-algebra',
    };
  }
};

// Pattern/Sequence Questions
export const generatePatternQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'arithmetic' : 'geometric';
  
  if (type === 'arithmetic') {
    const start = Math.floor(Math.random() * 20) + 10;
    const diff = Math.floor(Math.random() * 8) + 3;
    const sequence = [start, start + diff, start + diff * 2, start + diff * 3];
    const nextTerm = start + diff * 4;
    
    return {
      id: uuidv4(),
      type: 'patterns',
      mode,
      difficulty: 'intermediate',
      questionText: `What is the next number in this pattern?\n${sequence.join(', ')}, ______`,
      answerFormat: 'numeric',
      correctAnswer: nextTerm,
      workedSolution: `The pattern increases by ${diff} each time. ${sequence[3]} + ${diff} = ${nextTerm}.`,
      category: 'number-algebra',
    };
  } else {
    // Matchstick pattern
    const startMatches = Math.floor(Math.random() * 4) + 3;
    const addMatches = Math.floor(Math.random() * 4) + 4;
    
    const shape1 = startMatches;
    const shape2 = startMatches + addMatches;
    const shape3 = startMatches + addMatches * 2;
    const shape4 = startMatches + addMatches * 3;
    const shape5 = startMatches + addMatches * 4;
    
    return {
      id: uuidv4(),
      type: 'patterns',
      mode,
      difficulty: 'intermediate',
      questionText: `A pattern is made with matches.\nShape 1: ${shape1} matches\nShape 2: ${shape2} matches\nShape 3: ${shape3} matches\nShape 4: ${shape4} matches\n\nHow many matches will be needed for Shape 5?`,
      answerFormat: 'numeric',
      correctAnswer: shape5,
      workedSolution: `The pattern adds ${addMatches} matches each time. Shape 4 has ${shape4} matches, so Shape 5 needs ${shape4} + ${addMatches} = ${shape5} matches.`,
      category: 'number-algebra',
    };
  }
};

// Equation solving
export const generateEquationQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'missing-number' : 'think-of-number';
  
  if (type === 'missing-number') {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    const c = Math.floor(Math.random() * 8) + 2;
    
    // a × h = b × c, find h
    const product = b * c;
    const h = product / a;
    
    return {
      id: uuidv4(),
      type: 'equations',
      mode,
      difficulty: 'basic',
      questionText: `${a} × h = ${b} × ${c}\n\nWhat is the missing number?`,
      answerFormat: 'numeric',
      correctAnswer: h,
      workedSolution: `${b} × ${c} = ${product}. So ${a} × h = ${product}, which means h = ${product} ÷ ${a} = ${h}.`,
      category: 'number-algebra',
    };
  } else {
    // Think of a number
    const multiplier = Math.floor(Math.random() * 4) + 2;
    const addend = Math.floor(Math.random() * 10) + 1;
    const result = Math.floor(Math.random() * 50) + 20;
    const original = (result - addend) / multiplier;
    
    return {
      id: uuidv4(),
      type: 'equations',
      mode,
      difficulty: 'intermediate',
      questionText: `A positive number is multiplied by ${multiplier} and then ${addend} is added. The answer is ${result}.\n\nWhat is the number?`,
      answerFormat: 'numeric',
      correctAnswer: original,
      workedSolution: `Working backwards: ${result} - ${addend} = ${result - addend}. Then ${result - addend} ÷ ${multiplier} = ${original}.`,
      category: 'number-algebra',
    };
  }
};

// Ratio Questions
export const generateRatioQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const a = Math.floor(Math.random() * 5) + 2;
  const b = Math.floor(Math.random() * 5) + 2;
  const multiplier = Math.floor(Math.random() * 5) + 2;
  
  const total = (a + b) * multiplier;
  const extraA = Math.floor(Math.random() * 10) + 5;
  const extraB = Math.floor(Math.random() * 10) + 5;
  
  const newA = a * multiplier + extraA;
  const newB = b * multiplier + extraB;
  
  // Simplify ratio
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const g = gcd(newA, newB);
  const simpA = newA / g;
  const simpB = newB / g;
  
  const correctAnswer = `${simpA} to ${simpB}`;
  const distractors = [
    `${a} to ${b}`,
    `${newA} to ${newB}`,
    `${simpA + 1} to ${simpB}`,
  ];
  
  const options = shuffle([correctAnswer, ...distractors]);
  const correctIndex = options.indexOf(correctAnswer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'ratio',
    mode,
    difficulty: 'advanced',
    questionText: `The ratio of men to women at a conference was ${a} to ${b}. There were ${total} people at the conference. Later, ${extraA} more men and ${extraB} more women joined.\n\nWhat is the ratio of men to women now?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Originally: ${a * multiplier} men and ${b * multiplier} women. After: ${newA} men and ${newB} women. Ratio = ${newA}:${newB} = ${correctAnswer}.`,
    category: 'number-algebra',
  };
};

// Mean/Average Questions
export const generateMeanQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const count = Math.floor(Math.random() * 4) + 4;
  const mean = Math.floor(Math.random() * 10) + 5;
  const newMean = mean + Math.floor(Math.random() * 5) + 1;
  
  const total = count * mean;
  const newTotal = (count + 1) * newMean;
  const addedNumber = newTotal - total;
  
  const distractors = generateDistractors(addedNumber, 3);
  const options = shuffle([addedNumber, ...distractors]);
  const correctIndex = options.indexOf(addedNumber);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'mean',
    mode,
    difficulty: 'intermediate',
    questionText: `The average (mean) of ${count} numbers is ${mean}. When one more number is included, the average changes to ${newMean}.\n\nWhat number was added?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Total of ${count} numbers = ${count} × ${mean} = ${total}. New total = ${count + 1} × ${newMean} = ${newTotal}. Added number = ${newTotal} - ${total} = ${addedNumber}.`,
    category: 'number-algebra',
  };
};

// Mixed Number Questions
export const generateMixedNumberQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const whole1 = Math.floor(Math.random() * 5) + 1;
  const num1 = Math.floor(Math.random() * 3) + 1;
  const den1 = 4;
  
  const whole2 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 3) + 1;
  const den2 = 4;
  
  // Convert to improper fractions, find halfway
  const improper1 = whole1 * den1 + num1;
  const improper2 = whole2 * den2 + num2;
  
  // Find common denominator
  const lcm = den1 * den2;
  const conv1 = improper1 * den2;
  const conv2 = improper2 * den1;
  
  const halfway = (conv1 + conv2) / 2;
  const resultWhole = Math.floor(halfway / lcm);
  const resultNum = halfway % lcm;
  
  // Simplify
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(resultNum, lcm);
  
  const finalNum = resultNum / g;
  const finalDen = lcm / g;
  
  const correctAnswer = resultWhole > 0 
    ? `${resultWhole} ${finalNum}/${finalDen}` 
    : `${finalNum}/${finalDen}`;
  
  const distractors = [
    `${whole1 + whole2} ${num1 + num2}/${den1 + den2}`,
    `${Math.floor((whole1 + whole2) / 2)} 1/2`,
    `${whole1} ${num1}/${den1}`,
  ];
  
  const options = shuffle([correctAnswer, ...distractors]);
  const correctIndex = options.indexOf(correctAnswer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'mixed-numbers',
    mode,
    difficulty: 'advanced',
    questionText: `What number is halfway between ${whole1} ${num1}/${den1} and ${whole2} ${num2}/${den2}?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Convert to improper fractions: ${improper1}/${den1} and ${improper2}/${den2}. Halfway = (${improper1}/${den1} + ${improper2}/${den2}) ÷ 2 = ${correctAnswer}.`,
    category: 'number-algebra',
  };
};

// Percentage Questions
export const generatePercentageQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const original = Math.floor(Math.random() * 10000) + 5000;
  const newVal = original + Math.floor(Math.random() * 5000) + 1000;
  const increase = newVal - original;
  const percentage = Math.round((increase / original) * 100);
  
  const distractors = generateDistractors(percentage, 3);
  const options = shuffle([percentage, ...distractors]);
  const correctIndex = options.indexOf(percentage);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'algebra',
    mode,
    difficulty: 'intermediate',
    questionText: `This year the tax bill was $${original.toLocaleString()}. Last year it was $${newVal.toLocaleString()}.\n\nWhat percentage increase is this?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}%`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Increase = $${newVal} - $${original} = $${increase}. Percentage increase = (${increase}/${original}) × 100 = ${percentage}%.`,
    category: 'number-algebra',
  };
};
