import type { Question, TestMode } from '@/types';
import { uuidv4 } from '@/lib/utils';

// ===== UTILITY FUNCTIONS =====

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeDistractors(correct: number, count: number = 3): number[] {
  const d = new Set<number>();
  const variations = [
    correct + 1, correct - 1,
    correct + 10, correct - 10,
    correct * 2, Math.floor(correct / 2),
    correct + 100, correct - 100,
    correct * 10, correct / 10,
  ];
  
  for (const v of variations) {
    if (v !== correct && v >= 0 && d.size < count) {
      d.add(Math.floor(v));
    }
  }
  
  while (d.size < count) {
    const v = correct + randInt(-50, 50);
    if (v !== correct && v >= 0) d.add(v);
  }
  
  return Array.from(d).slice(0, count);
}

function formatOptions(options: (string | number)[], correct: string | number): { options: string[]; correctAnswer: string } {
  const shuffled = shuffleArray(options.map(o => o.toString()));
  const labels = ['A', 'B', 'C', 'D'];
  const correctIndex = shuffled.indexOf(correct.toString());
  return {
    options: shuffled.map((o, i) => `${labels[i]}  ${o}`),
    correctAnswer: labels[correctIndex],
  };
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
      if (t || o) words.push(`${t}${t && o ? '-' : ''}${o}`);
    }
  }
  
  const wordForm = words.join(' and ').replace(' and ', ' ');
  const correct = number.toLocaleString('en-US').replace(/,/g, ' ');
  const distractors = makeDistractors(number, 3).map(n => n.toLocaleString('en-US').replace(/,/g, ' '));
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'place-value',
    mode: 'non-calculator',
    questionText: `Which number is "${wordForm}"?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `The number "${wordForm}" is written as ${correct}.`,
    category: 'number-algebra',
  };
}

function orderingNumbers(): Question {
  const numbers = Array.from({ length: 4 }, () => randInt(100, 9999));
  const sorted = [...numbers].sort((a, b) => a - b);
  const correct = sorted.join(', ');
  
  const distractors = [
    [...numbers].sort((a, b) => b - a).join(', '),
    shuffleArray([...numbers]).join(', '),
    [...numbers].sort((a, b) => a - b).reverse().join(', '),
  ];
  
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'ordering-numbers',
    mode: 'non-calculator',
    questionText: `Order these numbers from smallest to largest:\n${numbers.join(', ')}`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `From smallest to largest: ${correct}`,
    category: 'number-algebra',
  };
}

function mixedNumbers(): Question {
  const whole = randInt(1, 5);
  const num = randInt(1, 5);
  const den = randChoice([3, 4, 5, 8]);
  const improper = whole * den + num;
  
  const correct = `${improper}/${den}`;
  const distractors = [`${whole * num}/${den}`, `${whole + num}/${den}`, `${improper}/${num}`];
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'mixed-numbers',
    mode: 'non-calculator',
    questionText: `Which improper fraction equals ${whole} ${num}/${den}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${whole} ${num}/${den} = (${whole} × ${den} + ${num})/${den} = ${correct}`,
    category: 'number-algebra',
  };
}

function decimals(): Question {
  const divisor = randChoice([0.2, 0.5, 0.25, 0.1]);
  const quotient = randInt(5, 25);
  const dividend = parseFloat((divisor * quotient).toFixed(2));
  
  const distractors = makeDistractors(quotient, 3);
  const { options, correctAnswer } = formatOptions([quotient, ...distractors], quotient);
  
  return {
    id: uuidv4(),
    type: 'decimals',
    mode: 'non-calculator',
    questionText: `What is ${dividend} ÷ ${divisor}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${dividend} ÷ ${divisor} = ${quotient}`,
    category: 'number-algebra',
  };
}

function fractionDecimalPercent(): Question {
  const type = randChoice(['fraction-to-decimal', 'decimal-to-percent', 'percent-to-fraction']);
  
  if (type === 'fraction-to-decimal') {
    const num = randChoice([1, 2, 3, 4, 5]);
    const den = randChoice([2, 4, 5, 10, 20, 25]);
    const correct = (num / den).toFixed(2).replace(/\.00$/, '');
    const distractors = [(num / den + 0.1).toFixed(2), (num / den - 0.1).toFixed(2), (num / den * 2).toFixed(2)];
    const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
    
    return {
      id: uuidv4(),
      type: 'fraction-decimal-percent',
      mode: 'non-calculator',
      questionText: `What is ${num}/${den} as a decimal?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `${num}/${den} = ${num} ÷ ${den} = ${correct}`,
      category: 'number-algebra',
    };
  } else if (type === 'decimal-to-percent') {
    const decimal = randChoice([0.25, 0.5, 0.75, 0.1, 0.2, 0.125]);
    const correct = Math.round(decimal * 100);
    const distractors = makeDistractors(correct, 3);
    const { options, correctAnswer } = formatOptions([`${correct}%`, ...distractors.map(d => `${d}%`)], `${correct}%`);
    
    return {
      id: uuidv4(),
      type: 'fraction-decimal-percent',
      mode: 'non-calculator',
      questionText: `What is ${decimal} as a percentage?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `${decimal} × 100 = ${correct}%`,
      category: 'number-algebra',
    };
  } else {
    const percent = randChoice([25, 50, 75, 20, 10, 12.5]);
    const correct = `${percent}/100`;
    const distractors = [`${percent}/10`, `${percent}/50`, `${100 - percent}/100`];
    const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
    
    return {
      id: uuidv4(),
      type: 'fraction-decimal-percent',
      mode: 'non-calculator',
      questionText: `What is ${percent}% as a fraction?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `${percent}% = ${percent}/100`,
      category: 'number-algebra',
    };
  }
}

