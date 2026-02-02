import type { Question } from '@/types';
import { uuidv4, shuffle, generateDistractors } from '@/lib/utils';

// Perimeter Questions
export const generatePerimeterQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  // L-shape dimensions
  const outerW = Math.floor(Math.random() * 6) + 8; // 8-13
  const outerH = Math.floor(Math.random() * 5) + 6; // 6-10
  const innerW = Math.floor(Math.random() * 3) + 3; // 3-5
  const innerH = Math.floor(Math.random() * 3) + 2; // 2-4
  
  // Calculate perimeter
  const perimeter = 2 * (outerW + outerH);
  
  const distractors = generateDistractors(perimeter, 3);
  const options = shuffle([perimeter, ...distractors]);
  const correctIndex = options.indexOf(perimeter);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'perimeter',
    mode,
    difficulty: 'basic',
    questionText: `What is the perimeter of this shape?\n\nAn L-shape with outer dimensions ${outerW} cm by ${outerH} cm, with a cutout of ${innerW} cm by ${innerH} cm.`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt} cm`),
    correctAnswer: optionLabels[correctIndex],
    diagram: {
      type: 'shape',
      data: { type: 'L-shape', outerWidth: outerW, outerHeight: outerH, innerWidth: innerW, innerHeight: innerH }
    },
    workedSolution: `For an L-shape, the perimeter equals the perimeter of the bounding rectangle: 2 × (${outerW} + ${outerH}) = ${perimeter} cm.`,
    category: 'measurement-geometry',
  };
};

// Area Questions
export const generateAreaQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'triangle' : 'square';
  
  if (type === 'triangle') {
    const base = [6, 8, 10, 12, 15][Math.floor(Math.random() * 5)];
    const height = [8, 10, 12, 15][Math.floor(Math.random() * 4)];
    const area = (base * height) / 2;
    
    return {
      id: uuidv4(),
      type: 'area',
      mode,
      difficulty: 'advanced',
      questionText: `What is the area of this triangle?`,
      answerFormat: 'numeric',
      correctAnswer: area,
      diagram: {
        type: 'shape',
        data: { type: 'triangle', base, height, rightAngle: true }
      },
      workedSolution: `Area of triangle = ½ × base × height = ½ × ${base} × ${height} = ${area} square metres.`,
      category: 'measurement-geometry',
    };
  } else {
    // Square from area to perimeter
    const side = Math.floor(Math.random() * 8) + 4;
    const area = side * side;
    const perimeter = side * 4;
    
    return {
      id: uuidv4(),
      type: 'area',
      mode,
      difficulty: 'advanced',
      questionText: `The area of a square is ${area} square metres. What is the perimeter of the square?`,
      answerFormat: 'numeric',
      correctAnswer: perimeter,
      workedSolution: `Side length = √${area} = ${side} m. Perimeter = 4 × ${side} = ${perimeter} m.`,
      category: 'measurement-geometry',
    };
  }
};

// Volume Questions
export const generateVolumeQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'rectangular-prism' : 'scaling';
  
  if (type === 'rectangular-prism') {
    const length = Math.floor(Math.random() * 6) + 3;
    const width = Math.floor(Math.random() * 5) + 2;
    const volume = Math.floor(Math.random() * 100) + 50;
    const height = volume / (length * width);
    
    return {
      id: uuidv4(),
      type: 'volume',
      mode,
      difficulty: 'intermediate',
      questionText: `A rectangular prism has a volume of ${volume} cubic metres. The prism is ${length} m long and ${width} m wide. How high is it?`,
      answerFormat: 'numeric',
      correctAnswer: height,
      workedSolution: `Volume = length × width × height. So height = ${volume} ÷ (${length} × ${width}) = ${volume} ÷ ${length * width} = ${height} m.`,
      category: 'measurement-geometry',
    };
  } else {
    // Scaling question
    const originalL = Math.floor(Math.random() * 6) + 4;
    const originalW = Math.floor(Math.random() * 4) + 3;
    const originalH = Math.floor(Math.random() * 4) + 2;
    const originalVolume = originalL * originalW * originalH;
    
    const newVolume = (originalL / 2) * (originalW / 2) * (originalH * 2);
    
    return {
      id: uuidv4(),
      type: 'volume',
      mode,
      difficulty: 'advanced',
      questionText: `The volume of a rectangular prism is ${originalVolume} cm³. If the length and width are halved, but the height is doubled, what will be the volume of the new prism?`,
      answerFormat: 'numeric',
      correctAnswer: newVolume,
      workedSolution: `New volume = (${originalL}/2) × (${originalW}/2) × (${originalH}×2) = ${originalL/2} × ${originalW/2} × ${originalH*2} = ${newVolume} cm³.`,
      category: 'measurement-geometry',
    };
  }
};

// Measurement Conversion Questions
export const generateMeasurementQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'length' : 'capacity';
  
  if (type === 'length') {
    const conversions = [
      { from: 'm', to: 'mm', factor: 1000 },
      { from: 'km', to: 'm', factor: 1000 },
      { from: 'cm', to: 'mm', factor: 10 },
    ];
    const conv = conversions[Math.floor(Math.random() * conversions.length)];
    const value = Math.floor(Math.random() * 10) + 1;
    const extra = Math.floor(Math.random() * 100);
    
    const correctAnswer = value * conv.factor + extra;
    const distractors = [
      value * conv.factor,
      value + extra,
      value * 100 + extra,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'measurement',
      mode,
      difficulty: 'intermediate',
      questionText: `${value} ${conv.from} and ${extra} ${conv.to} is the same as`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt} ${conv.to}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `${value} ${conv.from} = ${value * conv.factor} ${conv.to}. Adding ${extra} ${conv.to} gives ${correctAnswer} ${conv.to}.`,
      category: 'measurement-geometry',
    };
  } else {
    // Capacity
    const litres = Math.floor(Math.random() * 5) + 1;
    const ml = Math.floor(Math.random() * 500) + 10;
    
    const correctAnswer = litres + ml / 1000;
    const distractors = [
      litres + ml / 100,
      litres * 1000 + ml,
      (litres + ml) / 1000,
    ];
    
    const options = shuffle([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'measurement',
      mode,
      difficulty: 'intermediate',
      questionText: `${litres} kilolitre${litres > 1 ? 's' : ''} and ${ml} litre${ml > 1 ? 's' : ''} is the same as`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt} kL`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `${litres} kL = ${litres} kL. ${ml} L = ${ml / 1000} kL. Total = ${litres} + ${ml / 1000} = ${correctAnswer} kL.`,
      category: 'measurement-geometry',
    };
  }
};

