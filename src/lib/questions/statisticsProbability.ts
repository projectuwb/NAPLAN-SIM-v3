import type { Question } from '@/types';
import { uuidv4, shuffle, generateDistractors } from '@/lib/utils';

// Probability Questions
export const generateProbabilityQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'simple' : 'spinner';
  
  if (type === 'simple') {
    const colors = ['yellow', 'blue', 'green', 'red', 'black'];
    const counts: { color: string; count: number }[] = [];
    let total = 0;
    
    for (let i = 0; i < 3; i++) {
      const count = Math.floor(Math.random() * 6) + 2;
      counts.push({ color: colors[i], count });
      total += count;
    }
    
    const targetIndex = Math.floor(Math.random() * counts.length);
    const target = counts[targetIndex];
    
    // Simplify fraction
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = gcd(target.count, total);
    const num = target.count / g;
    const den = total / g;
    
    const correctAnswer = `${num}/${den}`;
    const distractors = [
      `${target.count}/${total}`,
      `${num + 1}/${den}`,
      `${num}/${den + 1}`,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    const description = counts.map(c => `${c.count} ${c.color}`).join(', ');
    
    return {
      id: uuidv4(),
      type: 'probability',
      mode,
      difficulty: 'intermediate',
      questionText: `A bucket holds ${description} balls. If one ball is taken from the bucket without looking, what is the chance that it is ${target.color}?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `Total balls = ${total}. ${target.color} balls = ${target.count}. Probability = ${target.count}/${total} = ${correctAnswer}.`,
      category: 'statistics-probability',
    };
  } else {
    // Spinner question
    const sections = [1, 2, 3, 4, 4, 4, 5, 6];
    const targetNum = 4;
    const count = sections.filter(n => n === targetNum).length;
    const total = sections.length;
    
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = gcd(count, total);
    const num = count / g;
    const den = total / g;
    
    const correctAnswer = `${num}/${den}`;
    const distractors = [
      `${count}/${total}`,
      `1/${total}`,
      `${count}/${count + 1}`,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'spinner',
      mode,
      difficulty: 'basic',
      questionText: `Which spinner has a one in four chance of landing on 4?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      diagram: {
        type: 'spinner',
        data: { sections, highlightNumber: 4 }
      },
      workedSolution: `The spinner has ${count} sections with 4 out of ${total} total sections. Probability = ${count}/${total} = ${correctAnswer}.`,
      category: 'statistics-probability',
    };
  }
};

