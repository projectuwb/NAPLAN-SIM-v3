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