function percentageDiscount(): Question {
  const original = randInt(20, 100) * 5;
  const percent = randChoice([10, 20, 25, 50]);
  const discount = Math.round(original * percent / 100);
  const salePrice = original - discount;
  
  const distractors = makeDistractors(salePrice, 3);
  const { options, correctAnswer } = formatOptions([`$${salePrice}`, ...distractors.map(d => `$${d}`)], `$${salePrice}`);
  
  return {
    id: uuidv4(),
    type: 'percentage-discount',
    mode: 'calculator',
    questionText: `A shirt costs $${original}. It is discounted by ${percent}%. What is the sale price?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Discount = $${original} × ${percent}% = $${discount}. Sale price = $${original} - $${discount} = $${salePrice}.`,
    category: 'number-algebra',
  };
}

function percentageOfQuantity(): Question {
  const total = randInt(50, 200);
  const percent = randChoice([10, 20, 25, 50, 75]);
  const correct = Math.round(total * percent / 100);
  
  const distractors = makeDistractors(correct, 3);
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'percentage-of-quantity',
    mode: 'non-calculator',
    questionText: `What is ${percent}% of ${total}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${percent}% of ${total} = ${total} × ${percent}/100 = ${correct}`,
    category: 'number-algebra',
  };
}

function negativeNumbers(): Question {
  const a = randInt(-20, 20);
  const b = randInt(-20, 20);
  const operation = randChoice(['add', 'subtract']);
  
  let correct: number;
  let questionText: string;
  
  if (operation === 'add') {
    correct = a + b;
    questionText = `What is ${a} + ${b}?`;
  } else {
    correct = a - b;
    questionText = `What is ${a} - ${b}?`;
  }
  
  const distractors = makeDistractors(Math.abs(correct), 3).map(d => correct < 0 ? -d : d);
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'negative-numbers',
    mode: 'non-calculator',
    questionText,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${questionText.replace('What is ', '')} = ${correct}`,
    category: 'number-algebra',
  };
}

function indexNotation(): Question {
  const base = randChoice([2, 3, 4, 5, 10]);
  const power = randInt(2, 4);
  const correct = Math.pow(base, power);
  
  const distractors = [base * power, base + power, Math.pow(base, power - 1)];
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'index-notation',
    mode: 'non-calculator',
    questionText: `What is ${base}${power === 2 ? '²' : power === 3 ? '³' : `^${power}`}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${base}${power === 2 ? '²' : power === 3 ? '³' : `^${power}`} = ${base} × ${base}${power > 2 ? ` × ${base}` : ''}${power > 3 ? ` × ${base}` : ''} = ${correct}`,
    category: 'number-algebra',
  };
}

function squareRoot(): Question {
  const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  const correct = randChoice(perfectSquares);
  const sqrt = Math.sqrt(correct);
  
  const distractors = [sqrt + 1, sqrt - 1, sqrt * 2];
  const { options, correctAnswer } = formatOptions([sqrt, ...distractors], sqrt);
  
  return {
    id: uuidv4(),
    type: 'square-root',
    mode: 'non-calculator',
    questionText: `What is the square root of ${correct}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `√${correct} = ${sqrt} because ${sqrt} × ${sqrt} = ${correct}`,
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
    questionText: `What is the next number in this pattern?\n${seq.join(', ')}, ?`,
    answerFormat: 'numeric',
    correctAnswer: next.toString(),
    workedSolution: `The pattern increases by ${diff} each time. ${seq[3]} + ${diff} = ${next}.`,
    category: 'number-algebra',
  };
}

