import React from 'react';

interface BarGraphProps {
  data: {
    labels: string[];
    values: number[];
    title?: string;
    yAxisLabel?: string;
    color?: string;
  };
}

export const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const { labels, values, title, yAxisLabel, color = '#3b82f6' } = data;
  const maxValue = Math.max(...values);
  const chartHeight = 200;
  const chartWidth = 320;
  const barWidth = 40;
  const gap = (chartWidth - labels.length * barWidth) / (labels.length + 1);
  
  return (
    <svg viewBox="0 0 400 280" className="w-full max-w-md mx-auto">
      {/* Title */}
      {title && (
        <text x="200" y="20" textAnchor="middle" className="fill-slate-800 text-sm font-medium">
          {title}
        </text>
      )}
      
      {/* Y-axis label */}
      {yAxisLabel && (
        <text x="15" y="140" textAnchor="middle" transform="rotate(-90, 15, 140)" className="fill-slate-600 text-xs">
          {yAxisLabel}
        </text>
      )}
      
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = 240 - ratio * chartHeight;
        const value = Math.round(maxValue * ratio);
        return (
          <g key={i}>
            <line x1="50" y1={y} x2="370" y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x="45" y={y + 4} textAnchor="end" className="fill-slate-500 text-xs">{value}</text>
          </g>
        );
      })}
      
      {/* Bars */}
      {values.map((value, i) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = 50 + gap + i * (barWidth + gap);
        const y = 240 - barHeight;
        
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              stroke="#1e40af"
              strokeWidth="1"
              rx="2"
            />
            <text x={x + barWidth / 2} y="255" textAnchor="middle" className="fill-slate-700 text-xs">
              {labels[i]}
            </text>
            <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="fill-slate-800 text-xs font-medium">
              {value}
            </text>
          </g>
        );
      })}
      
      {/* Axes */}
      <line x1="50" y1="240" x2="370" y2="240" stroke="#64748b" strokeWidth="2" />
      <line x1="50" y1="40" x2="50" y2="240" stroke="#64748b" strokeWidth="2" />
    </svg>
  );
};

export default BarGraph;