// Statistics Questions
export const generateStatisticsQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'percentage' : 'table';
  
  if (type === 'percentage') {
    const ages = [11, 12, 13, 14];
    const counts: { age: number; count: number }[] = [];
    let total = 0;
    
    for (const age of ages) {
      const count = Math.floor(Math.random() * 15) + 5;
      counts.push({ age, count });
      total += count;
    }
    
    const targetIndex = Math.floor(Math.random() * counts.length);
    const target = counts[targetIndex];
    const percentage = Math.round((target.count / total) * 100);
    
    return {
      id: uuidv4(),
      type: 'statistics',
      mode,
      difficulty: 'advanced',
      questionText: `The age of ${total} students was recorded:\n${counts.map(c => `Age ${c.age}: ${c.count} students`).join('\n')}\n\nWhat percentage of the students are ${target.age}?`,
      answerFormat: 'numeric',
      correctAnswer: percentage,
      workedSolution: `Percentage = (${target.count}/${total}) × 100 = ${percentage}%.`,
      category: 'statistics-probability',
    };
  } else {
    // Two-way table
    const teams = ['Crows', 'Eagles', 'Hawks'];
    const categories = ['Men', 'Women', 'Children'];
    
    // Generate partial table
    const table: Record<string, Record<string, number>> = {};
    let total = 0;
    
    for (const team of teams) {
      table[team] = {};
      for (const cat of categories) {
        const val = Math.floor(Math.random() * 10) + 2;
        table[team][cat] = val;
        total += val;
      }
    }
    
    // Hide one value
    const hideTeam = teams[Math.floor(Math.random() * teams.length)];
    const hideCat = categories[Math.floor(Math.random() * categories.length)];
    const hiddenValue = table[hideTeam][hideCat];
    
    const distractors = generateDistractors(hiddenValue, 3);
    const options = shuffle([hiddenValue, ...distractors]);
    const correctIndex = options.indexOf(hiddenValue);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'statistics',
      mode,
      difficulty: 'intermediate',
      questionText: `${total} people were asked which team they supported. How many ${hideCat.toLowerCase()} supported the ${hideTeam}?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `From the table data, the number of ${hideCat.toLowerCase()} who supported the ${hideTeam} is ${hiddenValue}.`,
      category: 'statistics-probability',
    };
  }
};

// Bar Graph Questions
export const generateBarGraphQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const categories = ['White', 'Red', 'Blue', 'Silver', 'Black', 'Other'];
  const data = categories.map(cat => ({
    label: cat,
    value: Math.floor(Math.random() * 20) + 5,
  }));
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const compare1 = data[0];
  const compare2 = data[1];
  const difference = compare1.value - compare2.value;
  
  return {
    id: uuidv4(),
    type: 'bar-graph',
    mode,
    difficulty: 'intermediate',
    questionText: `Rita recorded the colour of ${total} cars. This graph shows the results. How many more ${compare1.label.toLowerCase()} cars than ${compare2.label.toLowerCase()} cars were recorded?`,
    answerFormat: 'numeric',
    correctAnswer: difference,
    diagram: {
      type: 'bar-graph',
      data: { data, title: 'Car Colours', yAxisLabel: 'Number of cars' }
    },
    workedSolution: `${compare1.label} cars: ${compare1.value}. ${compare2.label} cars: ${compare2.value}. Difference = ${compare1.value} - ${compare2.value} = ${difference}.`,
    category: 'statistics-probability',
  };
};

// Percentage of a Quantity
export const generatePercentageQuantityQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const total = [500, 600, 700, 800][Math.floor(Math.random() * 4)];
  const fraction = [2, 3, 4][Math.floor(Math.random() * 3)];
  const percent = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
  
  const part1 = total / fraction;
  const remaining = total - part1;
  const result = (percent / 100) * remaining;
  
  const distractors = generateDistractors(Math.floor(result), 3);
  const options = shuffle([Math.floor(result), ...distractors]);
  const correctIndex = options.indexOf(Math.floor(result));
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'statistics',
    mode,
    difficulty: 'advanced',
    questionText: `There are ${total} people at the showground. One-${fraction === 2 ? 'half' : fraction === 3 ? 'third' : 'quarter'} of the people are competitors and the rest are spectators. ${percent}% of the spectators are children.\n\nHow many children are spectators at the showground?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Competitors = ${total}/${fraction} = ${part1}. Spectators = ${total} - ${part1} = ${remaining}. Children = ${percent}% of ${remaining} = ${Math.floor(result)}.`,
    category: 'statistics-probability',
  };
};

// Fraction of a Number
export const generateFractionNumberQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const num = [2, 3, 4][Math.floor(Math.random() * 3)];
  const den = [3, 4, 5][Math.floor(Math.random() * 3)];
  const value = [36, 48, 60, 72, 84][Math.floor(Math.random() * 5)];
  
  const wholeNumber = (value * den) / num;
  const targetNum = [3, 4][Math.floor(Math.random() * 2)];
  const targetDen = [4, 5][Math.floor(Math.random() * 2)];
  const result = (targetNum / targetDen) * wholeNumber;
  
  return {
    id: uuidv4(),
    type: 'statistics',
    mode,
    difficulty: 'advanced',
    questionText: `${num}/${den} of a number is ${value}. What is ${targetNum}/${targetDen} of the number?`,
    answerFormat: 'numeric',
    correctAnswer: result,
    workedSolution: `If ${num}/${den} of the number = ${value}, then the number = ${value} × ${den}/${num} = ${wholeNumber}. Then ${targetNum}/${targetDen} of ${wholeNumber} = ${result}.`,
    category: 'statistics-probability',
  };
};

// Map Reading Questions
export const generateMapReadingQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const towns = [
    { name: 'Arundel', x: 80, y: 60 },
    { name: 'Seaview', x: 180, y: 50 },
    { name: 'Newtown', x: 150, y: 120 },
    { name: 'Oxley', x: 50, y: 100 },
    { name: 'Kambara', x: 100, y: 150 },
    { name: 'Pleasance', x: 190, y: 170 },
  ];
  
  // Find town that is North of one and West of another
  const reference1 = towns[4]; // Kambara
  const reference2 = towns[1]; // Seaview
  const answer = towns[0]; // Arundel
  
  const distractors = towns.filter(t => t.name !== answer.name).slice(0, 3);
  const options = shuffle([answer, ...distractors]);
  const correctIndex = options.indexOf(answer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'map-reading',
    mode,
    difficulty: 'basic',
    questionText: `The map shows the position of some towns. Which town is both North of ${reference1.name} and West of ${reference2.name}?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt.name}`),
    correctAnswer: optionLabels[correctIndex],
    diagram: {
      type: 'map',
      data: { towns, highlightedTowns: [reference1.name, reference2.name] }
    },
    workedSolution: `Looking at the map with North at the top, ${answer.name} is North of ${reference1.name} and West of ${reference2.name}.`,
    category: 'statistics-probability',
  };
};

// Direction Questions
export const generateDirectionQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const directions = [
    { from: 'South-East', turn: 'left', result: 'North-East' },
    { from: 'North-East', turn: 'right', result: 'South-East' },
    { from: 'South-West', turn: 'left', result: 'North-West' },
    { from: 'North-West', turn: 'right', result: 'South-West' },
  ];
  
  const q = directions[Math.floor(Math.random() * directions.length)];
  
  const allDirections = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
  const distractors = allDirections.filter(d => d !== q.result).slice(0, 3);
  const options = shuffle([q.result, ...distractors]);
  const correctIndex = options.indexOf(q.result);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'map-reading',
    mode,
    difficulty: 'intermediate',
    questionText: `A person is driving ${q.from}. They turn ${q.turn}. What direction are they now travelling?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `When travelling ${q.from} and turning ${q.turn}, the new direction is ${q.result}.`,
    category: 'statistics-probability',
  };
};