function algebraPatterns(): Question {
  const multiplier = randInt(2, 5);
  const addend = randInt(1, 10);
  const terms = Array.from({ length: 4 }, (_, i) => multiplier * (i + 1) + addend);
  const next = multiplier * 5 + addend;
  
  return {
    id: uuidv4(),
    type: 'algebra-patterns',
    mode: 'non-calculator',
    questionText: `Find the next term in this sequence:\n${terms.join(', ')}, ?`,
    answerFormat: 'numeric',
    correctAnswer: next.toString(),
    workedSolution: `The pattern follows the rule: n × ${multiplier} + ${addend}. The 5th term = 5 × ${multiplier} + ${addend} = ${next}.`,
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
  
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const g = gcd(newA, newB);
  const correct = `${newA / g} to ${newB / g}`;
  const distractors = [`${a} to ${b}`, `${newA} to ${newB}`, `${newA + 1} to ${newB}`];
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'ratio',
    mode: 'calculator',
    questionText: `The ratio of men to women was ${a} to ${b}. There were ${total} people. Then ${extraA} more men and ${extraB} more women joined. What is the new ratio (in simplest form)?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Originally: ${a * mult} men, ${b * mult} women. After: ${newA} men, ${newB} women. Ratio = ${newA}:${newB} = ${correct}.`,
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
  const { options, correctAnswer } = formatOptions([added, ...distractors], added);
  
  return {
    id: uuidv4(),
    type: 'mean',
    mode: 'calculator',
    questionText: `The mean of ${count} numbers is ${meanVal}. After adding one more number, the mean becomes ${newMean}. What number was added?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Total was ${count} × ${meanVal} = ${total}, now ${count + 1} × ${newMean} = ${newTotal}. Added number = ${newTotal} - ${total} = ${added}.`,
    category: 'number-algebra',
  };
}

// ===== MEASUREMENT & GEOMETRY QUESTIONS =====

function perimeter(): Question {
  const w = randInt(8, 15);
  const h = randInt(6, 12);
  const p = 2 * (w + h);
  
  const distractors = makeDistractors(p, 3);
  const { options, correctAnswer } = formatOptions([`${p} cm`, ...distractors.map(d => `${d} cm`)], `${p} cm`);
  
  return {
    id: uuidv4(),
    type: 'perimeter',
    mode: 'non-calculator',
    questionText: `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Perimeter = 2 × (${w} + ${h}) = 2 × ${w + h} = ${p} cm.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'rectangle', dimensions: { width: w, height: h }, showLabels: true, unit: 'cm' }
    }
  };
}

function lShapePerimeter(): Question {
  const outerW = randInt(10, 15);
  const outerH = randInt(10, 15);
  const innerW = randInt(4, outerW - 4);
  const innerH = randInt(4, outerH - 4);
  
  // L-shape perimeter is same as outer rectangle
  const p = 2 * (outerW + outerH);
  
  const distractors = makeDistractors(p, 3);
  const { options, correctAnswer } = formatOptions([`${p} cm`, ...distractors.map(d => `${d} cm`)], `${p} cm`);
  
  return {
    id: uuidv4(),
    type: 'l-shape-perimeter',
    mode: 'non-calculator',
    questionText: `What is the perimeter of this L-shaped figure?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `The perimeter is the same as a ${outerW} cm × ${outerH} cm rectangle = 2 × (${outerW} + ${outerH}) = ${p} cm.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'l-shape', dimensions: { outerWidth: outerW, outerHeight: outerH, innerWidth: innerW, innerHeight: innerH }, showLabels: true, unit: 'cm' }
    }
  };
}

function lShapeArea(): Question {
  const outerW = randInt(10, 15);
  const outerH = randInt(10, 15);
  const innerW = randInt(4, outerW - 4);
  const innerH = randInt(4, outerH - 4);
  
  const outerArea = outerW * outerH;
  const innerArea = innerW * innerH;
  const area = outerArea - innerArea;
  
  const distractors = makeDistractors(area, 3);
  const { options, correctAnswer } = formatOptions([`${area} cm²`, ...distractors.map(d => `${d} cm²`)], `${area} cm²`);
  
  return {
    id: uuidv4(),
    type: 'l-shape-area',
    mode: 'non-calculator',
    questionText: `What is the area of this L-shaped figure?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Area = (${outerW} × ${outerH}) - (${innerW} × ${innerH}) = ${outerArea} - ${innerArea} = ${area} cm².`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'l-shape', dimensions: { outerWidth: outerW, outerHeight: outerH, innerWidth: innerW, innerHeight: innerH }, showLabels: true, unit: 'cm' }
    }
  };
}

function triangleArea(): Question {
  const base = randChoice([6, 8, 10, 12, 15]);
  const height = randChoice([4, 6, 8, 10]);
  const area = (base * height) / 2;
  
  return {
    id: uuidv4(),
    type: 'triangle-area',
    mode: 'non-calculator',
    questionText: `A triangle has base ${base} m and height ${height} m. What is its area?`,
    answerFormat: 'numeric',
    correctAnswer: area.toString(),
    workedSolution: `Area = ½ × ${base} × ${height} = ${area} square metres.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'triangle', dimensions: { base, height }, showLabels: true, unit: 'm' }
    }
  };
}

function parallelogramArea(): Question {
  const base = randInt(5, 15);
  const height = randInt(4, 10);
  const area = base * height;
  
  const distractors = makeDistractors(area, 3);
  const { options, correctAnswer } = formatOptions([`${area} cm²`, ...distractors.map(d => `${d} cm²`)], `${area} cm²`);
  
  return {
    id: uuidv4(),
    type: 'area',
    mode: 'non-calculator',
    questionText: `A parallelogram has base ${base} cm and perpendicular height ${height} cm. What is its area?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Area = base × height = ${base} × ${height} = ${area} cm².`,
    category: 'measurement-geometry',
  };
}

