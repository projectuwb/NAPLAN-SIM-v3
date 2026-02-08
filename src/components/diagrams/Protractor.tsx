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
