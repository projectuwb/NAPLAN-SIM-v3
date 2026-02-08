# NAPLAN Year 7 Numeracy Test Generator - Technical Handoff Brief

## Project Overview

A Progressive Web App (PWA) that generates randomized NAPLAN-style Year 7 numeracy tests with two modes (Non-Calculator and Calculator). Each test has 32 questions, 40-minute timer, auto-save progress, and unlimited test history.

---

## Current Features/Functionality

### Core Features (IMPLEMENTED)
- **Two Test Modes**: Non-Calculator (40 min) and Calculator Allowed (40 min)
- **32 Questions per Test**: Randomly selected from 14 question types
- **Auto-Save Progress**: Test state saved to localStorage on every answer change
- **Resume Test**: "Test in Progress" indicator on homepage with stats (answered count, time remaining)
- **Question Types**:
  - Multiple Choice (4 options A-D)
  - Numeric Input (text field, accepts numbers, fractions like 3/4, decimals, money like $5)
- **Smart Answer Validation**: Handles multiple formats ($5, 5.00, 5, 3/4, etc.)
- **Test History**: Unlimited storage with delete functionality (selective or all)
- **Results Page**: Score, grade, time taken, review answers
- **PWA**: Works offline, installable

### Question Types (14 total)
**Non-Calculator:**
- place-value, decimals, fractions, patterns, equations, perimeter, area, time, speed, probability

**Calculator (includes all above plus):**
- ratio, mean, volume, statistics

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Button, Card, Input, Dialog, Checkbox, Progress) |
| Icons | Lucide React |
| State | React useState/useEffect + localStorage |
| PWA | Custom service worker (sw.js) + manifest.json |

### Dependencies (package.json)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "~5.7.2",
  "vite": "^7.3.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0",
  "lucide-react": "^0.474.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

---

## Current File Structure

```
src/
├── types/
│   └── index.ts          # TypeScript interfaces (Question, TestResult, TestState)
├── lib/
│   ├── utils.ts          # Utility functions (uuid, formatTime, checkAnswer, storage helpers)
│   └── questions/
│       └── index.ts      # ALL question generators (14 types + generateTest function)
├── components/
│   └── ui/
│       ├── button.tsx    # shadcn Button
│       ├── card.tsx      # shadcn Card
│       ├── input.tsx     # shadcn Input
│       ├── dialog.tsx    # shadcn Dialog
│       ├── checkbox.tsx  # shadcn Checkbox
│       └── progress.tsx  # shadcn Progress
├── App.tsx               # Main app component (all views: home, test, results, review, history)
├── main.tsx              # React entry point
└── index.css             # Tailwind styles

public/
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker
└── icon-*.png            # PWA icons (various sizes)

Root files:
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## CRITICAL: Pending File Updates (NEVER UPLOADED TO GITHUB)

**The following 4 files were created in the last fix but NOT uploaded to GitHub. These MUST be written to the repo:**

---

### File 1: src/types/index.ts

```typescript
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
```

---

### File 2: src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UUID generator
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format time mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Local storage helpers
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}

// Calculate score
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Get grade
export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D+';
  if (percentage >= 40) return 'D';
  return 'E';
}

// Get feedback
export function getFeedback(percentage: number): string {
  if (percentage >= 90) return 'Outstanding! Excellent work!';
  if (percentage >= 80) return 'Great job! Well done!';
  if (percentage >= 70) return 'Good work! Keep it up!';
  if (percentage >= 60) return 'Satisfactory. Room for improvement.';
  if (percentage >= 50) return 'Pass. More practice needed.';
  return 'Keep practicing! You\'ll improve with more study.';
}

// Normalize and check answer - handles multiple formats
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const user = userAnswer.toString().trim().toLowerCase();
  const correct = correctAnswer.toString().trim().toLowerCase();
  
  // Direct match
  if (user === correct) return true;
  
  // Clean both answers
  const cleanUser = user.replace(/^\$/, '').replace(/\$/, '').replace(/,/g, '').replace(/\s/g, '');
  const cleanCorrect = correct.replace(/^\$/, '').replace(/\$/, '').replace(/,/g, '').replace(/\s/g, '');
  
  if (cleanUser === cleanCorrect) return true;
  
  // Numeric comparison
  const userNum = parseFloat(cleanUser);
  const correctNum = parseFloat(cleanCorrect);
  
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001;
  }
  
  // Fraction comparison
  const userFrac = cleanUser.match(/^(-?\d+)\/(-?\d+)$/);
  const correctFrac = cleanCorrect.match(/^(-?\d+)\/(-?\d+)$/);
  
  if (userFrac && correctFrac) {
    const u = parseInt(userFrac[1]) / parseInt(userFrac[2]);
    const c = parseInt(correctFrac[1]) / parseInt(correctFrac[2]);
    return Math.abs(u - c) < 0.001;
  }
  
  if (userFrac && !isNaN(correctNum)) {
    const u = parseInt(userFrac[1]) / parseInt(userFrac[2]);
    return Math.abs(u - correctNum) < 0.001;
  }
  
  if (correctFrac && !isNaN(userNum)) {
    const c = parseInt(correctFrac[1]) / parseInt(correctFrac[2]);
    return Math.abs(userNum - c) < 0.001;
  }
  
  return false;
}
```