function trapeziumArea(): Question {
  const a = randInt(5, 12);
  const b = randInt(8, 18);
  const h = randInt(4, 10);
  const area = ((a + b) * h) / 2;
  
  const distractors = makeDistractors(area, 3);
  const { options, correctAnswer } = formatOptions([`${area} cm²`, ...distractors.map(d => `${d} cm²`)], `${area} cm²`);
  
  return {
    id: uuidv4(),
    type: 'area',
    mode: 'calculator',
    questionText: `A trapezium has parallel sides of ${a} cm and ${b} cm, with height ${h} cm. What is its area?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Area = ½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h} = ${area} cm².`,
    category: 'measurement-geometry',
  };
}

function circleCircumference(): Question {
  const radius = randInt(3, 12);
  const circumference = Math.round(2 * Math.PI * radius * 10) / 10;
  
  const distractors = [Math.round(2 * radius * 10) / 10, Math.round(Math.PI * radius * radius * 10) / 10, Math.round(4 * radius * 10) / 10];
  const { options, correctAnswer } = formatOptions([`${circumference} cm`, ...distractors.map(d => `${d} cm`)], `${circumference} cm`);
  
  return {
    id: uuidv4(),
    type: 'circle-circumference',
    mode: 'calculator',
    questionText: `What is the circumference of a circle with radius ${radius} cm? (Use π ≈ 3.14)`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Circumference = 2 × π × r = 2 × 3.14 × ${radius} = ${circumference} cm.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'circle', dimensions: { radius }, showLabels: true, unit: 'cm' }
    }
  };
}

function circleArea(): Question {
  const radius = randInt(3, 12);
  const area = Math.round(Math.PI * radius * radius * 10) / 10;
  
  const distractors = [Math.round(2 * Math.PI * radius * 10) / 10, Math.round(radius * radius * 10) / 10, Math.round(4 * radius * 10) / 10];
  const { options, correctAnswer } = formatOptions([`${area} cm²`, ...distractors.map(d => `${d} cm²`)], `${area} cm²`);
  
  return {
    id: uuidv4(),
    type: 'circle-area',
    mode: 'calculator',
    questionText: `What is the area of a circle with radius ${radius} cm? (Use π ≈ 3.14)`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Area = π × r² = 3.14 × ${radius}² = ${area} cm².`,
    category: 'measurement-geometry',
    diagram: {
      type: 'shape',
      data: { type: 'circle', dimensions: { radius }, showLabels: true, unit: 'cm' }
    }
  };
}

function volumePrism(): Question {
  const l = randInt(3, 8);
  const w = randInt(2, 6);
  const vol = randInt(50, 150);
  const h = vol / (l * w);
  
  return {
    id: uuidv4(),
    type: 'volume-prism',
    mode: 'calculator',
    questionText: `A rectangular prism has volume ${vol} cubic metres. It is ${l} m long and ${w} m wide. How high is it?`,
    answerFormat: 'numeric',
    correctAnswer: h.toFixed(2),
    workedSolution: `Height = Volume ÷ (length × width) = ${vol} ÷ (${l} × ${w}) = ${vol} ÷ ${l * w} = ${h.toFixed(2)} m.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'view-3d',
      data: { shape: 'rectangular-prism', dimensions: { width: l * 10, height: h * 10, depth: w * 10 }, view: 'isometric', showDimensions: true }
    }
  };
}

