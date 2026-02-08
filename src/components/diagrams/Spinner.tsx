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
