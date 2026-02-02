import React from 'react';

interface ClockProps {
  hours: number;
  minutes: number;
  showTime?: boolean;
  size?: number;
}

export const Clock: React.FC<ClockProps> = ({ 
  hours, 
  minutes, 
  showTime = false,
  size = 150 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Calculate hand angles
  const hourAngle = ((hours % 12) + minutes / 60) * 30; // 30 degrees per hour
  const minuteAngle = minutes * 6; // 6 degrees per minute
  
  // Convert to radians (subtract from 90 to start from top)
  const hourRad = ((90 - hourAngle) * Math.PI) / 180;
  const minuteRad = ((90 - minuteAngle) * Math.PI) / 180;
  
  // Calculate hand endpoints
  const hourX = centerX + radius * 0.5 * Math.cos(hourRad);
  const hourY = centerY - radius * 0.5 * Math.sin(hourRad);
  const minuteX = centerX + radius * 0.8 * Math.cos(minuteRad);
  const minuteY = centerY - radius * 0.8 * Math.sin(minuteRad);
  
  // Generate hour markers
  const markers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = ((90 - i * 30) * Math.PI) / 180;
    const x1 = centerX + radius * 0.85 * Math.cos(angle);
    const y1 = centerY - radius * 0.85 * Math.sin(angle);
    const x2 = centerX + radius * 0.95 * Math.cos(angle);
    const y2 = centerY - radius * 0.95 * Math.sin(angle);
    
    markers.push(
      <g key={i}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#333"
          strokeWidth={i % 3 === 0 ? 3 : 2}
        />
        {i % 3 === 0 && (
          <text
            x={centerX + radius * 0.7 * Math.cos(angle)}
            y={centerY - radius * 0.7 * Math.sin(angle) + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            {i}
          </text>
        )}
      </g>
    );
  }
  
  // Format time display
  const formatTime = () => {
    const h = hours.toString();
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m}`;
  };
  
  return (
    <svg width={size} height={size + (showTime ? 25 : 0)} viewBox={`0 0 ${size} ${size + (showTime ? 25 : 0)}`}>
      {/* Clock face */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="white"
        stroke="#333"
        strokeWidth="3"
      />
      
      {/* Hour markers */}
      {markers}
      
      {/* Hour hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={hourX}
        y2={hourY}
        stroke="#333"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Minute hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={minuteX}
        y2={minuteY}
        stroke="#333"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Center dot */}
      <circle cx={centerX} cy={centerY} r="5" fill="#dc2626" />
      
      {/* Time display */}
      {showTime && (
        <text
          x={centerX}
          y={size + 18}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#333"
        >
          {formatTime()}
        </text>
      )}
    </svg>
  );
};