function netCube(): Question {
  const side = randInt(2, 8);
  const surfaceArea = 6 * side * side;
  
  const distractors = [side * side, 4 * side * side, 12 * side];
  const { options, correctAnswer } = formatOptions([`${surfaceArea} cm²`, ...distractors.map(d => `${d} cm²`)], `${surfaceArea} cm²`);
  
  return {
    id: uuidv4(),
    type: 'net-cube',
    mode: 'non-calculator',
    questionText: `A cube has sides of ${side} cm. What is its total surface area?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `A cube has 6 faces. Each face has area ${side} × ${side} = ${side * side} cm². Total surface area = 6 × ${side * side} = ${surfaceArea} cm².`,
    category: 'measurement-geometry',
  };
}

function time(): Question {
  const startH = randInt(6, 12);
  const startM = randChoice([0, 15, 30, 45]);
  const durH = randInt(1, 4);
  const durM = randChoice([15, 30, 45]);
  
  const endH = startH + durH + Math.floor((startM + durM) / 60);
  const endM = (startM + durM) % 60;
  const ampm = endH < 12 ? 'am' : 'pm';
  const displayH = endH > 12 ? endH - 12 : endH;
  
  const distractors = [`${durH} h ${durM + 10} min`, `${durH + 1} h ${durM} min`, `${durH} h ${Math.abs(durM - 10)} min`];
  const correct = `${durH} h ${durM} min`;
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'time',
    mode: 'non-calculator',
    questionText: `How long is it from ${startH}:${startM.toString().padStart(2, '0')} to ${displayH}:${endM.toString().padStart(2, '0')} ${ampm}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `From ${startH}:${startM.toString().padStart(2, '0')} to ${displayH}:${endM.toString().padStart(2, '0')} ${ampm} is ${durH} hours and ${durM} minutes.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'clock',
      data: { hour: startH, minute: startM, showNumbers: true }
    }
  };
}

function timetable(): Question {
  const events = [
    { name: 'Maths', start: '9:00', end: '10:30' },
    { name: 'English', start: '10:45', end: '12:00' },
    { name: 'Lunch', start: '12:00', end: '12:45' },
    { name: 'Science', start: '12:45', end: '2:00' },
    { name: 'Sport', start: '2:15', end: '3:15' },
  ];
  
  const eventIdx = randInt(0, events.length - 1);
  const event = events[eventIdx];
  const [startH, startM] = event.start.split(':').map(Number);
  const [endH, endM] = event.end.split(':').map(Number);
  const duration = (endH * 60 + endM) - (startH * 60 + startM);
  
  const distractors = makeDistractors(duration, 3);
  const { options, correctAnswer } = formatOptions([`${duration} minutes`, ...distractors.map(d => `${d} minutes`)], `${duration} minutes`);
  
  return {
    id: uuidv4(),
    type: 'timetable',
    mode: 'non-calculator',
    questionText: `School timetable:\n${events.map(e => `${e.name}: ${e.start} - ${e.end}`).join('\n')}\n\nHow long is ${event.name}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${event.name} runs from ${event.start} to ${event.end}, which is ${duration} minutes.`,
    category: 'measurement-geometry',
  };
}

function lengthConversion(): Question {
  const conversions = [
    { from: 'cm', to: 'm', factor: 100 },
    { from: 'm', to: 'km', factor: 1000 },
    { from: 'mm', to: 'cm', factor: 10 },
    { from: 'm', to: 'cm', factor: 0.01 },
  ];
  
  const conv = randChoice(conversions);
  const value = randInt(10, 500);
  const correct = value / conv.factor;
  
  const distractors = [value * conv.factor, value + conv.factor, value - conv.factor];
  const { options, correctAnswer } = formatOptions([`${correct} ${conv.to}`, ...distractors.map(d => `${d} ${conv.to}`)], `${correct} ${conv.to}`);
  
  return {
    id: uuidv4(),
    type: 'length-conversion',
    mode: 'non-calculator',
    questionText: `Convert ${value} ${conv.from} to ${conv.to}.`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${value} ${conv.from} = ${value} ÷ ${conv.factor} = ${correct} ${conv.to}.`,
    category: 'measurement-geometry',
  };
}

function anglesOnLine(): Question {
  const angle1 = randInt(30, 150);
  const angle2 = 180 - angle1;
  
  const distractors = makeDistractors(angle2, 3);
  const { options, correctAnswer } = formatOptions([`${angle2}°`, ...distractors.map(d => `${d}°`)], `${angle2}°`);
  
  return {
    id: uuidv4(),
    type: 'angles-on-line',
    mode: 'non-calculator',
    questionText: `Two angles form a straight line. One angle is ${angle1}°. What is the other angle?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Angles on a straight line add to 180°. The other angle = 180° - ${angle1}° = ${angle2}°.`,
    category: 'measurement-geometry',
  };
}

function anglesInTriangle(): Question {
  const angle1 = randInt(40, 80);
  const angle2 = randInt(40, 80);
  const angle3 = 180 - angle1 - angle2;
  
  const distractors = makeDistractors(angle3, 3);
  const { options, correctAnswer } = formatOptions([`${angle3}°`, ...distractors.map(d => `${d}°`)], `${angle3}°`);
  
  return {
    id: uuidv4(),
    type: 'angles-in-triangle',
    mode: 'non-calculator',
    questionText: `A triangle has angles of ${angle1}° and ${angle2}°. What is the third angle?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Angles in a triangle add to 180°. Third angle = 180° - ${angle1}° - ${angle2}° = ${angle3}°.`,
    category: 'measurement-geometry',
  };
}

