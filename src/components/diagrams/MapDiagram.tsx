import React from 'react';

interface Town {
  name: string;
  x: number;
  y: number;
}

interface MapDiagramProps {
  towns: Town[];
  highlightedTowns?: string[];
  showCompass?: boolean;
  questionType?: 'direction' | 'position';
  size?: number;
}

export const MapDiagram: React.FC<MapDiagramProps> = ({ 
  towns, 
  highlightedTowns = [],
  showCompass = true,
  size = 250 
}) => {
  return (
    <svg width={size} height={size + (showCompass ? 40 : 0)} viewBox={`0 0 ${size} ${size + (showCompass ? 40 : 0)}`}>
      {/* Background */}
      <rect
        x="10"
        y="10"
        width={size - 20}
        height={size - 20}
        fill="#f0fdf4"
        stroke="#166534"
        strokeWidth="2"
        rx="5"
      />
      
      {/* Roads (connecting lines) */}
      {towns.map((town, i) => 
        towns.slice(i + 1).map((otherTown, j) => {
          const distance = Math.sqrt(
            Math.pow(town.x - otherTown.x, 2) + 
            Math.pow(town.y - otherTown.y, 2)
          );
          // Only connect nearby towns
          if (distance < 120) {
            return (
              <line
                key={`road-${i}-${j}`}
                x1={town.x}
                y1={town.y}
                x2={otherTown.x}
                y2={otherTown.y}
                stroke="#a3a3a3"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          }
          return null;
        })
      )}
      
      {/* Towns */}
      {towns.map((town, i) => {
        const isHighlighted = highlightedTowns.includes(town.name);
        return (
          <g key={i}>
            <circle
              cx={town.x}
              cy={town.y}
              r={isHighlighted ? 12 : 8}
              fill={isHighlighted ? '#dc2626' : '#3b82f6'}
              stroke="#1e40af"
              strokeWidth="2"
            />
            <text
              x={town.x}
              y={town.y - 15}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isHighlighted ? 'bold' : 'normal'}
              fill={isHighlighted ? '#dc2626' : '#1e3a8a'}
            >
              {town.name}
            </text>
          </g>
        );
      })}
      
      {/* Compass */}
      {showCompass && (
        <g transform={`translate(${size - 50}, ${size + 10})`}>
          <circle cx="20" cy="15" r="18" fill="white" stroke="#333" strokeWidth="1" />
          <text x="20" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">N</text>
          <text x="20" y="28" textAnchor="middle" fontSize="8" fill="#333">S</text>
          <text x="8" y="18" textAnchor="middle" fontSize="8" fill="#333">W</text>
          <text x="32" y="18" textAnchor="middle" fontSize="8" fill="#333">E</text>
          {/* Arrow */}
          <line x1="20" y1="15" x2="20" y2="6" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#dc2626" />
            </marker>
          </defs>
        </g>
      )}
    </svg>
  );
};

// Common town layouts
export const townLayouts = {
  standard: [
    { name: 'Arundel', x: 80, y: 60 },
    { name: 'Seaview', x: 180, y: 50 },
    { name: 'Newtown', x: 150, y: 120 },
    { name: 'Oxley', x: 50, y: 100 },
    { name: 'Kambara', x: 100, y: 150 },
    { name: 'Pleasance', x: 190, y: 170 },
  ],
  streets: [
    { name: 'High St', x: 125, y: 40 },
    { name: 'Alma St', x: 60, y: 80 },
    { name: 'Boyd St', x: 190, y: 80 },
    { name: 'James St', x: 50, y: 140 },
    { name: 'Dean St', x: 125, y: 150 },
    { name: 'Commerce St', x: 200, y: 140 },
  ],
};
