import React from 'react';

interface NumberLineProps {
  min: number;
  max: number;
  markedPosition?: number;
  tickInterval?: number;
  labelInterval?: number;
  showArrow?: boolean;
  size?: number;
}

export const NumberLine: React.FC<NumberLineProps> = ({ 
  min, 
  max, 
  markedPosition,
  tickInterval = 1,
  labelInterval = 1,
  showArrow = true,
  size = 300 
}) => {
  const padding = 30;
  const lineY = 50;
  const lineLength = size - 2 * padding;
  const range = max - min;
  
  // Generate tick marks
  const ticks = [];
  for (let i = min; i <= max; i += tickInterval) {
    const x = padding + ((i - min) / range) * lineLength;
    const isMajor = i % labelInterval === 0;
    
    ticks.push(
      <g key={i}>
        <line
          x1={x}
          y1={lineY - (isMajor ? 8 : 5)}
          x2={x}
          y2={lineY + (isMajor ? 8 : 5)}
          stroke="#333"
          strokeWidth={isMajor ? 2 : 1}
        />
        {isMajor && (
          <text
            x={x}
            y={lineY + 25}
            textAnchor="middle"
            fontSize="12"
            fill="#333"
          >
            {i}
          </text>
        )}
      </g>
    );
  }
  
  // Calculate marked position
  const markedX = markedPosition !== undefined 
    ? padding + ((markedPosition - min) / range) * lineLength 
    : null;
  
  return (
    <svg width={size} height={90} viewBox={`0 0 ${size} 90`}>
      {/* Main line */}
      <line
        x1={padding}
        y1={lineY}
        x2={size - padding}
        y2={lineY}
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Arrow heads */}
      {showArrow && (
        <>
          <polygon
            points={`${padding},${lineY} ${padding + 10},${lineY - 5} ${padding + 10},${lineY + 5}`}
            fill="#333"
          />
          <polygon
            points={`${size - padding},${lineY} ${size - padding - 10},${lineY - 5} ${size - padding - 10},${lineY + 5}`}
            fill="#333"
          />
        </>
      )}
      
      {/* Tick marks */}
      {ticks}
      
      {/* Marked position */}
      {markedX !== null && (
        <g>
          <line
            x1={markedX}
            y1={lineY - 12}
            x2={markedX}
            y2={lineY + 12}
            stroke="#dc2626"
            strokeWidth="3"
          />
          <polygon
            points={`${markedX},${lineY - 15} ${markedX - 6},${lineY - 25} ${markedX + 6},${lineY - 25}`}
            fill="#dc2626"
          />
        </g>
      )}
    </svg>
  );
};
