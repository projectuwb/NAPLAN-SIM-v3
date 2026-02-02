import React from 'react';

interface ShapeDiagramProps {
  type: 'rectangle' | 'triangle' | 'L-shape' | 'compound' | 'polygon';
  dimensions: Record<string, number>;
  showDimensions?: boolean;
  size?: number;
}

export const ShapeDiagram: React.FC<ShapeDiagramProps> = ({ 
  type, 
  dimensions, 
  showDimensions = true,
  size = 200 
}) => {
  const scale = size / 150;
  
  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        const { width = 80, height = 50 } = dimensions;
        const scaledW = width * scale;
        const scaledH = height * scale;
        const startX = (size - scaledW) / 2;
        const startY = (size - scaledH) / 2;
        
        return (
          <g>
            <rect
              x={startX}
              y={startY}
              width={scaledW}
              height={scaledH}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
            {showDimensions && (
              <>
                <text x={startX + scaledW / 2} y={startY - 10} textAnchor="middle" fontSize="12" fill="#333">
                  {width} cm
                </text>
                <text x={startX + scaledW + 15} y={startY + scaledH / 2} textAnchor="middle" fontSize="12" fill="#333">
                  {height} cm
                </text>
              </>
            )}
          </g>
        );
        
      case 'triangle':
        const { base = 80, height: triHeight = 60 } = dimensions;
        const scaledBase = base * scale;
        const scaledTriH = triHeight * scale;
        const triStartX = (size - scaledBase) / 2;
        const triStartY = size / 2 + scaledTriH / 2;
        
        return (
          <g>
            <polygon
              points={`${triStartX},${triStartY} ${triStartX + scaledBase},${triStartY} ${triStartX + scaledBase / 2},${triStartY - scaledTriH}`}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
            {/* Right angle marker if right triangle */}
            {dimensions.rightAngle && (
              <path
                d={`M ${triStartX + 10} ${triStartY} L ${triStartX + 10} ${triStartY - 10} L ${triStartX} ${triStartY - 10}`}
                fill="none"
                stroke="#1e40af"
                strokeWidth="1"
              />
            )}
            {showDimensions && (
              <>
                <text x={triStartX + scaledBase / 2} y={triStartY + 20} textAnchor="middle" fontSize="12" fill="#333">
                  {base} cm
                </text>
                <line 
                  x1={triStartX + scaledBase / 2 - 5} 
                  y1={triStartY} 
                  x2={triStartX + scaledBase / 2 - 5} 
                  y2={triStartY - scaledTriH}
                  stroke="#666"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text x={triStartX + scaledBase / 2 + 15} y={triStartY - scaledTriH / 2} textAnchor="start" fontSize="12" fill="#333">
                  {triHeight} cm
                </text>
              </>
            )}
          </g>
        );
        
      case 'L-shape':
        const { outerWidth = 80, outerHeight = 70, innerWidth = 40, innerHeight = 35 } = dimensions;
        const sOW = outerWidth * scale;
        const sOH = outerHeight * scale;
        const sIW = innerWidth * scale;
        const sIH = innerHeight * scale;
        const lStartX = (size - sOW) / 2;
        const lStartY = (size - sOH) / 2;
        
        return (
          <g>
            <path
              d={`
                M ${lStartX} ${lStartY}
                L ${lStartX + sOW} ${lStartY}
                L ${lStartX + sOW} ${lStartY + sOH - sIH}
                L ${lStartX + sIW} ${lStartY + sOH - sIH}
                L ${lStartX + sIW} ${lStartY + sOH}
                L ${lStartX} ${lStartY + sOH}
                Z
              `}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
            {showDimensions && (
              <>
                <text x={lStartX + sOW / 2} y={lStartY - 10} textAnchor="middle" fontSize="11" fill="#333">
                  {outerWidth} cm
                </text>
                <text x={lStartX - 15} y={lStartY + sOH / 2} textAnchor="middle" fontSize="11" fill="#333">
                  {outerHeight} cm
                </text>
                <text x={lStartX + sIW / 2} y={lStartY + sOH + 15} textAnchor="middle" fontSize="10" fill="#333">
                  {innerWidth} cm
                </text>
              </>
            )}
          </g>
        );
        
      case 'compound':
        // Compound shape with multiple rectangles
        return (
          <g>
            <rect
              x={size * 0.2}
              y={size * 0.3}
              width={size * 0.3}
              height={size * 0.4}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
            <rect
              x={size * 0.5}
              y={size * 0.2}
              width={size * 0.3}
              height={size * 0.5}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
          </g>
        );
        
      case 'polygon':
        const { sides = 6, radius = 60 } = dimensions;
        const centerX = size / 2;
        const centerY = size / 2;
        const points = [];
        
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        
        return (
          <g>
            <polygon
              points={points.join(' ')}
              fill="#dbeafe"
              stroke="#1e40af"
              strokeWidth="2"
            />
            {/* Show one side length */}
            {showDimensions && (
              <text x={centerX} y={centerY + radius + 20} textAnchor="middle" fontSize="12" fill="#333">
                Regular {sides}-gon
              </text>
            )}
          </g>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {renderShape()}
    </svg>
  );
};
