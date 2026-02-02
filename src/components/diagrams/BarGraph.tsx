import React from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarGraphProps {
  data: BarData[];
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  maxValue?: number;
  size?: { width: number; height: number };
}

export const BarGraph: React.FC<BarGraphProps> = ({ 
  data, 
  title,
  yAxisLabel,
  xAxisLabel,
  maxValue,
  size = { width: 300, height: 200 }
}) => {
  const { width, height } = size;
  const padding = { top: 40, right: 20, bottom: 50, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const actualMax = maxValue || Math.max(...data.map(d => d.value)) * 1.1;
  const barWidth = (chartWidth / data.length) * 0.7;
  const barSpacing = (chartWidth / data.length) * 0.3;
  
  // Generate Y-axis ticks
  const yTicks = [];
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const value = (actualMax / numTicks) * i;
    const y = padding.top + chartHeight - (value / actualMax) * chartHeight;
    yTicks.push(
      <g key={i}>
        <line
          x1={padding.left - 5}
          y1={y}
          x2={padding.left}
          y2={y}
          stroke="#333"
          strokeWidth="1"
        />
        <text
          x={padding.left - 10}
          y={y + 4}
          textAnchor="end"
          fontSize="10"
          fill="#333"
        >
          {Math.round(value)}
        </text>
        <line
          x1={padding.left}
          y1={y}
          x2={width - padding.right}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      </g>
    );
  }
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      {title && (
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#333"
        >
          {title}
        </text>
      )}
      
      {/* Y-axis */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* X-axis */}
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Y-axis label */}
      {yAxisLabel && (
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#333"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          {yAxisLabel}
        </text>
      )}
      
      {/* Y-axis ticks */}
      {yTicks}
      
      {/* Bars */}
      {data.map((item, i) => {
        const barHeight = (item.value / actualMax) * chartHeight;
        const x = padding.left + i * (barWidth + barSpacing) + barSpacing / 2;
        const y = padding.top + chartHeight - barHeight;
        
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color || '#3b82f6'}
              stroke="#1e40af"
              strokeWidth="1"
            />
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#333"
            >
              {item.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#333"
            >
              {item.label}
            </text>
          </g>
        );
      })}
      
      {/* X-axis label */}
      {xAxisLabel && (
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="12"
          fill="#333"
        >
          {xAxisLabel}
        </text>
      )}
    </svg>
  );
};
