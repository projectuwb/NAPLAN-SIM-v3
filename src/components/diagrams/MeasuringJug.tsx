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
