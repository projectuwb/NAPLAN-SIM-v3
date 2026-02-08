import React from 'react';

interface MapDiagramProps {
  data: {
    gridSize: { rows: number; cols: number };
    locations: { name: string; row: number; col: number; icon?: string }[];
    paths?: { from: string; to: string; color?: string }[];
    startLocation?: string;
    endLocation?: string;
    showCoordinates?: boolean;
  };
}

export const MapDiagram: React.FC<MapDiagramProps> = ({ data }) => {
  const { gridSize, locations, paths = [], startLocation, endLocation, showCoordinates = true } = data;
  const { rows, cols } = gridSize;
  const cellSize = 50;
  const padding = 40;
  
  const width = cols * cellSize + 2 * padding;
  const height = rows * cellSize + 2 * padding;
  
  const getLocationPos = (name: string) => {
    const loc = locations.find(l => l.name === name);
    if (!loc) return null;
    return {
      x: padding + loc.col * cellSize + cellSize / 2,
      y: padding + loc.row * cellSize + cellSize / 2,
    };
  };
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
      {/* Grid */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={padding}
          y1={padding + i * cellSize}
          x2={padding + cols * cellSize}
          y2={padding + i * cellSize}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={padding + i * cellSize}
          y1={padding}
          x2={padding + i * cellSize}
          y2={padding + rows * cellSize}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      ))}
      
      {/* Coordinates */}
      {showCoordinates && (
        <>
          {Array.from({ length: cols }).map((_, i) => (
            <text key={`col-${i}`} x={padding + i * cellSize + cellSize / 2} y={padding - 10} textAnchor="middle" className="fill-slate-500 text-xs">
              {String.fromCharCode(65 + i)}
            </text>
          ))}
          {Array.from({ length: rows }).map((_, i) => (
            <text key={`row-${i}`} x={padding - 15} y={padding + i * cellSize + cellSize / 2 + 4} textAnchor="middle" className="fill-slate-500 text-xs">
              {i + 1}
            </text>
          ))}
        </>
      )}
      
      {/* Paths */}
      {paths.map((path, i) => {
        const from = getLocationPos(path.from);
        const to = getLocationPos(path.to);
        if (!from || !to) return null;
        
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={path.color || '#3b82f6'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8,4"
          />
        );
      })}
      
      {/* Locations */}
      {locations.map((loc, i) => {
        const x = padding + loc.col * cellSize + cellSize / 2;
        const y = padding + loc.row * cellSize + cellSize / 2;
        const isStart = loc.name === startLocation;
        const isEnd = loc.name === endLocation;
        
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="18"
              fill={isStart ? '#22c55e' : isEnd ? '#ef4444' : '#3b82f6'}
              stroke="#fff"
              strokeWidth="2"
            />
            <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-xs font-bold">
              {loc.icon || loc.name.charAt(0)}
            </text>
            <text x={x} y={y + 32} textAnchor="middle" className="fill-slate-700 text-xs">
              {loc.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default MapDiagram;
