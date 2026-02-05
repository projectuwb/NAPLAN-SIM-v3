import type { Question, TestMode } from '@/types';
import { uuidv4 } from '@/lib/utils';

// Generate a fresh random integer
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create fresh distractors array each time
function makeDistractors(correct: number, count: number = 3): number[] {
  const d = new Set<number>();
  const variations = [
    correct + 1, correct - 1,
    correct + 10, correct - 10,
    correct * 2, Math.floor(correct / 2),
    correct + 100, correct - 100,
  ];
  
  for (const v of variations) {
    if (v !== correct && v >= 0 && d.size < count) {
      d.add(v);
    }
  }
  
  // Fill with more variations if needed
  while (d.size < count) {
    const v = correct + randInt(-50, 50);
    if (v !== correct && v >= 0) d.add(v);
  }
  
  return Array.from(d).slice(0, count);
}

// Shuffle array - creates fresh copy every time
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ===== NUMBER & ALGEBRA QUESTIONS =====

function placeValue(): Question {
  const thousands = randInt(10, 99);
  const hundreds = randInt(0, 9);
  const tens = randInt(0, 9);
  const ones = randInt(0, 9);
  const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  
  const words: string[] = [];
  if (thousands > 0) words.push(`${thousands} thousand`);
  if (hundreds > 0) words.push(`${['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][hundreds]} hundred`);
  
  if (tens > 0 || ones > 0) {
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (tens === 1) {
      words.push(teens[ones]);
    } else {
      const t = tensWords[tens] || '';
      const o = ones > 0 ? ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][ones] : '';
      if (t || o) words.push(`${t}${t && o ? ' ' : ''}${o}`);
    }
  }
  
  const wordForm = words.join(' and ').replace(' and ', ' ');
  const correct = number.toLocaleString('en-US').replace(/,/g, ' ');
  const distractors = makeDistractors(number, 3).map(n => n.toLocaleString('en-US').replace(/,/g, ' '));
  const options = shuffleArray([correct, ...distractors]);
  const correctIndex = options.indexOf(correct);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'place-value',
    mode: 'non-calculator',
    questionText: `Which number is ${wordForm}?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `The number ${wordForm} is written as ${correct}.`,
    category: 'number-algebra',
  };
}

function decimals(): Question {
  const divisor = [0.2, 0.5, 0.25, 0.1][randInt(0, 3)];
  const quotient = randInt(5, 25);
  const dividend = parseFloat((divisor * quotient).toFixed(2));
  
  const distractors = makeDistractors(quotient, 3);
  const options = shuffleArray([quotient, ...distractors]);
  const correctIndex = options.indexOf(quotient);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'decimals',
    mode: 'non-calculator',
    questionText: `What is ${dividend} ÷ ${divisor}?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `${dividend} ÷ ${divisor} = ${quotient}`,
    category: 'number-algebra',
  };
}

function fractions(): Question {
  const whole = randInt(1, 5);
  const num = randInt(1, 5);
  const den = [3, 4, 5, 8][randInt(0, 3)];
  const improper = whole * den + num;
  
  const correct = `${improper}/${den}`;
  const distractors = [`${whole * num}/${den}`, `${whole + num}/${den}`, `${improper}/${num}`];
  const options = shuffleArray([correct, ...distractors]);
  const correctIndex = options.indexOf(correct);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'fractions',
    mode: 'non-calculator',
    questionText: `Which fraction equals ${whole} ${num}/${den}?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `${whole} ${num}/${den} = (${whole} × ${den} + ${num})/${den} = ${correct}`,
    category: 'number-algebra',
  };
}

function patterns(): Question {
  const start = randInt(10, 30);
  const diff = randInt(3, 10);
  const seq = [start, start + diff, start + diff * 2, start + diff * 3];
  const next = start + diff * 4;
  
  return {
    id: uuidv4(),
    type: 'patterns',
    mode: 'non-calculator',
    questionText: `What is the next number?\n${seq.join(', ')}, ______`,
    answerFormat: 'numeric',
    correctAnswer: next.toString(),
    workedSolution: `The pattern increases by ${diff} each time. ${seq[3]} + ${diff} = ${next}.`,
    category: 'number-algebra',
  };
}

function equations(): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const product = b * c;
  const h = product / a;
  
  return {
    id: uuidv4(),
    type: 'equations',
    mode: 'non-calculator',
    questionText: `${a} × h = ${b} × ${c}\nWhat is h?`,
    answerFormat: 'numeric',
    correctAnswer: h.toString(),
    workedSolution: `${b} × ${c} = ${product}, so h = ${product} ÷ ${a} = ${h}.`,
    category: 'number-algebra',
  };
}

function ratio(): Question {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const mult = randInt(2, 5);
  const total = (a + b) * mult;
  const extraA = randInt(5, 15);
  const extraB = randInt(5, 15);
  const newA = a * mult + extraA;
  const newB = b * mult + extraB;
  
  // Simplify ratio
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const g = gcd(newA, newB);
  const correct = `${newA / g} to ${newB / g}`;
  const distractors = [`${a} to ${b}`, `${newA} to ${newB}`, `${newA + 1} to ${newB}`];
  const options = shuffleArray([correct, ...distractors]);
  const correctIndex = options.indexOf(correct);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'ratio',
    mode: 'calculator',
    questionText: `The ratio of men to women was ${a} to ${b}. There were ${total} people. Then ${extraA} more men and ${extraB} more women joined. What is the new ratio?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `Originally: ${a * mult} men, ${b * mult} women. After: ${newA} men, ${newB} women. Ratio = ${correct}.`,
    category: 'number-algebra',
  };
}