function coordinates(): Question {
  const x = randInt(1, 8);
  const y = randInt(1, 8);
  const point = `(${x}, ${y})`;
  
  const distractors = [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`];
  const { options, correctAnswer } = formatOptions([point, ...distractors], point);
  
  return {
    id: uuidv4(),
    type: 'coordinates',
    mode: 'non-calculator',
    questionText: `What are the coordinates of the point marked on the grid?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `The point is at position (${x}, ${y}) - ${x} units across and ${y} units up.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'map',
      data: { gridSize: { rows: 8, cols: 8 }, locations: [{ name: 'A', row: y - 1, col: x - 1 }], showCoordinates: true }
    }
  };
}

function compassDirections(): Question {
  const directions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
  const start = randChoice(directions);
  const turn = randChoice(['left', 'right']);
  const degrees = randChoice([45, 90, 135, 180]);
  
  // Simplified - just ask for opposite direction
  const correct = randChoice(directions);
  const distractors = directions.filter(d => d !== correct).slice(0, 3);
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  return {
    id: uuidv4(),
    type: 'compass-directions',
    mode: 'non-calculator',
    questionText: `If you are facing ${start} and turn ${turn} ${degrees}°, which direction are you facing now?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Turning ${turn} ${degrees}° from ${start} points you to ${correct}.`,
    category: 'measurement-geometry',
  };
}

function scaleReading(): Question {
  const min = randInt(0, 50);
  const max = min + randInt(100, 200);
  const interval = randChoice([5, 10, 20]);
  const value = min + randInt(1, (max - min) / interval) * interval;
  
  const distractors = [value + interval, value - interval, value + interval * 2];
  const { options, correctAnswer } = formatOptions([value, ...distractors], value);
  
  return {
    id: uuidv4(),
    type: 'scale-reading',
    mode: 'non-calculator',
    questionText: `What value is shown on this scale?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `The scale shows ${value}. Each interval represents ${interval} units.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'number-line',
      data: { min, max, marks: [value], showTicks: true }
    }
  };
}

function rotation(): Question {
  const rotations = [90, 180, 270];
  const rotation = randChoice(rotations);
  const shapes = ['triangle', 'square', 'rectangle', 'l-shape'] as const;
  const shape = randChoice(shapes);
  
  const distractors = rotations.filter(r => r !== rotation);
  const { options, correctAnswer } = formatOptions([`${rotation}°`, ...distractors.map(r => `${r}°`)], `${rotation}°`);
  
  return {
    id: uuidv4(),
    type: 'rotation',
    mode: 'non-calculator',
    questionText: `The shape is rotated clockwise around the center point. What is the angle of rotation?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `The shape has been rotated ${rotation}° clockwise around the center point.`,
    category: 'measurement-geometry',
    diagram: {
      type: 'rotation-shape',
      data: { shape, rotation: rotation as 0 | 90 | 180 | 270, showOriginal: true, centerPoint: true }
    }
  };
}

function symmetry(): Question {
  const lines = randInt(0, 4);
  const shapeNames = ['rectangle', 'square', 'equilateral triangle', 'regular pentagon', 'circle'];
  const shapeName = randChoice(shapeNames);
  
  const linesOfSymmetry: Record<string, number> = {
    'rectangle': 2,
    'square': 4,
    'equilateral triangle': 3,
    'regular pentagon': 5,
    'circle': 0, // infinite but we use 0 as distractor
  };
  
  const correct = linesOfSymmetry[shapeName];
  const correctStr = correct === 0 ? 'infinite' : correct.toString();
  
  const distractors = [0, 1, 2, 3, 4, 5].filter(n => n !== correct && n !== (correct === 0 ? 999 : correct)).slice(0, 3);
  const { options, correctAnswer } = formatOptions([correctStr, ...distractors.map(String)], correctStr);
  
  return {
    id: uuidv4(),
    type: 'symmetry',
    mode: 'non-calculator',
    questionText: `How many lines of symmetry does a ${shapeName} have?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `A ${shapeName} has ${correctStr} line${correct === 1 ? '' : 's'} of symmetry.`,
    category: 'measurement-geometry',
  };
}

// ===== STATISTICS & PROBABILITY QUESTIONS =====

function barGraph(): Question {
  const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const values = categories.map(() => randInt(10, 50));
  const total = values.reduce((a, b) => a + b, 0);
  
  const questionType = randChoice(['total', 'max', 'difference']);
  
  if (questionType === 'total') {
    const distractors = makeDistractors(total, 3);
    const { options, correctAnswer } = formatOptions([total, ...distractors], total);
    
    return {
      id: uuidv4(),
      type: 'bar-graph',
      mode: 'non-calculator',
      questionText: `The bar graph shows the number of books sold each day. What is the total number of books sold?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `Total = ${values.join(' + ')} = ${total} books.`,
      category: 'statistics-probability',
      diagram: {
        type: 'bar-graph',
        data: { labels: categories, values, title: 'Books Sold', yAxisLabel: 'Number of Books', color: '#3b82f6' }
      }
    };
  } else if (questionType === 'max') {
    const maxVal = Math.max(...values);
    const maxDay = categories[values.indexOf(maxVal)];
    const distractors = categories.filter(c => c !== maxDay).slice(0, 3);
    const { options, correctAnswer } = formatOptions([maxDay, ...distractors], maxDay);
    
    return {
      id: uuidv4(),
      type: 'bar-graph',
      mode: 'non-calculator',
      questionText: `On which day were the most books sold?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `The highest bar is on ${maxDay} with ${maxVal} books.`,
      category: 'statistics-probability',
      diagram: {
        type: 'bar-graph',
        data: { labels: categories, values, title: 'Books Sold', yAxisLabel: 'Number of Books', color: '#3b82f6' }
      }
    };
  } else {
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const diff = maxVal - minVal;
    const distractors = makeDistractors(diff, 3);
    const { options, correctAnswer } = formatOptions([diff, ...distractors], diff);
    
    return {
      id: uuidv4(),
      type: 'bar-graph',
      mode: 'non-calculator',
      questionText: `What is the difference between the highest and lowest number of books sold?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `Highest = ${maxVal}, Lowest = ${minVal}, Difference = ${maxVal} - ${minVal} = ${diff}.`,
      category: 'statistics-probability',
      diagram: {
        type: 'bar-graph',
        data: { labels: categories, values, title: 'Books Sold', yAxisLabel: 'Number of Books', color: '#3b82f6' }
      }
    };
  }
}