// Time Questions
export const generateTimeQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const startHour = Math.floor(Math.random() * 8) + 6; // 6am to 1pm
  const startMin = [15, 30, 45, 47, 12, 25][Math.floor(Math.random() * 6)];
  const durationHours = Math.floor(Math.random() * 4) + 1;
  const durationMins = [15, 25, 30, 35, 40, 45][Math.floor(Math.random() * 6)];
  
  const endHour = startHour + durationHours;
  const endMin = startMin + durationMins;
  const finalEndHour = endHour + Math.floor(endMin / 60);
  const finalEndMin = endMin % 60;
  
  // Format for 12-hour clock
  const formatHour = (h: number) => h <= 12 ? h : h - 12;
  const ampm = finalEndHour < 12 ? 'am' : 'pm';
  
  const correctAnswer = `${durationHours} h ${durationMins} min`;
  const distractors = [
    `${durationHours + 1} h ${durationMins} min`,
    `${durationHours} h ${durationMins + 10} min`,
    `${durationHours - 1} h ${durationMins} min`,
  ];
  
  const options = shuffle([correctAnswer, ...distractors]);
  const correctIndex = options.indexOf(correctAnswer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'time',
    mode,
    difficulty: 'intermediate',
    questionText: `How many hours and minutes are between ${startHour}:${startMin.toString().padStart(2, '0')} am and ${formatHour(finalEndHour)}:${finalEndMin.toString().padStart(2, '0')} ${ampm} on the same day?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `From ${startHour}:${startMin.toString().padStart(2, '0')} to ${formatHour(finalEndHour)}:${finalEndMin.toString().padStart(2, '0')} is ${durationHours} hours and ${durationMins} minutes.`,
    category: 'measurement-geometry',
  };
};

// Temperature Questions
export const generateTemperatureQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const startTemp = -(Math.floor(Math.random() * 15) + 5); // -5 to -20
  const change = Math.floor(Math.random() * 10) + 3;
  const direction = Math.random() < 0.5 ? 'warmer' : 'colder';
  
  const finalTemp = direction === 'warmer' ? startTemp + change : startTemp - change;
  
  return {
    id: uuidv4(),
    type: 'temperature',
    mode,
    difficulty: 'advanced',
    questionText: `The temperature at 6 am was ${startTemp}°C. It was ${change}°C ${direction} at 8 am.\n\nWhat was the temperature at 8 am?`,
    answerFormat: 'numeric',
    correctAnswer: finalTemp,
    workedSolution: `${startTemp}°C ${direction === 'warmer' ? '+' : '-'} ${change}°C = ${finalTemp}°C.`,
    category: 'measurement-geometry',
  };
};

// Speed/Distance/Time Questions
export const generateSpeedQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const type = Math.random() < 0.5 ? 'speed' : 'distance';
  
  if (type === 'speed') {
    const distance = Math.floor(Math.random() * 20) + 10;
    const time = Math.floor(Math.random() * 5) + 2;
    const speed = distance / time;
    
    const distractors = generateDistractors(Math.floor(speed), 3);
    const options = shuffle([Math.floor(speed), ...distractors]);
    const correctIndex = options.indexOf(Math.floor(speed));
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    return {
      id: uuidv4(),
      type: 'speed',
      mode,
      difficulty: 'basic',
      questionText: `Brandon travelled ${distance} metres in ${time} seconds. What is his average speed in metres per second?`,
      answerFormat: 'multiple-choice',
      options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
      correctAnswer: optionLabels[correctIndex],
      workedSolution: `Speed = distance ÷ time = ${distance} ÷ ${time} = ${speed} m/s.`,
      category: 'measurement-geometry',
    };
  } else {
    const speed = Math.floor(Math.random() * 50) + 100; // km/h
    const time = Math.floor(Math.random() * 10) + 5; // minutes
    const distance = (speed * time) / 60;
    
    return {
      id: uuidv4(),
      type: 'speed',
      mode,
      difficulty: 'intermediate',
      questionText: `On a racetrack, a car drove at an average speed of ${speed} kilometres per hour. If it drove for ${time} minutes, what distance did it travel?`,
      answerFormat: 'numeric',
      correctAnswer: Math.round(distance),
      workedSolution: `Distance = speed × time = ${speed} × (${time}/60) = ${Math.round(distance)} km.`,
      category: 'measurement-geometry',
    };
  }
};

// 3D Shape Views
export const generate3DViewQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const views = ['top', 'front', 'side', 'back'];
  const targetView = views[Math.floor(Math.random() * views.length)];
  
  // Simple block configuration
  const blocks = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ];
  
  const correctAnswer = targetView === 'top' ? 'A' : targetView === 'front' ? 'B' : 'C';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'views',
    mode,
    difficulty: 'intermediate',
    questionText: `A 3D object is made using identical cubes. What is the view from the ${targetView}?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  [View ${opt}]`),
    correctAnswer,
    diagram: {
      type: '3d-view',
      data: { view: targetView, blocks }
    },
    workedSolution: `Looking from the ${targetView}, you would see the cubes arranged in a specific pattern.`,
    category: 'measurement-geometry',
  };
};

// Net Questions
export const generateNetQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const shapes = ['triangular-prism', 'cube', 'square-pyramid'];
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  
  const correctAnswer = 'A';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'nets',
    mode,
    difficulty: 'basic',
    questionText: `Which is the net of a ${targetShape.replace('-', ' ')}?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  [Net ${opt}]`),
    correctAnswer,
    diagram: {
      type: 'net',
      data: { shape: targetShape }
    },
    workedSolution: `A ${targetShape.replace('-', ' ')} has a specific net pattern with the correct number and arrangement of faces.`,
    category: 'measurement-geometry',
  };
};

// Rotation Questions
export const generateRotationQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const shapes = ['L', 'T', 'cross', 'arrow'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const rotations = [90, 180, 270];
  const rotation = rotations[Math.floor(Math.random() * rotations.length)];
  const direction = Math.random() < 0.5 ? 'clockwise' : 'anticlockwise';
  
  const correctAnswer = 'D';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'rotation',
    mode,
    difficulty: 'basic',
    questionText: `This shape turns about the dot in its centre. What does it look like after a ${rotation === 90 ? 'quarter' : rotation === 180 ? 'half' : 'three-quarter'} turn in a ${direction} direction?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  [Option ${opt}]`),
    correctAnswer,
    diagram: {
      type: 'rotation',
      data: { shape, rotation, direction }
    },
    workedSolution: `After a ${rotation}° ${direction} rotation, the shape will be oriented differently.`,
    category: 'measurement-geometry',
  };
};

// Transformation Questions
export const generateTransformationQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const correctAnswer = 'B';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'transformations',
    mode,
    difficulty: 'basic',
    questionText: `A shape is drawn on a grid. It is then halved in height and doubled in width. What does the shape look like now?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  [Shape ${opt}]`),
    correctAnswer,
    workedSolution: `When a shape is halved in height and doubled in width, it becomes shorter and wider.`,
    category: 'measurement-geometry',
  };
};

// Coordinates Questions
export const generateCoordinatesQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const x1 = Math.floor(Math.random() * 4) + 1;
  const y1 = Math.floor(Math.random() * 4) + 1;
  const x2 = x1 + 3;
  const y2 = y1 + 2;
  const x3 = x1;
  const y3 = y2;
  const x4 = x2;
  const y4 = y1;
  
  const correctAnswer = `(${x4}, ${y4})`;
  const distractors = [
    `(${x4 + 1}, ${y4})`,
    `(${x4}, ${y4 + 1})`,
    `(${x2}, ${y2})`,
  ];
  
  const options = shuffle([correctAnswer, ...distractors]);
  const correctIndex = options.indexOf(correctAnswer);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'coordinates',
    mode,
    difficulty: 'intermediate',
    questionText: `A rectangle is being drawn on a grid. Two corners are at (${x1}, ${y1}) and (${x2}, ${y2}). Another corner is at (${x3}, ${y3}). Where is the fourth corner?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    diagram: {
      type: 'coordinates',
      data: { points: [[x1, y1], [x2, y2], [x3, y3]] }
    },
    workedSolution: `For a rectangle, opposite corners share coordinates. The fourth corner is at (${x4}, ${y4}).`,
    category: 'measurement-geometry',
  };
};

