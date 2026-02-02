import React from 'react';

interface ProtractorProps {
  angle: number;
  showAngle?: boolean;
  size?: number;
}

export const Protractor: React.FC<ProtractorProps> = ({ 
  angle, 
  showAngle = false,
  size = 200 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Calculate end point of angle line
  const angleRad = (angle * Math.PI) / 180;
  const endX = centerX + radius * Math.cos(angleRad);
  const endY = centerY - radius * Math.sin(angleRad);
  
  // Generate tick marks
  const tickMarks = [];
  for (let i = 0; i <= 180; i += 10) {
    const tickRad = (i * Math.PI) / 180;
    const innerR = i % 30 === 0 ? radius - 15 : radius - 8;
    const x1 = centerX + radius * Math.cos(tickRad);
    const y1 = centerY - radius * Math.sin(tickRad);
    const x2 = centerX + innerR * Math.cos(tickRad);
    const y2 = centerY - innerR * Math.sin(tickRad);
    
    tickMarks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#333"
        strokeWidth={i % 30 === 0 ? 2 : 1}
      />
    );
    
    // Add labels for major angles
    if (i % 30 === 0 && i > 0 && i < 180) {
      const labelR = radius - 25;
      const labelX = centerX + labelR * Math.cos(tickRad);
      const labelY = centerY - labelR * Math.sin(tickRad);
      tickMarks.push(
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="#333"
        >
          {i}
        </text>
      );
    }
  }
  
  return (
    <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
      {/* Protractor arc */}
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Base line */}
      <line
        x1={centerX - radius - 5}
        y1={centerY}
        x2={centerX + radius + 5}
        y2={centerY}
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Tick marks */}
      {tickMarks}
      
      {/* Angle line */}
      <line
        x1={centerX}
        y1={centerY}
        x2={endX}
        y2={endY}
        stroke="#dc2626"
        strokeWidth="3"
      />
      
      {/* Center point */}
      <circle cx={centerX} cy={centerY} r="4" fill="#dc2626" />
      
      {/* Angle label */}
      {showAngle && (
        <text
          x={centerX}
          y={centerY - radius - 15}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#dc2626"
        >
          {angle}°
        </text>
      )}
    </svg>
  );
};
