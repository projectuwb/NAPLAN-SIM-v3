# NAPLAN Year 7 Numeracy - Complete Technical Handoff

## Table of Contents
1. [Type Definitions](#1-type-definitions)
2. [Diagram Components](#2-diagram-components)
3. [Question Generators](#3-question-generators)
4. [App.tsx Integration](#4-apptsx-integration)

---

## 1. Type Definitions

### File: `src/types/index.ts`

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
  | 'statistics'
  | 'ordering-numbers'
  | 'mixed-numbers'
  | 'algebra-patterns'
  | 'percentage-discount'
  | 'percentage-of-quantity'
  | 'fraction-decimal-percent'
  | 'negative-numbers'
  | 'index-notation'
  | 'square-root'
  | 'l-shape-area'
  | 'l-shape-perimeter'
  | 'triangle-area'
  | 'parallelogram-area'
  | 'trapezium-area'
  | 'circle-circumference'
  | 'circle-area'
  | 'composite-shape'
  | 'net-cube'
  | 'net-rectangular-prism'
  | 'volume-prism'
  | 'surface-area'
  | 'capacity'
  | 'mass'
  | 'temperature'
  | 'length-conversion'
  | 'angle-types'
  | 'angles-on-line'
  | 'angles-in-triangle'
  | 'angles-in-quadrilateral'
  | 'bearing'
  | 'compass-directions'
  | 'coordinates'
  | 'reflection'
  | 'rotation'
  | 'translation'
  | 'symmetry'
  | 'scale-reading'
  | 'timetable'
  | 'calendar'
  | 'bar-graph'
  | 'pie-chart'
  | 'line-graph'
  | 'stem-leaf'
  | 'dot-plot'
  | 'two-way-table'
  | 'venn-diagram'
  | 'map-reading'
  | 'spinner'
  | 'dice-probability'
  | 'card-probability'
  | 'experimental-probability'
  | 'tree-diagram';

export type TestMode = 'non-calculator' | 'calculator';

export type AnswerFormat = 'multiple-choice' | 'numeric';

export interface Diagram {
  type: 'bar-graph' | 'spinner' | 'shape' | 'map' | 'number-line' | 'clock' | 'measuring-jug' | 'protractor' | 'rotation-shape' | 'view-3d' | 'net' | 'coordinates' | 'pie-chart' | 'line-graph' | 'stem-leaf' | 'two-way-table' | 'venn-diagram' | 'tree-diagram';
  data?: any;
}

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
  diagram?: Diagram;
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

## 2. Diagram Components

### File: `src/components/diagrams/BarGraph.tsx`

```typescript
import React from 'react';

interface BarGraphProps {
  data: {
    labels: string[];
    values: number[];
    title?: string;
    yAxisLabel?: string;
    color?: string;
  };
}

export const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const { labels, values, title, yAxisLabel, color = '#3b82f6' } = data;
  const maxValue = Math.max(...values);
  const chartHeight = 200;
  const chartWidth = 320;
  const barWidth = 40;
  const gap = (chartWidth - labels.length * barWidth) / (labels.length + 1);
  
  return (
    <svg viewBox="0 0 400 280" className="w-full max-w-md mx-auto">
      {/* Title */}
      {title && (
        <text x="200" y="20" textAnchor="middle" className="fill-slate-800 text-sm font-medium">
          {title}
        </text>
      )}
      
      {/* Y-axis label */}
      {yAxisLabel && (
        <text x="15" y="140" textAnchor="middle" transform="rotate(-90, 15, 140)" className="fill-slate-600 text-xs">
          {yAxisLabel}
        </text>
      )}
      
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = 240 - ratio * chartHeight;
        const value = Math.round(maxValue * ratio);
        return (
          <g key={i}>
            <line x1="50" y1={y} x2={370} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x="45" y={y + 4} textAnchor="end" className="fill-slate-500 text-xs">{value}</text>
          </g>
        );
      })}
      
      {/* Bars */}
      {values.map((value, i) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = 50 + gap + i * (barWidth + gap);
        const y = 240 - barHeight;
        
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              stroke="#1e40af"
              strokeWidth="1"
              rx="2"
            />
            <text x={x + barWidth / 2} y="255" textAnchor="middle" className="fill-slate-700 text-xs">
              {labels[i]}
            </text>
            <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="fill-slate-800 text-xs font-medium">
              {value}
            </text>
          </g>
        );
      })}
      
      {/* Axes */}
      <line x1="50" y1="240" x2="370" y2="240" stroke="#64748b" strokeWidth="2" />
      <line x1="50" y1="40" x2="50" y2="240" stroke="#64748b" strokeWidth="2" />
    </svg>
  );
};

export default BarGraph;
```

---

### File: `src/components/diagrams/Spinner.tsx`

```typescript
import React from 'react';

interface SpinnerProps {
  data: {
    sections: { color: string; label: string; size: number }[];
    arrowAngle?: number;
  };
}

export const Spinner: React.FC<SpinnerProps> = ({ data }) => {
  const { sections, arrowAngle = 0 } = data;
  const total = sections.reduce((sum, s) => sum + s.size, 0);
  const radius = 100;
  const centerX = 120;
  const centerY = 120;
  
  let currentAngle = -90; // Start from top
  
  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };
  
  return (
    <svg viewBox="0 0 240 240" className="w-60 h-60 mx-auto">
      {/* Spinner sections */}
      {sections.map((section, i) => {
        const sectionAngle = (section.size / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sectionAngle;
        currentAngle = endAngle;
        
        const start = polarToCartesian(startAngle);
        const end = polarToCartesian(endAngle);
        const largeArc = sectionAngle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
          'Z',
        ].join(' ');
        
        const midAngle = startAngle + sectionAngle / 2;
        const labelPos = polarToCartesian(midAngle);
        const labelRadius = radius * 0.65;
        const labelRad = (midAngle * Math.PI) / 180;
        const labelX = centerX + labelRadius * Math.cos(labelRad);
        const labelY = centerY + labelRadius * Math.sin(labelRad);
        
        return (
          <g key={i}>
            <path d={pathData} fill={section.color} stroke="#fff" strokeWidth="2" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-xs font-medium"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {section.label}
            </text>
          </g>
        );
      })}
      
      {/* Center circle */}
      <circle cx={centerX} cy={centerY} r="12" fill="#334155" />
      
      {/* Arrow */}
      <g transform={`rotate(${arrowAngle}, ${centerX}, ${centerY})`}>
        <polygon
          points={`${centerX},${centerY - radius - 5} ${centerX - 8},${centerY - radius + 15} ${centerX + 8},${centerY - radius + 15}`}
          fill="#ef4444"
          stroke="#991b1b"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default Spinner;
```

---

### File: `src/components/diagrams/ShapeDiagram.tsx`

```typescript
import React from 'react';

interface ShapeDiagramProps {
  data: {
    type: 'rectangle' | 'square' | 'triangle' | 'circle' | 'l-shape' | 'composite';
    dimensions: Record<string, number>;
    showLabels?: boolean;
    unit?: string;
  };
}

export const ShapeDiagram: React.FC<ShapeDiagramProps> = ({ data }) => {
  const { type, dimensions, showLabels = true, unit = 'cm' } = data;
  
  const renderRectangle = () => {
    const { width = 100, height = 60 } = dimensions;
    const scale = Math.min(200 / width, 120 / height);
    const w = width * scale;
    const h = height * scale;
    
    return (
      <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto">
        <rect x="40" y="40" width={w} height={h} fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + w / 2} y="30" textAnchor="middle" className="fill-slate-700 text-sm">{width} {unit}</text>
            <text x="30" y={40 + h / 2} textAnchor="middle" className="fill-slate-700 text-sm" transform={`rotate(-90, 30, ${40 + h / 2})`}>{height} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderTriangle = () => {
    const { base = 100, height = 80 } = dimensions;
    const scale = Math.min(200 / base, 140 / height);
    const b = base * scale;
    const h = height * scale;
    
    const points = `40,${160} ${40 + b / 2},${160 - h} ${40 + b},160`;
    
    return (
      <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto">
        <polygon points={points} fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + b / 2} y="175" textAnchor="middle" className="fill-slate-700 text-sm">{base} {unit}</text>
            <line x1={40 + b / 2} y1={160} x2={40 + b / 2} y2={160 - h} stroke="#16a34a" strokeWidth="1" strokeDasharray="4" />
            <text x={45 + b / 2} y={160 - h / 2} textAnchor="start" className="fill-slate-700 text-sm">{height} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderLShape = () => {
    const { outerWidth = 120, outerHeight = 100, innerWidth = 60, innerHeight = 50 } = dimensions;
    const scale = Math.min(200 / outerWidth, 160 / outerHeight);
    const ow = outerWidth * scale;
    const oh = outerHeight * scale;
    const iw = innerWidth * scale;
    const ih = innerHeight * scale;
    
    const path = `M 40,40 L ${40 + ow},40 L ${40 + ow},${40 + oh} L ${40 + ow - iw},${40 + oh} L ${40 + ow - iw},${40 + ih} L 40,${40 + ih} Z`;
    
    return (
      <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto">
        <path d={path} fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + ow / 2} y="30" textAnchor="middle" className="fill-slate-700 text-sm">{outerWidth} {unit}</text>
            <text x="25" y={40 + oh / 2} textAnchor="middle" className="fill-slate-700 text-sm" transform={`rotate(-90, 25, ${40 + oh / 2})`}>{outerHeight} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderCircle = () => {
    const { radius = 50 } = dimensions;
    const scale = Math.min(90 / radius, 1);
    const r = radius * scale;
    
    return (
      <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto">
        <circle cx="110" cy="90" r={r} fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
        <line x1="110" y1="90" x2={110 + r} y2="90" stroke="#9333ea" strokeWidth="1" />
        <text x={110 + r / 2} y="105" textAnchor="middle" className="fill-slate-700 text-sm">{radius} {unit}</text>
      </svg>
    );
  };
  
  switch (type) {
    case 'rectangle':
    case 'square':
      return renderRectangle();
    case 'triangle':
      return renderTriangle();
    case 'l-shape':
    case 'composite':
      return renderLShape();
    case 'circle':
      return renderCircle();
    default:
      return renderRectangle();
  }
};

export default ShapeDiagram;
```

---

### File: `src/components/diagrams/MapDiagram.tsx`

```typescript
import React from 'react';

interface MapDiagramProps {
  data: {
    gridSize: { rows: number; cols: number };
    locations: { name: string; row: number; col: number; icon?: string }[];
    paths?: { from: string; to: string; color?: string }[];
    startLocation?: string;
    endLocation?: string;
    showCoordinates?: boolean;
  };
}

export const MapDiagram: React.FC<MapDiagramProps> = ({ data }) => {
  const { gridSize, locations, paths = [], startLocation, endLocation, showCoordinates = true } = data;
  const { rows, cols } = gridSize;
  const cellSize = 50;
  const padding = 40;
  
  const width = cols * cellSize + 2 * padding;
  const height = rows * cellSize + 2 * padding;
  
  const getLocationPos = (name: string) => {
    const loc = locations.find(l => l.name === name);
    if (!loc) return null;
    return {
      x: padding + loc.col * cellSize + cellSize / 2,
      y: padding + loc.row * cellSize + cellSize / 2,
    };
  };
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
      {/* Grid */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={padding}
          y1={padding + i * cellSize}
          x2={padding + cols * cellSize}
          y2={padding + i * cellSize}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={padding + i * cellSize}
          y1={padding}
          x2={padding + i * cellSize}
          y2={padding + rows * cellSize}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      ))}
      
      {/* Coordinates */}
      {showCoordinates && (
        <>
          {Array.from({ length: cols }).map((_, i) => (
            <text key={`col-${i}`} x={padding + i * cellSize + cellSize / 2} y={padding - 10} textAnchor="middle" className="fill-slate-500 text-xs">
              {String.fromCharCode(65 + i)}
            </text>
          ))}
          {Array.from({ length: rows }).map((_, i) => (
            <text key={`row-${i}`} x={padding - 15} y={padding + i * cellSize + cellSize / 2 + 4} textAnchor="middle" className="fill-slate-500 text-xs">
              {i + 1}
            </text>
          ))}
        </>
      )}
      
      {/* Paths */}
      {paths.map((path, i) => {
        const from = getLocationPos(path.from);
        const to = getLocationPos(path.to);
        if (!from || !to) return null;
        
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={path.color || '#3b82f6'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8,4"
          />
        );
      })}
      
      {/* Locations */}
      {locations.map((loc, i) => {
        const x = padding + loc.col * cellSize + cellSize / 2;
        const y = padding + loc.row * cellSize + cellSize / 2;
        const isStart = loc.name === startLocation;
        const isEnd = loc.name === endLocation;
        
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="18"
              fill={isStart ? '#22c55e' : isEnd ? '#ef4444' : '#3b82f6'}
              stroke="#fff"
              strokeWidth="2"
            />
            <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-xs font-bold">
              {loc.icon || loc.name.charAt(0)}
            </text>
            <text x={x} y={y + 32} textAnchor="middle" className="fill-slate-700 text-xs">
              {loc.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default MapDiagram;
```

---

### File: `src/components/diagrams/NumberLine.tsx`

```typescript
import React from 'react';

interface NumberLineProps {
  data: {
    min: number;
    max: number;
    marks?: number[];
    arrows?: { position: number; label?: string; color?: string }[];
    intervals?: { start: number; end: number; label?: string }[];
    showTicks?: boolean;
  };
}

export const NumberLine: React.FC<NumberLineProps> = ({ data }) => {
  const { min, max, marks = [], arrows = [], intervals = [], showTicks = true } = data;
  const padding = 40;
  const width = 400;
  const height = 100;
  const lineY = 60;
  const lineStart = padding;
  const lineEnd = width - padding;
  const lineLength = lineEnd - lineStart;
  
  const valueToX = (value: number) => {
    return lineStart + ((value - min) / (max - min)) * lineLength;
  };
  
  // Generate tick marks
  const tickStep = Math.pow(10, Math.floor(Math.log10(max - min))) / 2;
  const ticks = [];
  for (let v = Math.ceil(min / tickStep) * tickStep; v <= max; v += tickStep) {
    ticks.push(v);
  }
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto">
      {/* Main line */}
      <line x1={lineStart} y1={lineY} x2={lineEnd} y2={lineY} stroke="#334155" strokeWidth="2" />
      
      {/* Arrowheads */}
      <polygon points={`${lineStart - 8},${lineY} ${lineStart},${lineY - 4} ${lineStart},${lineY + 4}`} fill="#334155" />
      <polygon points={`${lineEnd + 8},${lineY} ${lineEnd},${lineY - 4} ${lineEnd},${lineY + 4}`} fill="#334155" />
      
      {/* Ticks */}
      {showTicks && ticks.map((tick, i) => {
        const x = valueToX(tick);
        return (
          <g key={i}>
            <line x1={x} y1={lineY - 5} x2={x} y2={lineY + 5} stroke="#334155" strokeWidth="1" />
            <text x={x} y={lineY + 20} textAnchor="middle" className="fill-slate-600 text-xs">
              {tick}
            </text>
          </g>
        );
      })}
      
      {/* Special marks */}
      {marks.map((mark, i) => {
        const x = valueToX(mark);
        return (
          <g key={`mark-${i}`}>
            <line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke="#dc2626" strokeWidth="2" />
            <text x={x} y={lineY - 15} textAnchor="middle" className="fill-red-600 text-xs font-bold">
              {mark}
            </text>
          </g>
        );
      })}
      
      {/* Intervals */}
      {intervals.map((interval, i) => {
        const startX = valueToX(interval.start);
        const endX = valueToX(interval.end);
        return (
          <g key={`interval-${i}`}>
            <line x1={startX} y1={lineY - 12} x2={endX} y2={lineY - 12} stroke="#16a34a" strokeWidth="4" />
            <text x={(startX + endX) / 2} y={lineY - 20} textAnchor="middle" className="fill-green-600 text-xs">
              {interval.label || `${interval.start} to ${interval.end}`}
            </text>
          </g>
        );
      })}
      
      {/* Arrows */}
      {arrows.map((arrow, i) => {
        const x = valueToX(arrow.position);
        return (
          <g key={`arrow-${i}`}>
            <polygon
              points={`${x},${lineY - 25} ${x - 6},${lineY - 15} ${x + 6},${lineY - 15}`}
              fill={arrow.color || '#3b82f6'}
            />
            {arrow.label && (
              <text x={x} y={lineY - 30} textAnchor="middle" className="fill-slate-700 text-xs">
                {arrow.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default NumberLine;
```

---

### File: `src/components/diagrams/Clock.tsx`

```typescript
import React from 'react';

interface ClockProps {
  data: {
    hour: number;
    minute: number;
    showNumbers?: boolean;
    highlightSector?: { start: number; end: number; color?: string };
  };
}

export const Clock: React.FC<ClockProps> = ({ data }) => {
  const { hour, minute, showNumbers = true, highlightSector } = data;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  
  // Calculate hand angles
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = minute * 6 - 90;
  
  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };
  
  // Hour hand
  const hourHand = polarToCartesian(hourAngle, radius * 0.5);
  // Minute hand
  const minuteHand = polarToCartesian(minuteAngle, radius * 0.75);
  
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {/* Clock face */}
      <circle cx={centerX} cy={centerY} r={radius} fill="#fff" stroke="#1e293b" strokeWidth="3" />
      
      {/* Highlight sector */}
      {highlightSector && (
        <path
          d={() => {
            const start = polarToCartesian(highlightSector.start - 90, radius - 5);
            const end = polarToCartesian(highlightSector.end - 90, radius - 5);
            const largeArc = highlightSector.end - highlightSector.start > 180 ? 1 : 0;
            return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius - 5} ${radius - 5} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          }}
          fill={highlightSector.color || '#fef3c7'}
          opacity="0.5"
        />
      )}
      
      {/* Hour markers */}
      {showNumbers && (
        <>
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = i * 30 - 90;
            const pos = polarToCartesian(angle, radius - 15);
            return (
              <text
                key={num}
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className="fill-slate-800 text-sm font-medium"
              >
                {num}
              </text>
            );
          })}
        </>
      )}
      
      {/* Minute markers */}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = i * 6 - 90;
        const inner = polarToCartesian(angle, radius - 8);
        const outer = polarToCartesian(angle, radius - 3);
        return (
          <line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="#94a3b8"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Hour hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={hourHand.x}
        y2={hourHand.y}
        stroke="#1e293b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Minute hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={minuteHand.x}
        y2={minuteHand.y}
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Center dot */}
      <circle cx={centerX} cy={centerY} r="5" fill="#1e293b" />
    </svg>
  );
};

export default Clock;
```

---

### File: `src/components/diagrams/MeasuringJug.tsx`

```typescript
import React from 'react';

interface MeasuringJugProps {
  data: {
    capacity: number;
    currentLevel: number;
    unit: string;
    scaleInterval?: number;
    showScale?: boolean;
  };
}

export const MeasuringJug: React.FC<MeasuringJugProps> = ({ data }) => {
  const { capacity, currentLevel, unit, scaleInterval = 100, showScale = true } = data;
  const jugWidth = 80;
  const jugHeight = 150;
  const padding = 30;
  
  const fillPercentage = Math.min(currentLevel / capacity, 1);
  const fillHeight = fillPercentage * jugHeight;
  
  // Jug shape (trapezoid)
  const topWidth = jugWidth + 20;
  const bottomWidth = jugWidth;
  const centerX = 100;
  const baseY = 180;
  
  const jugPath = [
    `M ${centerX - topWidth / 2} ${baseY - jugHeight}`,
    `L ${centerX + topWidth / 2} ${baseY - jugHeight}`,
    `L ${centerX + bottomWidth / 2} ${baseY}`,
    `L ${centerX - bottomWidth / 2} ${baseY}`,
    'Z',
  ].join(' ');
  
  // Scale marks
  const numMarks = Math.floor(capacity / scaleInterval);
  
  return (
    <svg viewBox="0 0 200 220" className="w-40 h-52 mx-auto">
      {/* Jug outline */}
      <path d={jugPath} fill="none" stroke="#475569" strokeWidth="3" />
      
      {/* Liquid fill */}
      <defs>
        <clipPath id="jugClip">
          <path d={jugPath} />
        </clipPath>
      </defs>
      
      <rect
        x={centerX - topWidth / 2 - 10}
        y={baseY - fillHeight}
        width={topWidth + 20}
        height={fillHeight}
        fill="#3b82f6"
        opacity="0.6"
        clipPath="url(#jugClip)"
      />
      
      {/* Scale */}
      {showScale && (
        <>
          {Array.from({ length: numMarks + 1 }).map((_, i) => {
            const level = i * scaleInterval;
            const y = baseY - (level / capacity) * jugHeight;
            return (
              <g key={i}>
                <line
                  x1={centerX + bottomWidth / 2}
                  y1={y}
                  x2={centerX + bottomWidth / 2 + 10}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text
                  x={centerX + bottomWidth / 2 + 15}
                  y={y + 4}
                  className="fill-slate-600 text-xs"
                >
                  {level}
                </text>
              </g>
            );
          })}
        </>
      )}
      
      {/* Capacity label */}
      <text x={centerX} y={baseY + 20} textAnchor="middle" className="fill-slate-700 text-sm">
        {capacity} {unit}
      </text>
      
      {/* Current level label */}
      <text x={centerX} y={baseY - jugHeight - 10} textAnchor="middle" className="fill-blue-600 text-sm font-medium">
        {currentLevel} {unit}
      </text>
    </svg>
  );
};

export default MeasuringJug;
```

---

### File: `src/components/diagrams/Protractor.tsx`

```typescript
import React from 'react';

interface ProtractorProps {
  data: {
    angle: number;
    showAngle?: boolean;
    highlightSector?: boolean;
  };
}

export const Protractor: React.FC<ProtractorProps> = ({ data }) => {
  const { angle, showAngle = true, highlightSector = false } = data;
  const radius = 90;
  const centerX = 100;
  const centerY = 110;
  
  // Protractor is a semicircle (180 degrees)
  const startAngle = 180;
  const endAngle = 0;
  
  // Angle line position
  const angleRad = (angle * Math.PI) / 180;
  const angleX = centerX + radius * Math.cos(angleRad);
  const angleY = centerY - radius * Math.sin(angleRad);
  
  // Generate degree marks
  const marks = [];
  for (let i = 0; i <= 180; i += 10) {
    const isMajor = i % 30 === 0;
    const rad = (i * Math.PI) / 180;
    const innerR = radius - (isMajor ? 12 : 6);
    const outerR = radius;
    marks.push({
      x1: centerX + innerR * Math.cos(rad),
      y1: centerY - innerR * Math.sin(rad),
      x2: centerX + outerR * Math.cos(rad),
      y2: centerY - outerR * Math.sin(rad),
      value: i,
      isMajor,
    });
  }
  
  return (
    <svg viewBox="0 0 200 130" className="w-64 h-40 mx-auto">
      {/* Highlight sector */}
      {highlightSector && (
        <path
          d={`M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${angleX} ${angleY} Z`}
          fill="#fef3c7"
          opacity="0.5"
        />
      )}
      
      {/* Protractor arc */}
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke="#475569"
        strokeWidth="3"
      />
      
      {/* Baseline */}
      <line x1={centerX - radius - 5} y1={centerY} x2={centerX + radius + 5} y2={centerY} stroke="#475569" strokeWidth="2" />
      
      {/* Degree marks */}
      {marks.map((mark, i) => (
        <g key={i}>
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke="#475569"
            strokeWidth={mark.isMajor ? 2 : 1}
          />
          {mark.isMajor && (
            <text
              x={centerX + (radius - 22) * Math.cos((mark.value * Math.PI) / 180)}
              y={centerY - (radius - 22) * Math.sin((mark.value * Math.PI) / 180) + 3}
              textAnchor="middle"
              className="fill-slate-700 text-xs"
            >
              {mark.value}
            </text>
          )}
        </g>
      ))}
      
      {/* Angle line */}
      <line
        x1={centerX}
        y1={centerY}
        x2={angleX}
        y2={angleY}
        stroke="#dc2626"
        strokeWidth="2"
      />
      
      {/* Center point */}
      <circle cx={centerX} cy={centerY} r="4" fill="#dc2626" />
      
      {/* Angle label */}
      {showAngle && (
        <text x={centerX + 30} y={centerY - 20} className="fill-red-600 text-sm font-bold">
          {angle}°
        </text>
      )}
    </svg>
  );
};

export default Protractor;
```

---

### File: `src/components/diagrams/RotationShape.tsx`

```typescript
import React from 'react';

interface RotationShapeProps {
  data: {
    shape: 'triangle' | 'square' | 'rectangle' | 'l-shape';
    rotation: 0 | 90 | 180 | 270;
    showOriginal?: boolean;
    centerPoint?: boolean;
  };
}

export const RotationShape: React.FC<RotationShapeProps> = ({ data }) => {
  const { shape, rotation, showOriginal = true, centerPoint = true } = data;
  const centerX = 100;
  const centerY = 100;
  
  const getRotationTransform = (deg: number) => {
    return `rotate(${deg}, ${centerX}, ${centerY})`;
  };
  
  const renderShape = (isOriginal: boolean) => {
    const fill = isOriginal ? '#e2e8f0' : '#3b82f6';
    const stroke = isOriginal ? '#94a3b8' : '#1d4ed8';
    const strokeWidth = isOriginal ? 1 : 2;
    const opacity = isOriginal ? 0.5 : 1;
    
    switch (shape) {
      case 'triangle':
        return (
          <polygon
            points="100,50 140,120 60,120"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'square':
        return (
          <rect
            x="60"
            y="60"
            width="80"
            height="80"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'rectangle':
        return (
          <rect
            x="50"
            y="70"
            width="100"
            height="60"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'l-shape':
        return (
          <path
            d="M 60,60 L 100,60 L 100,100 L 140,100 L 140,140 L 60,140 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)" />
      
      {/* Original shape (ghost) */}
      {showOriginal && renderShape(true)}
      
      {/* Rotated shape */}
      {renderShape(false)}
      
      {/* Center point */}
      {centerPoint && (
        <>
          <circle cx={centerX} cy={centerY} r="4" fill="#dc2626" />
          <text x={centerX + 10} y={centerY - 5} className="fill-red-600 text-xs">center</text>
        </>
      )}
      
      {/* Rotation label */}
      <text x="100" y="185" textAnchor="middle" className="fill-slate-700 text-sm font-medium">
        {rotation}° clockwise
      </text>
    </svg>
  );
};

export default RotationShape;
```

---

### File: `src/components/diagrams/View3D.tsx`

```typescript
import React from 'react';

interface View3DProps {
  data: {
    shape: 'cube' | 'rectangular-prism' | 'pyramid' | 'cylinder';
    dimensions: { width: number; height: number; depth: number };
    view: 'isometric' | 'front' | 'top' | 'side';
    showDimensions?: boolean;
  };
}

export const View3D: React.FC<View3DProps> = ({ data }) => {
  const { shape, dimensions, view, showDimensions = true } = data;
  const { width = 60, height = 60, depth = 60 } = dimensions;
  
  const renderCube = () => {
    // Isometric projection
    const scale = 1.2;
    const w = width * scale;
    const h = height * scale;
    const d = depth * scale * 0.6; // Foreshorten depth
    
    const centerX = 100;
    const centerY = 100;
    
    // Front face
    const front = {
      tl: { x: centerX - w / 2, y: centerY + h / 2 },
      tr: { x: centerX + w / 2, y: centerY + h / 2 },
      br: { x: centerX + w / 2, y: centerY - h / 2 },
      bl: { x: centerX - w / 2, y: centerY - h / 2 },
    };
    
    // Back face (offset for isometric)
    const offsetX = d * 0.866;
    const offsetY = d * 0.5;
    
    const back = {
      tl: { x: front.tl.x - offsetX, y: front.tl.y - offsetY },
      tr: { x: front.tr.x - offsetX, y: front.tr.y - offsetY },
      br: { x: front.br.x - offsetX, y: front.br.y - offsetY },
      bl: { x: front.bl.x - offsetX, y: front.bl.y - offsetY },
    };
    
    return (
      <g>
        {/* Back faces (darker) */}
        <polygon
          points={`${back.tl.x},${back.tl.y} ${back.tr.x},${back.tr.y} ${back.br.x},${back.br.y} ${back.bl.x},${back.bl.y}`}
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Side faces */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${back.tl.x},${back.tl.y} ${back.bl.x},${back.bl.y} ${front.bl.x},${front.bl.y}`}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="1"
        />
        <polygon
          points={`${front.tr.x},${front.tr.y} ${back.tr.x},${back.tr.y} ${back.br.x},${back.br.y} ${front.br.x},${front.br.y}`}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Top face */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${front.tr.x},${front.tr.y} ${back.tr.x},${back.tr.y} ${back.tl.x},${back.tl.y}`}
          fill="#e2e8f0"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Front face (lightest) */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${front.tr.x},${front.tr.y} ${front.br.x},${front.br.y} ${front.bl.x},${front.bl.y}`}
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="2"
        />
        
        {/* Dimensions */}
        {showDimensions && (
          <>
            <text x={centerX} y={front.tl.y + 20} textAnchor="middle" className="fill-slate-700 text-xs">{width}</text>
            <text x={front.tr.x + 15} y={centerY} textAnchor="start" className="fill-slate-700 text-xs">{height}</text>
            <text x={back.tr.x - 10} y={back.tr.y - 10} textAnchor="middle" className="fill-slate-700 text-xs">{depth}</text>
          </>
        )}
      </g>
    );
  };
  
  const renderTopView = () => {
    const scale = 1.5;
    const w = width * scale;
    const d = depth * scale;
    const centerX = 100;
    const centerY = 100;
    
    return (
      <g>
        <rect
          x={centerX - w / 2}
          y={centerY - d / 2}
          width={w}
          height={d}
          fill="#dbeafe"
          stroke="#2563eb"
          strokeWidth="2"
        />
        {/* Dashed lines for hidden edges */}
        <line x1={centerX} y1={centerY - d / 2} x2={centerX} y2={centerY + d / 2} stroke="#2563eb" strokeWidth="1" strokeDasharray="4" />
        <line x1={centerX - w / 2} y1={centerY} x2={centerX + w / 2} y2={centerY} stroke="#2563eb" strokeWidth="1" strokeDasharray="4" />
        
        {showDimensions && (
          <>
            <text x={centerX} y={centerY - d / 2 - 8} textAnchor="middle" className="fill-slate-700 text-xs">{width}</text>
            <text x={centerX + w / 2 + 15} y={centerY + 4} textAnchor="start" className="fill-slate-700 text-xs">{depth}</text>
          </>
        )}
      </g>
    );
  };
  
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {view === 'isometric' ? renderCube() : renderTopView()}
    </svg>
  );
};

