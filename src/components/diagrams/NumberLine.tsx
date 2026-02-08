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