function mean(): Question {
  const count = randInt(4, 8);
  const meanVal = randInt(5, 15);
  const newMean = meanVal + randInt(1, 5);
  const total = count * meanVal;
  const newTotal = (count + 1) * newMean;
  const added = newTotal - total;
  
  const distractors = makeDistractors(added, 3);
  const options = shuffleArray([added, ...distractors]);
  const correctIndex = options.indexOf(added);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'mean',
    mode: 'calculator',
    questionText: `The mean of ${count} numbers is ${meanVal}. After adding one more number, the mean becomes ${newMean}. What number was added?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `Total was ${total}, now ${newTotal}. Added number = ${newTotal} - ${total} = ${added}.`,
    category: 'number-algebra',
  };
}

// ===== MEASUREMENT & GEOMETRY =====

function perimeter(): Question {
  const w = randInt(8, 15);
  const h = randInt(6, 12);
  const p = 2 * (w + h);
  
  const distractors = makeDistractors(p, 3);
  const options = shuffleArray([p, ...distractors]);
  const correctIndex = options.indexOf(p);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'perimeter',
    mode: 'non-calculator',
    questionText: `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o} cm`),
    correctAnswer: labels[correctIndex],
    workedSolution: `Perimeter = 2 × (${w} + ${h}) = 2 × ${w + h} = ${p} cm.`,
    category: 'measurement-geometry',
  };
}

function area(): Question {
  const base = [6, 8, 10, 12][randInt(0, 3)];
  const height = [6, 8, 10, 12][randInt(0, 3)];
  const area = (base * height) / 2;
  
  return {
    id: uuidv4(),
    type: 'area',
    mode: 'non-calculator',
    questionText: `A triangle has base ${base} m and height ${height} m. What is its area?`,
    answerFormat: 'numeric',
    correctAnswer: area.toString(),
    workedSolution: `Area = ½ × ${base} × ${height} = ${area} square metres.`,
    category: 'measurement-geometry',
  };
}

function volume(): Question {
  const l = randInt(3, 8);
  const w = randInt(2, 6);
  const vol = randInt(50, 150);
  const h = vol / (l * w);
  
  return {
    id: uuidv4(),
    type: 'volume',
    mode: 'calculator',
    questionText: `A rectangular prism has volume ${vol} cubic metres. It is ${l} m long and ${w} m wide. How high is it?`,
    answerFormat: 'numeric',
    correctAnswer: h.toFixed(2),
    workedSolution: `Height = ${vol} ÷ (${l} × ${w}) = ${vol} ÷ ${l * w} = ${h.toFixed(2)} m.`,
    category: 'measurement-geometry',
  };
}

function time(): Question {
  const startH = randInt(6, 12);
  const startM = [0, 15, 30, 45][randInt(0, 3)];
  const durH = randInt(1, 4);
  const durM = [15, 30, 45][randInt(0, 2)];
  
  const endH = startH + durH + Math.floor((startM + durM) / 60);
  const endM = (startM + durM) % 60;
  const ampm = endH < 12 ? 'am' : 'pm';
  const displayH = endH > 12 ? endH - 12 : endH;
  
  const distractors = [
    `${durH} h ${durM + 10} min`,
    `${durH + 1} h ${durM} min`,
    `${durH} h ${durM - 10} min`,
  ];
  const correct = `${durH} h ${durM} min`;
  const options = shuffleArray([correct, ...distractors]);
  const correctIndex = options.indexOf(correct);
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'time',
    mode: 'non-calculator',
    questionText: `How long from ${startH}:${startM.toString().padStart(2, '0')} to ${displayH}:${endM.toString().padStart(2, '0')} ${ampm}?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `From ${startH}:${startM.toString().padStart(2, '0')} to ${displayH}:${endM.toString().padStart(2, '0')} is ${durH} hours and ${durM} minutes.`,
    category: 'measurement-geometry',
  };
}

