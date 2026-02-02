import React from 'react';

interface SpinnerProps {
  sections: number[];
  colors?: string[];
  highlightNumber?: number;
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  sections, 
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  highlightNumber,
  size = 150 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  const anglePerSection = 360 / sections.length;
  
  // Generate sections
  const sectionElements = sections.map((num, i) => {
    const startAngle = i * anglePerSection;
    const endAngle = (i + 1) * anglePerSection;
    
    // Convert to radians
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    
    // Calculate path
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = anglePerSection > 180 ? 1 : 0;
    
    const isHighlighted = highlightNumber === num;
    
    return (
      <g key={i}>
        <path
          d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={colors[i % colors.length]}
          stroke={isHighlighted ? '#dc2626' : '#333'}
          strokeWidth={isHighlighted ? 4 : 2}
        />
        {/* Number label */}
        <text
          x={centerX + radius * 0.65 * Math.cos((startRad + endRad) / 2)}
          y={centerY + radius * 0.65 * Math.sin((startRad + endRad) / 2) + 5}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="white"
        >
          {num}
        </text>
      </g>
    );
  });
  
  return (
    <svg width={size} height={size + 30} viewBox={`0 0 ${size} ${size + 30}`}>
      {/* Spinner sections */}
      {sectionElements}
      
      {/* Center */}
      <circle cx={centerX} cy={centerY} r="8" fill="#333" />
      
      {/* Pointer */}
      <polygon
        points={`${centerX},${centerY - radius - 10} ${centerX - 8},${centerY - radius + 5} ${centerX + 8},${centerY - radius + 5}`}
        fill="#dc2626"
        stroke="#333"
        strokeWidth="1"
      />
      
      {/* Legend */}
      <text
        x={centerX}
        y={size + 20}
        textAnchor="middle"
        fontSize="12"
        fill="#333"
      >
        {sections.filter(n => n === highlightNumber).length} in {sections.length} sections
      </text>
    </svg>
  );
};