// Angle Questions
export const generateAngleQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const angles = [30, 45, 60, 90, 120, 135, 150];
  const targetAngle = angles[Math.floor(Math.random() * angles.length)];
  
  const correctAnswer = 'B';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'angles',
    mode,
    difficulty: 'intermediate',
    questionText: `Which shows an angle of about ${targetAngle}°?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  [Angle ${opt}]`),
    correctAnswer,
    diagram: {
      type: 'protractor',
      data: { angle: targetAngle }
    },
    workedSolution: `An angle of ${targetAngle}° is ${targetAngle < 90 ? 'acute' : targetAngle === 90 ? 'a right angle' : targetAngle < 180 ? 'obtuse' : 'a straight angle'}.`,
    category: 'measurement-geometry',
  };
};

// Scale Questions
export const generateScaleQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const scale = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
  const mapDistance = parseFloat((Math.random() * 5 + 1).toFixed(1));
  const actualDistance = mapDistance * scale;
  
  const distractors = generateDistractors(Math.floor(actualDistance), 3);
  const options = shuffle([Math.floor(actualDistance), ...distractors]);
  const correctIndex = options.indexOf(Math.floor(actualDistance));
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'scale',
    mode,
    difficulty: 'intermediate',
    questionText: `On a map, 1 cm represents ${scale} km. Two places are ${mapDistance} cm apart on the map. What is the actual distance between the two places?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt} km`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Actual distance = map distance × scale = ${mapDistance} × ${scale} = ${actualDistance} km.`,
    category: 'measurement-geometry',
  };
};

// Polygon Questions
export const generatePolygonQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const angleSize = 150;
  
  const polygons = [
    { name: 'pentagon', sides: 5, angle: 108 },
    { name: 'hexagon', sides: 6, angle: 120 },
    { name: 'octagon', sides: 8, angle: 135 },
    { name: 'decagon', sides: 10, angle: 144 },
    { name: 'dodecagon', sides: 12, angle: 150 },
  ];
  
  const polygon = polygons.find(p => p.angle === angleSize) || polygons[4];
  
  const options = ['pentagon', 'hexagon', 'decagon', 'dodecagon'];
  const correctIndex = options.indexOf(polygon.name);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'polygon',
    mode,
    difficulty: 'advanced',
    questionText: `A polygon has each of its angles equal to ${angleSize}°. What type of polygon is it?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Interior angle = (n-2) × 180° / n. For ${angleSize}°: ${angleSize} = (n-2) × 180 / n. Solving gives n = ${polygon.sides}, which is a ${polygon.name}.`,
    category: 'measurement-geometry',
  };
};

// Isosceles Triangle Questions
export const generateIsoscelesQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  // Generate a valid isosceles triangle with two equal angles
  const equalAngle = Math.floor(Math.random() * 40) + 40; // 40-79
  const thirdAngle = 180 - equalAngle * 2;
  
  const correctAnswer = 'C';
  const options = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'isosceles',
    mode,
    difficulty: 'intermediate',
    questionText: `Which of these is an isosceles triangle?`,
    answerFormat: 'multiple-choice',
    options: options.map(opt => `${opt}  Triangle with angles ${equalAngle}°, ${equalAngle}°, ${thirdAngle}°`),
    correctAnswer,
    workedSolution: `An isosceles triangle has two equal angles. The triangle with angles ${equalAngle}°, ${equalAngle}°, ${thirdAngle}° has two equal angles.`,
    category: 'measurement-geometry',
  };
};

// Symmetry Questions
export const generateSymmetryQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const shapes = [
    { name: 'regular octagon', lines: 8 },
    { name: 'regular hexagon', lines: 6 },
    { name: 'square', lines: 4 },
    { name: 'equilateral triangle', lines: 3 },
  ];
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  const distractors = generateDistractors(shape.lines, 3);
  const options = shuffle([shape.lines, ...distractors]);
  const correctIndex = options.indexOf(shape.lines);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'symmetry',
    mode,
    difficulty: 'basic',
    questionText: `How many lines of symmetry does a ${shape.name} have?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `A ${shape.name} has ${shape.lines} lines of symmetry.`,
    category: 'measurement-geometry',
  };
};