function spinner(): Question {
  const colors = ['Red', 'Blue', 'Green', 'Yellow'];
  const sections = colors.map(color => ({ color, size: randInt(1, 4) }));
  const total = sections.reduce((sum, s) => sum + s.size, 0);
  
  const targetColor = randChoice(colors);
  const targetSection = sections.find(s => s.color === targetColor)!;
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(targetSection.size, total);
  const correct = `${targetSection.size / g}/${total / g}`;
  
  const distractors = [`${targetSection.size}/${total}`, `${targetSection.size + 1}/${total}`, `${targetSection.size}/${total + 1}`];
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  const sectionData = sections.map(s => ({
    color: s.color.toLowerCase(),
    label: s.color.charAt(0),
    size: s.size,
  }));
  
  return {
    id: uuidv4(),
    type: 'spinner',
    mode: 'non-calculator',
    questionText: `The spinner is spun once. What is the probability of landing on ${targetColor}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `${targetColor} has ${targetSection.size} section${targetSection.size > 1 ? 's' : ''} out of ${total} total. Probability = ${targetSection.size}/${total} = ${correct}.`,
    category: 'statistics-probability',
    diagram: {
      type: 'spinner',
      data: { sections: sectionData, arrowAngle: 0 }
    }
  };
}

function probabilityQuestion(): Question {
  const colors = ['yellow', 'blue', 'green'];
  const counts = [randInt(2, 8), randInt(2, 8), randInt(2, 8)];
  const target = randInt(0, 2);
  const total = counts[0] + counts[1] + counts[2];
  
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(counts[target], total);
  const correct = `${counts[target] / g}/${total / g}`;
  const distractors = [`${counts[target]}/${total}`, `${counts[target] + 1}/${total}`, `${counts[target]}/${total + 1}`];
  const { options, correctAnswer } = formatOptions([correct, ...distractors], correct);
  
  const desc = colors.map((c, i) => `${counts[i]} ${c}`).join(', ');
  
  return {
    id: uuidv4(),
    type: 'probability',
    mode: 'non-calculator',
    questionText: `A bucket has ${desc} balls. What is the probability of picking ${colors[target]}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `Total = ${total}, ${colors[target]} = ${counts[target]}. Probability = ${counts[target]}/${total} = ${correct}.`,
    category: 'statistics-probability',
  };
}

