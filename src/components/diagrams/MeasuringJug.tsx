import React from 'react';

interface MeasuringJugProps {
  capacity: number; // in mL
  currentLevel: number; // in mL
  unit: 'mL' | 'L';
  size?: number;
}

export const MeasuringJug: React.FC<MeasuringJugProps> = ({ 
  capacity, 
  currentLevel, 
  unit,
  size = 150 
}) => {
  const width = size;
  const height = size * 1.5;
  const padding = 20;
  const jugWidth = width - 2 * padding;
  const jugHeight = height - 2 * padding;
  
  // Calculate liquid height
  const liquidHeight = (currentLevel / capacity) * (jugHeight - 30);
  const liquidY = padding + jugHeight - 30 - liquidHeight;
  
  // Generate scale marks
  const scaleMarks = [];
  const numMarks = unit === 'L' ? capacity : capacity / 100;
  const markStep = unit === 'L' ? 1 : 100;
  
  for (let i = 0; i <= numMarks; i++) {
    const markValue = i * markStep;
    const markY = padding + jugHeight - 30 - (i / numMarks) * (jugHeight - 30);
    const isMajor = i % (unit === 'L' ? 1 : 5) === 0;
    
    scaleMarks.push(
      <g key={i}>
        <line
          x1={padding + jugWidth - (isMajor ? 20 : 10)}
          y1={markY}
          x2={padding + jugWidth}
          y2={markY}
          stroke="#333"
          strokeWidth={isMajor ? 2 : 1}
        />
        {isMajor && (
          <text
            x={padding + jugWidth - 25}
            y={markY + 4}
            textAnchor="end"
            fontSize="10"
            fill="#333"
          >
            {markValue}
          </text>
        )}
      </g>
    );
  }
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Jug outline */}
      <path
        d={`
          M ${padding + 10} ${padding} 
          L ${padding + jugWidth - 10} ${padding} 
          Q ${padding + jugWidth} ${padding} ${padding + jugWidth} ${padding + 10}
          L ${padding + jugWidth} ${padding + jugHeight - 30}
          Q ${padding + jugWidth} ${padding + jugHeight} ${padding + jugWidth - 20} ${padding + jugHeight}
          L ${padding + 20} ${padding + jugHeight}
          Q ${padding} ${padding + jugHeight} ${padding} ${padding + jugHeight - 30}
          L ${padding} ${padding + 10}
          Q ${padding} ${padding} ${padding + 10} ${padding}
        `}
        fill="none"
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Spout */}
      <path
        d={`
          M ${padding} ${padding + 20}
          L ${padding - 15} ${padding + 15}
          L ${padding - 15} ${padding + 25}
          L ${padding} ${padding + 30}
        `}
        fill="none"
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Handle */}
      <path
        d={`
          M ${padding + jugWidth} ${padding + 30}
          Q ${padding + jugWidth + 25} ${padding + 30} ${padding + jugWidth + 25} ${padding + 60}
          L ${padding + jugWidth + 25} ${padding + 90}
          Q ${padding + jugWidth + 25} ${padding + 120} ${padding + jugWidth} ${padding + 120}
        `}
        fill="none"
        stroke="#333"
        strokeWidth="3"
      />
      
      {/* Liquid */}
      {currentLevel > 0 && (
        <path
          d={`
            M ${padding + 5} ${liquidY}
            L ${padding + jugWidth - 5} ${liquidY}
            L ${padding + jugWidth - 5} ${padding + jugHeight - 20}
            Q ${padding + jugWidth - 10} ${padding + jugHeight - 5} ${padding + jugWidth - 20} ${padding + jugHeight - 5}
            L ${padding + 20} ${padding + jugHeight - 5}
            Q ${padding + 10} ${padding + jugHeight - 5} ${padding + 5} ${padding + jugHeight - 20}
            Z
          `}
          fill="#3b82f6"
          fillOpacity="0.6"
          stroke="none"
        />
      )}
      
      {/* Scale marks */}
      {scaleMarks}
      
      {/* Unit label */}
      <text
        x={padding + jugWidth - 25}
        y={padding - 5}
        textAnchor="end"
        fontSize="12"
        fontWeight="bold"
        fill="#333"
      >
        {unit}
      </text>
    </svg>
  );
};