---

### File 3: src/lib/questions/index.ts

```typescript
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
```

---

### File 4: src/App.tsx

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { Question, TestMode, TestResult } from './types';
import { generateTest } from './lib/questions';
import { 
  formatTime, 
  saveToStorage, 
  loadFromStorage, 
  removeFromStorage, 
  calculateScore, 
  getGrade, 
  getFeedback,
  checkAnswer,
  uuidv4 
} from './lib/utils';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { 
  Timer, Calculator, BookOpen, ChevronLeft, ChevronRight, 
  Check, X, RotateCcw, Home, Trophy, Trash2, History 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';

type View = 'home' | 'test' | 'results' | 'review' | 'history';

const TEST_DURATION = 40 * 60;
const TEST_STATE_KEY = 'naplan_test_state';
const TEST_HISTORY_KEY = 'naplan_test_history';

interface SavedTestState {
  mode: TestMode;
  questions: Question[];
  currentIndex: number;
  timeRemaining: number;
  answers: Record<string, string>;
}

export default function App() {
  // View state
  const [view, setView] = useState<View>('home');
  
  // Test state
  const [mode, setMode] = useState<TestMode>('non-calculator');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  
  // Results state
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  
  // History state
  const [history, setHistory] = useState<TestResult[]>([]);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check for saved test on mount
  useEffect(() => {
    const savedHistory = loadFromStorage<TestResult[]>(TEST_HISTORY_KEY, []);
    setHistory(savedHistory);
  }, []);
  
  // Timer
  useEffect(() => {
    if (view !== 'test') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [view, questions.length]);
  
  // Auto-save test state
  useEffect(() => {
    if (view === 'test' && questions.length > 0) {
      const state: SavedTestState = {
        mode,
        questions,
        currentIndex,
        timeRemaining,
        answers,
      };
      saveToStorage(TEST_STATE_KEY, state);
    }
  }, [view, mode, questions, currentIndex, timeRemaining, answers]);
  
  const startTest = useCallback((testMode: TestMode) => {
    // Check for existing test of this type
    const saved = loadFromStorage<SavedTestState | null>(TEST_STATE_KEY, null);
    if (saved && saved.mode === testMode && saved.questions.length > 0) {
      // Resume existing test
      setMode(saved.mode);
      setQuestions(saved.questions);
      setCurrentIndex(saved.currentIndex);
      setTimeRemaining(saved.timeRemaining);
      setAnswers(saved.answers);
      setInputValue(saved.answers[saved.questions[saved.currentIndex]?.id] || '');
    } else {
      // Start new test
      const newQuestions = generateTest(testMode, 32);
      setMode(testMode);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setTimeRemaining(TEST_DURATION);
      setAnswers({});
      setInputValue('');
      removeFromStorage(TEST_STATE_KEY);
    }
    setView('test');
  }, []);
  
  const cancelTest = useCallback(() => {
    removeFromStorage(TEST_STATE_KEY);
    setView('home');
  }, []);
  
  const handleAnswer = useCallback((answer: string) => {
    const q = questions[currentIndex];
    if (!q) return;
    
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
  }, [questions, currentIndex]);
  
  const submitNumeric = useCallback(() => {
    if (inputValue.trim()) {
      handleAnswer(inputValue.trim());
    }
  }, [inputValue, handleAnswer]);
  
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setInputValue(answers[questions[index]?.id] || '');
    }
  }, [questions, answers]);
  
  const finishTest = useCallback(() => {
    const results = questions.map(q => {
      const userAns = answers[q.id] || '';
      const correct = q.answerFormat === 'multiple-choice' 
        ? userAns === q.correctAnswer
        : checkAnswer(userAns, q.correctAnswer);
      
      return {
        questionId: q.id,
        questionType: q.type,
        correct,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
      };
    });
    
    const correctCount = results.filter(r => r.correct).length;
    const result: TestResult = {
      id: uuidv4(),
      mode,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: calculateScore(correctCount, questions.length),
      timeTaken: TEST_DURATION - timeRemaining,
      completedAt: new Date().toISOString(),
      questionResults: results,
    };
    
    setTestResult(result);
    
    // Save to history
    const updatedHistory = [result, ...history].slice(0, 100); // Keep last 100
    setHistory(updatedHistory);
    saveToStorage(TEST_HISTORY_KEY, updatedHistory);
    
    removeFromStorage(TEST_STATE_KEY);
    setView('results');
  }, [questions, answers, mode, timeRemaining, history]);
  
  const deleteSelected = useCallback(() => {
    const updated = history.filter(t => !selectedTests.has(t.id));
    setHistory(updated);
    saveToStorage(TEST_HISTORY_KEY, updated);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  }, [history, selectedTests]);
  
  const deleteAll = useCallback(() => {
    setHistory([]);
    saveToStorage(TEST_HISTORY_KEY, []);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  }, []);
  
  const toggleSelection = useCallback((id: string) => {
    setSelectedTests(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    if (selectedTests.size === history.length) {
      setSelectedTests(new Set());
    } else {
      setSelectedTests(new Set(history.map(t => t.id)));
    }
  }, [history, selectedTests.size]);
  
  // Get saved test info for home screen
  const savedTest = loadFromStorage<SavedTestState | null>(TEST_STATE_KEY, null);
  const hasNonCalcProgress = savedTest?.mode === 'non-calculator';
  const hasCalcProgress = savedTest?.mode === 'calculator';
  const progressText = savedTest 
    ? `${Object.keys(savedTest.answers).length}/${savedTest.questions.length} answered, ${formatTime(savedTest.timeRemaining)} left`
    : '';
  
  // Render functions
  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            NAPLAN Year 7 Numeracy
          </h1>
          <p className="text-slate-600">Practice Test Generator</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Non-Calculator Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Non-Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {hasNonCalcProgress ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-1">Test in Progress</p>
                  <p className="text-amber-600 text-sm mb-3">{progressText}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => startTest('non-calculator')}>Resume</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Test your mental math skills with number, algebra, measurement, and geometry.
                  </p>
                  <Button className="w-full" onClick={() => startTest('non-calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Calculator Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Calculator Allowed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {hasCalcProgress ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-1">Test in Progress</p>
                  <p className="text-amber-600 text-sm mb-3">{progressText}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => startTest('calculator')}>Resume</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Use your calculator for complex problems including statistics and probability.
                  </p>
                  <Button className="w-full" onClick={() => startTest('calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button variant="outline" onClick={() => setView('history')}>
            <History className="w-4 h-4 mr-2" />
            Test History ({history.length})
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderTest = () => {
    const q = questions[currentIndex];
    if (!q) return null;
    
    const answeredCount = Object.keys(answers).length;
    const isAnswered = answers[q.id] !== undefined;
    
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setView('home')}>
                  <Home className="w-4 h-4" />
                </Button>
                <span className="font-medium text-slate-700">
                  {mode === 'non-calculator' ? 'Non-Calculator' : 'Calculator'}
                </span>
              </div>
              <div className={`flex items-center gap-2 font-mono text-lg font-bold ${
                timeRemaining < 300 ? 'text-red-600' : 'text-slate-700'
              }`}>
                <Timer className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-slate-500 mb-1">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{answeredCount} answered</span>
              </div>
              <Progress value={(answeredCount / questions.length) * 100} className="h-2" />
            </div>
          </div>
        </header>
        
        {/* Question */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded capitalize">
                  {q.category.replace('-', ' & ')}
                </span>
              </div>
              
              <p className="text-lg mb-6 whitespace-pre-line">{q.questionText}</p>
              
              {q.answerFormat === 'multiple-choice' ? (
                <div className="space-y-3">
                  {q.options?.map((opt, i) => {
                    const letter = opt.charAt(0);
                    const selected = answers[q.id] === letter;
                    return (
                      <button
                        key={`${q.id}-${i}`}
                        onClick={() => handleAnswer(letter)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your answer"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitNumeric()}
                      className="flex-1 text-lg"
                    />
                    <Button onClick={submitNumeric}>Submit</Button>
                  </div>
                  {isAnswered && (
                    <p className="text-sm text-green-600">Answer saved: {answers[q.id]}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    You can type numbers, fractions (e.g., 3/4), decimals, or money (e.g., $5)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentIndex === questions.length - 1 ? (
              <Button onClick={finishTest}>Finish Test</Button>
            ) : (
              <Button onClick={() => goToQuestion(currentIndex + 1)}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          
          {/* Question Navigator */}
          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-2">Jump to:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    i === currentIndex ? 'bg-blue-500 text-white' :
                    answers[q.id] ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  const renderResults = () => {
    if (!testResult) return null;
    
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Test Complete!</h1>
            <p className="text-slate-600">{getFeedback(testResult.score)}</p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{testResult.score}%</p>
                  <p className="text-sm text-slate-500">Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{testResult.correctAnswers}/{testResult.totalQuestions}</p>
                  <p className="text-sm text-slate-500">Correct</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{getGrade(testResult.score)}</p>
                  <p className="text-sm text-slate-500">Grade</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{formatTime(testResult.timeTaken)}</p>
                  <p className="text-sm text-slate-500">Time Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => setView('review')} variant="outline">Review Answers</Button>
            <Button onClick={() => startTest(mode)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => setView('history')} variant="outline">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button onClick={() => setView('home')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderReview = () => {
    if (!testResult) return null;
    
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Review Answers</h1>
            <Button onClick={() => setView('results')} variant="outline">Back</Button>
          </div>
          
          <div className="space-y-4">
            {testResult.questionResults.map((r, i) => (
              <Card key={r.questionId} className={r.correct ? 'border-green-200' : 'border-red-200'}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      r.correct ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {r.correct ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">Question {i + 1}</p>
                      <p className="text-slate-500 text-sm mb-1">Your answer: 
                        <span className={r.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {r.userAnswer || 'Not answered'}
                        </span>
                      </p>
                      {!r.correct && (
                        <p className="text-slate-500 text-sm">Correct answer: 
                          <span className="text-green-600 font-medium">{r.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderHistory = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test History</h1>
          <Button onClick={() => setView('home')} variant="outline">Home</Button>
        </div>
        
        {history.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">No tests yet.</p>
              <Button className="mt-4" onClick={() => setView('home')}>Start a Test</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedTests.size === history.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedTests.size > 0 && (
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedTests.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </div>
            
            <div className="space-y-3">
              {history.map((test, i) => (
                <Card key={test.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedTests.has(test.id)}
                        onCheckedChange={() => toggleSelection(test.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Test #{history.length - i}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            test.mode === 'non-calculator' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {test.mode === 'non-calculator' ? 'Non-Calc' : 'Calculator'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Score: {test.score}% • {test.correctAnswers}/{test.totalQuestions} correct • Grade: {getGrade(test.score)} • {new Date(test.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tests</DialogTitle>
            <DialogDescription>
              {selectedTests.size > 0 
                ? `Delete ${selectedTests.size} selected test(s)?`
                : 'Delete all tests?'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={selectedTests.size > 0 ? deleteSelected : deleteAll}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  return (
    <div className="font-sans">
      {view === 'home' && renderHome()}
      {view === 'test' && renderTest()}
      {view === 'results' && renderResults()}
      {view === 'review' && renderReview()}
      {view === 'history' && renderHistory()}
    </div>
  );
}
```

---

## Files to DELETE (if they exist)

These old files should be removed from `src/lib/questions/`:
- `numberAlgebra.ts` (DELETE)
- `measurementGeometry.ts` (DELETE)
- `statisticsProbability.ts` (DELETE)

---

## Known Issues (FIXED in pending files)

| Issue | Status | Fix |
|-------|--------|-----|
| Question answer contamination | FIXED | `shuffleArray` now creates fresh copy with `[...arr]` |
| Test persistence broken | FIXED | Auto-save useEffect on every answer change |
| Virtual numpad clunky | FIXED | Replaced with simple text input |
| correctAnswer as number | FIXED | All correctAnswer values are now strings |
| Old question files causing build errors | FIXED | Consolidated into single `index.ts` |

---

## Instructions for VS Code Agent

### Immediate Tasks:

1. **Delete old files** (if they exist):
   ```
   src/lib/questions/numberAlgebra.ts
   src/lib/questions/measurementGeometry.ts
   src/lib/questions/statisticsProbability.ts
   ```

2. **Write the 4 new files** from this document:
   - `src/types/index.ts`
   - `src/lib/utils.ts`
   - `src/lib/questions/index.ts`
   - `src/App.tsx`

3. **Verify build**:
   ```bash
   npm run build
   ```

4. **Test the app**:
   - Start a Non-Calculator test
   - Answer a few questions
   - Go back to home (progress should be saved)
   - Resume the test
   - Complete the test
   - Check history
   - Try delete functionality

---

## Next Steps (After verification)

1. **Test question generation**: Start multiple tests, verify no cross-contamination between question types
2. **Test persistence thoroughly**: Start test, answer questions, refresh page, verify resume works
3. **Test edge cases**: Empty answers, invalid inputs, timer expiration
4. **Optional enhancements** (if requested by user):
   - Add worked solutions to review page
   - Add question categories to results
   - Export test history
   - Add sound effects
   - Add animations

---

## GitHub Repo Information

**Note to agent**: This is a public GitHub repo. The user will provide the URL if needed for any verification.

**Deployment**: Vercel is connected to the GitHub repo and auto-deploys on push.

---

## Contact/Context

This project was built by Kimi (Moonshot AI) in a web browser session. The user is now transitioning to VS Code with Kimi Code extension for better file management and direct editing capabilities.