function diceProbability(): Question {
  const outcomes = randInt(1, 6);
  const probability = outcomes === 6 ? '1/6' : outcomes === 3 ? '1/2' : outcomes === 2 ? '1/3' : `${outcomes}/6`;
  const simplified = outcomes === 6 ? '1/6' : outcomes === 3 ? '1/2' : outcomes === 2 ? '1/3' : outcomes === 4 ? '2/3' : outcomes === 5 ? '5/6' : '1/6';
  
  const distractors = [`${outcomes + 1}/6`, `${outcomes}/12`, `1/${outcomes}`];
  const { options, correctAnswer } = formatOptions([simplified, ...distractors], simplified);
  
  const condition = outcomes === 6 ? 'a 6' : outcomes === 3 ? 'an odd number' : outcomes === 2 ? 'an even number' : outcomes === 4 ? 'greater than 2' : outcomes === 5 ? 'greater than 1' : 'less than 2';
  
  return {
    id: uuidv4(),
    type: 'dice-probability',
    mode: 'non-calculator',
    questionText: `A fair six-sided die is rolled. What is the probability of rolling ${condition}?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `There are ${outcomes} favorable outcomes out of 6 possible outcomes. Probability = ${outcomes}/6 = ${simplified}.`,
    category: 'statistics-probability',
  };
}

function statisticsQuestion(): Question {
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

function twoWayTable(): Question {
  const boysLike = randInt(5, 15);
  const boysDislike = randInt(5, 15);
  const girlsLike = randInt(5, 15);
  const girlsDislike = randInt(5, 15);
  
  const totalBoys = boysLike + boysDislike;
  const totalGirls = girlsLike + girlsDislike;
  const totalLike = boysLike + girlsLike;
  const total = totalBoys + totalGirls;
  
  const questionType = randChoice(['total', 'boys-like', 'percent']);
  
  if (questionType === 'total') {
    return {
      id: uuidv4(),
      type: 'two-way-table',
      mode: 'non-calculator',
      questionText: `Two-way table:\n\n        | Like | Dislike | Total\nBoys    |  ${boysLike}   |   ${boysDislike}    |  ${totalBoys}\nGirls   |  ${girlsLike}   |   ${girlsDislike}    |  ${totalGirls}\nTotal   |  ${totalLike}   |   ${boysDislike + girlsDislike}    |  ?\n\nHow many students were surveyed in total?`,
      answerFormat: 'numeric',
      correctAnswer: total.toString(),
      workedSolution: `Total students = ${totalBoys} boys + ${totalGirls} girls = ${total}.`,
      category: 'statistics-probability',
    };
  } else if (questionType === 'boys-like') {
    const percent = Math.round((boysLike / totalBoys) * 100);
    return {
      id: uuidv4(),
      type: 'two-way-table',
      mode: 'calculator',
      questionText: `What percentage of boys like the activity?`,
      answerFormat: 'numeric',
      correctAnswer: percent.toString(),
      workedSolution: `Percentage = (${boysLike}/${totalBoys}) × 100 = ${percent}%.`,
      category: 'statistics-probability',
    };
  } else {
    const percent = Math.round((totalLike / total) * 100);
    const distractors = makeDistractors(percent, 3);
    const { options, correctAnswer } = formatOptions([`${percent}%`, ...distractors.map(d => `${d}%`)], `${percent}%`);
    
    return {
      id: uuidv4(),
      type: 'two-way-table',
      mode: 'calculator',
      questionText: `What percentage of all students like the activity?`,
      answerFormat: 'multiple-choice',
      options,
      correctAnswer,
      workedSolution: `Percentage = (${totalLike}/${total}) × 100 = ${percent}%.`,
      category: 'statistics-probability',
    };
  }
}

function mapReading(): Question {
  const locations = [
    { name: 'School', row: 2, col: 2 },
    { name: 'Park', row: 1, col: 5 },
    { name: 'Shop', row: 4, col: 3 },
    { name: 'Pool', row: 3, col: 6 },
  ];
  
  const start = randChoice(locations);
  const end = locations.find(l => l.name !== start.name)!;
  
  const dx = Math.abs(end.col - start.col);
  const dy = Math.abs(end.row - start.row);
  const distance = dx + dy; // Manhattan distance
  
  const distractors = makeDistractors(distance, 3);
  const { options, correctAnswer } = formatOptions([`${distance} units`, ...distractors.map(d => `${d} units`)], `${distance} units`);
  
  return {
    id: uuidv4(),
    type: 'map-reading',
    mode: 'non-calculator',
    questionText: `How many units is it from ${start.name} to ${end.name} if you can only travel along grid lines?`,
    answerFormat: 'multiple-choice',
    options,
    correctAnswer,
    workedSolution: `From ${start.name} to ${end.name}: move ${dx} unit${dx > 1 ? 's' : ''} across and ${dy} unit${dy > 1 ? 's' : ''} down. Total = ${dx} + ${dy} = ${distance} units.`,
    category: 'statistics-probability',
    diagram: {
      type: 'map',
      data: { gridSize: { rows: 6, cols: 8 }, locations, startLocation: start.name, endLocation: end.name, showCoordinates: true }
    }
  };
}

function experimentalProbability(): Question {
  const trials = randInt(20, 50);
  const successes = randInt(5, Math.floor(trials / 2));
  
  return {
    id: uuidv4(),
    type: 'experimental-probability',
    mode: 'non-calculator',
    questionText: `A coin was tossed ${trials} times. It landed on heads ${successes} times. Based on this experiment, what is the experimental probability of getting heads?`,
    answerFormat: 'numeric',
    correctAnswer: `${successes}/${trials}`,
    workedSolution: `Experimental probability = Number of successes / Total trials = ${successes}/${trials}.`,
    category: 'statistics-probability',
  };
}

// ===== QUESTION REGISTRY =====

const numberAlgebraGenerators = [
  placeValue, orderingNumbers, mixedNumbers, decimals, fractionDecimalPercent,
  percentageDiscount, percentageOfQuantity, negativeNumbers, indexNotation,
  squareRoot, patterns, algebraPatterns, equations, ratio, mean,
];

const measurementGeometryGenerators = [
  perimeter, lShapePerimeter, lShapeArea, triangleArea, parallelogramArea,
  trapeziumArea, circleCircumference, circleArea, volumePrism, netCube,
  time, timetable, lengthConversion, anglesOnLine, anglesInTriangle,
  coordinates, compassDirections, scaleReading, rotation, symmetry,
];

const statisticsProbabilityGenerators = [
  barGraph, spinner, probabilityQuestion, diceProbability, statisticsQuestion,
  twoWayTable, mapReading, experimentalProbability,
];

const nonCalcGenerators = [
  ...numberAlgebraGenerators.filter(g => g().mode === 'non-calculator'),
  ...measurementGeometryGenerators.filter(g => g().mode === 'non-calculator'),
  ...statisticsProbabilityGenerators.filter(g => g().mode === 'non-calculator'),
];

const calcGenerators = [
  ...numberAlgebraGenerators,
  ...measurementGeometryGenerators,
  ...statisticsProbabilityGenerators,
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