// Surface Area Questions
export const generateSurfaceAreaQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const side = Math.floor(Math.random() * 4) + 5;
  const surfaceArea = 6 * side * side;
  
  return {
    id: uuidv4(),
    type: 'geometry',
    mode,
    difficulty: 'advanced',
    questionText: `A cube has sides of length ${side} cm. What is the total area of all the surfaces?`,
    answerFormat: 'numeric',
    correctAnswer: surfaceArea,
    workedSolution: `A cube has 6 faces. Each face has area ${side} × ${side} = ${side * side} cm². Total surface area = 6 × ${side * side} = ${surfaceArea} cm².`,
    category: 'measurement-geometry',
  };
};

// Best Buy Questions
export const generateBestBuyQuestion = (mode: 'non-calculator' | 'calculator'): Question => {
  const options = [
    { size: 750, unit: 'mL', price: 1.50 },
    { size: 2000, unit: 'mL', price: 3.20 },
    { size: 3000, unit: 'mL', price: 4.95 },
    { size: 5000, unit: 'mL', price: 8.50 },
  ];
  
  // Calculate price per unit
  const withUnitPrice = options.map(o => ({
    ...o,
    unitPrice: o.price / (o.size / 1000),
  }));
  
  const best = withUnitPrice.reduce((min, curr) => curr.unitPrice < min.unitPrice ? curr : min);
  
  const correctIndex = options.findIndex(o => o.size === best.size);
  const optionLabels = ['A', 'B', 'C', 'D'];
  
  return {
    id: uuidv4(),
    type: 'geometry',
    mode,
    difficulty: 'intermediate',
    questionText: `Which is the best buy?`,
    answerFormat: 'multiple-choice',
    options: options.map((opt, i) => `${optionLabels[i]}  ${opt.size} ${opt.unit} for $${opt.price.toFixed(2)}`),
    correctAnswer: optionLabels[correctIndex],
    workedSolution: `Calculate price per litre: A: $${(options[0].price / 0.75).toFixed(2)}/L, B: $${(options[1].price / 2).toFixed(2)}/L, C: $${(options[2].price / 3).toFixed(2)}/L, D: $${(options[3].price / 5).toFixed(2)}/L. Option ${optionLabels[correctIndex]} is cheapest per litre.`,
    category: 'measurement-geometry',
  };
};