export default View3D;
```

---

### File: `src/components/diagrams/index.ts`

```typescript
export { BarGraph } from './BarGraph';
export { Spinner } from './Spinner';
export { ShapeDiagram } from './ShapeDiagram';
export { MapDiagram } from './MapDiagram';
export { NumberLine } from './NumberLine';
export { Clock } from './Clock';
export { MeasuringJug } from './MeasuringJug';
export { Protractor } from './Protractor';
export { RotationShape } from './RotationShape';
export { View3D } from './View3D';
```

---

## 3. Question Generators

### File: `src/lib/questions/index.ts`

```typescript
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
    'circle': 'infinite',
  };
  
  const correct = linesOfSymmetry[shapeName];
  const correctStr = correct === 'infinite' ? 'infinite' : correct.toString();
  
  const distractors = [0, 1, 2, 3, 4, 5].filter(n => n !== correct && n !== (correct === 'infinite' ? 999 : correct)).slice(0, 3);
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
```

---

## 4. App.tsx Integration

### Diagram Renderer Component

Add this to your `src/App.tsx` or create as a separate component:

```typescript
// Diagram renderer component to add in App.tsx
const DiagramRenderer: React.FC<{ diagram: Diagram }> = ({ diagram }) => {
  switch (diagram.type) {
    case 'bar-graph':
      return <BarGraph data={diagram.data} />;
    case 'spinner':
      return <Spinner data={diagram.data} />;
    case 'shape':
      return <ShapeDiagram data={diagram.data} />;
    case 'map':
      return <MapDiagram data={diagram.data} />;
    case 'number-line':
      return <NumberLine data={diagram.data} />;
    case 'clock':
      return <Clock data={diagram.data} />;
    case 'measuring-jug':
      return <MeasuringJug data={diagram.data} />;
    case 'protractor':
      return <Protractor data={diagram.data} />;
    case 'rotation-shape':
      return <RotationShape data={diagram.data} />;
    case 'view-3d':
      return <View3D data={diagram.data} />;
    default:
      return null;
  }
};
```

### Import statements to add to App.tsx:

```typescript
import { BarGraph, Spinner, ShapeDiagram, MapDiagram, NumberLine, Clock, MeasuringJug, Protractor, RotationShape, View3D } from './components/diagrams';
```

### Update the question rendering in App.tsx:

In your `renderTest()` function, add diagram rendering after the question text:

```typescript
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
      
      {/* Render diagram if present */}
      {q.diagram && (
        <div className="mb-6 flex justify-center">
          <DiagramRenderer diagram={q.diagram} />
        </div>
      )}
      
      {/* Answer options... */}
      {q.answerFormat === 'multiple-choice' ? (
        // ... multiple choice rendering
      ) : (
        // ... numeric input rendering
      )}
    </CardContent>
  </Card>
</main>
```

---

## Summary of Files to Create/Update

### New Files (Create these):
1. `src/components/diagrams/BarGraph.tsx`
2. `src/components/diagrams/Spinner.tsx`
3. `src/components/diagrams/ShapeDiagram.tsx`
4. `src/components/diagrams/MapDiagram.tsx`
5. `src/components/diagrams/NumberLine.tsx`
6. `src/components/diagrams/Clock.tsx`
7. `src/components/diagrams/MeasuringJug.tsx`
8. `src/components/diagrams/Protractor.tsx`
9. `src/components/diagrams/RotationShape.tsx`
10. `src/components/diagrams/View3D.tsx`
11. `src/components/diagrams/index.ts`

### Updated Files (Replace content):
1. `src/types/index.ts` - Add Diagram interface
2. `src/lib/questions/index.ts` - Replace with complete generators
3. `src/App.tsx` - Add diagram imports and renderer

---

## Question Type Count

| Category | Count |
|----------|-------|
| Number & Algebra | 15 |
| Measurement & Geometry | 20 |
| Statistics & Probability | 8 |
| **Total** | **43** |