// Enlargement Questions
export const generateEnlargementQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const originalW = Math.floor(Math.random() * 6) + 6;
  const originalH = Math.floor(Math.random() * 4) + 4;
  const scaleFactor = [2, 3, 4][Math.floor(Math.random() * 3)];
  
  const newW = originalW * scaleFactor;
  const newH = originalH * scaleFactor;
  
  // Ask for one dimension given the other
  const askForWidth = Math.random() < 0.5;
  
  if (askForWidth) {
    return {
      id: uuidv4(),
      type: 'enlargement',
      mode,
      difficulty: 'intermediate',
      questionText: `A photo is ${originalW} cm long and ${originalH} cm wide. It is enlarged so that it is now ${newH} cm wide. How long is the enlarged photo?`,
      answerFormat: 'numeric',
      correctAnswer: newW,
      workedSolution: `Scale factor = ${newH}/${originalH} = ${scaleFactor}. New length = ${originalW} × ${scaleFactor} = ${newW} cm.`,
      category: 'statistics-probability',
    };
  } else {
    return {
      id: uuidv4(),
      type: 'enlargement',
      mode,
      difficulty: 'intermediate',
      questionText: `A photo is ${originalW} cm long and ${originalH} cm wide. It is enlarged so that it is now ${newW} cm long. How wide is the enlarged photo?`,
      answerFormat: 'numeric',
      correctAnswer: newH,
      workedSolution: `Scale factor = ${newW}/${originalW} = ${scaleFactor}. New width = ${originalH} × ${scaleFactor} = ${newH} cm.`,
      category: 'statistics-probability',
    };
  }
};

// Profit/Loss Questions
export const generateProfitQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const fixedCost = Math.floor(Math.random() * 20) + 20;
  const variableCost = Math.floor(Math.random() * 5) + 3;
  const sellingPrice = Math.floor(Math.random() * 5) + 8;
  const quantity = Math.floor(Math.random() * 10) + 5;
  
  const totalCost = fixedCost + variableCost * quantity;
  const revenue = sellingPrice * quantity;
  const profit = revenue - totalCost;
  
  const distractors = generateDistractors(profit, 3);
  const options = shuffle([profit, ...distractors]);
  const correctIndex = options.indexOf(profit);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'profit',
    mode,
    difficulty: 'intermediate',
    questionText: `Items are sold for $${sellingPrice} each. The cost to make them is: Cost = $${variableCost} × quantity + $${fixedCost}. How much profit is made if ${quantity} items are sold?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  $${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Revenue = ${quantity} × $${sellingPrice} = $${revenue}. Cost = $${variableCost} × ${quantity} + $${fixedCost} = $${totalCost}. Profit = $${revenue} - $${totalCost} = $${profit}.`,
    category: 'statistics-probability',
  };
};

// Postage/Cost Table Questions
export const generatePostageQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const weights = [
    { max: 125, cost: 1.10 },
    { max: 250, cost: 1.65 },
    { max: 500, cost: 2.75 },
  ];
  
  const sheets = Math.floor(Math.random() * 40) + 20;
  const weightPerSheet = 5;
  const totalWeight = sheets * weightPerSheet;
  
  const correctCost = weights.find(w => totalWeight <= w.max)?.cost || 2.75;
  
  const distractors = weights.map(w => w.cost).filter(c => c !== correctCost).slice(0, 3);
  const options = shuffle([correctCost, ...distractors]);
  const correctIndex = options.indexOf(correctCost);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'postage',
    mode,
    difficulty: 'intermediate',
    questionText: `A sheet of paper weighs about ${weightPerSheet}g. The cost to post depends on weight:\nUp to 125g: $${weights[0].cost}\n125g-250g: $${weights[1].cost}\n250g-500g: $${weights[2].cost}\n\nWhat is the cost to post ${sheets} sheets?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  $${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Total weight = ${sheets} × ${weightPerSheet}g = ${totalWeight}g. This falls in the ${totalWeight <= 125 ? 'first' : totalWeight <= 250 ? 'second' : 'third'} bracket, costing $${correctCost}.`,
    category: 'statistics-probability',
  };
};