function speed(): Question {
  const dist = randInt(10, 50);
  const time = randInt(2, 8);
  const speed = dist / time;
  
  const distractors = makeDistractors(Math.floor(speed), 3);
  const options = shuffleArray([Math.floor(speed), ...distractors]);
  const correctIndex = options.indexOf(Math.floor(speed));
  const labels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'speed',
    mode: 'non-calculator',
    questionText: `A car travels ${dist} km in ${time} hours. What is its average speed?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o} km/h`),
    correctAnswer: labels[correctIndex],
    workedSolution: `Speed = ${dist} ÷ ${time} = ${speed.toFixed(1)} km/h.`,
    category: 'measurement-geometry',
  };
}

// ===== STATISTICS & PROBABILITY =====

function probability(): Question {
  const colors = ['yellow', 'blue', 'green'];
  const counts = [randInt(2, 8), randInt(2, 8), randInt(2, 8)];
  const target = randInt(0, 2);
  const total = counts[0] + counts[1] + counts[2];
  
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(counts[target], total);
  const correct = `${counts[target] / g}/${total / g}`;
  const distractors = [`${counts[target]}/${total}`, `${counts[target] + 1}/${total}`, `${counts[target]}/${total + 1}`];
  const options = shuffleArray([correct, ...distractors]);
  const correctIndex = options.indexOf(correct);
  const labels = ['A', 'B', 'C', 'D'];
  
  const desc = colors.map((c, i) => `${counts[i]} ${c}`).join(', ');
  
  return {
    id: uuidv4(),
    type: 'probability',
    mode: 'non-calculator',
    questionText: `A bucket has ${desc} balls. What is the probability of picking ${colors[target]}?`,
    answerFormat: 'multiple-choice',
    options: options.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
    workedSolution: `Total = ${total}, ${colors[target]} = ${counts[target]}. Probability = ${counts[target]}/${total} = ${correct}.`,
    category: 'statistics-probability',
  };
}

function statistics(): Question {
  const ages = [11, 12, 13, 14];
  const counts = [randInt(5, 20), randInt(5, 20), randInt(5, 20), randInt(5, 20)];
  const total = counts.reduce((a, b) => a + b, 0);
  const target = randInt(0, 3);
  const percent = Math.round((counts[target] / total) * 100);
  
  return {
    id: uuidv4(),
    type: 'statistics',
    mode: 'calculator',
    questionText: `Student ages:\nAge 11: ${counts[0]} students\nAge 12: ${counts[1]} students\nAge 13: ${counts[2]} students\nAge 14: ${counts[3]} students\n\nWhat percentage are age ${ages[target]}?`,
    answerFormat: 'numeric',
    correctAnswer: percent.toString(),
    workedSolution: `Percentage = (${counts[target]}/${total}) × 100 = ${percent}%.`,
    category: 'statistics-probability',
  };
}

// ===== QUESTION REGISTRY =====

const nonCalcGenerators = [
  placeValue, decimals, fractions, patterns, equations,
  perimeter, area, time, speed, probability,
];

const calcGenerators = [
  ...nonCalcGenerators, ratio, mean, volume, statistics,
];

// Generate a complete test
export function generateTest(mode: TestMode, count: number = 32): Question[] {
  const generators = mode === 'non-calculator' ? nonCalcGenerators : calcGenerators;
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const gen = generators[Math.floor(Math.random() * generators.length)];
    questions.push(gen());
  }
  
  return questions;
}
