import React from 'react';

interface RotationShapeProps {
  shape: 'L' | 'T' | 'cross' | 'arrow' | 'zigzag';
  rotation: 0 | 90 | 180 | 270;
  direction?: 'clockwise' | 'anticlockwise';
  showCenter?: boolean;
  size?: number;
}

export const RotationShape: React.FC<RotationShapeProps> = ({ 
  shape, 
  rotation, 
  direction = 'clockwise',
  showCenter = true,
  size = 150 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const cellSize = 20;
  
  // Define shapes as grid coordinates
  const shapeGrids: Record<string, [number, number][]> = {
    L: [[0, 0], [0, 1], [0, 2], [1, 2]],
    T: [[0, 0], [1, 0], [2, 0], [1, 1]],
    cross: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
    arrow: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
    zigzag: [[0, 0], [1, 0], [1, 1], [2, 1]],
  };
  
  // Rotate a point around center
  const rotatePoint = (x: number, y: number, angle: number): [number, number] => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    // Translate to origin, rotate, translate back
    const nx = x * cos - y * sin;
    const ny = x * sin + y * cos;
    return [nx, ny];
  };
  
  // Get rotated shape coordinates
  const getRotatedShape = (): [number, number][] => {
    const original = shapeGrids[shape];
    // Center the shape
    const maxX = Math.max(...original.map(([x]) => x));
    const maxY = Math.max(...original.map(([, y]) => y));
    const offsetX = (2 - maxX) / 2;
    const offsetY = (2 - maxY) / 2;
    
    const centered = original.map(([x, y]) => [x + offsetX - 1, y + offsetY - 1]);
    
    // Apply rotation
    const actualRotation = direction === 'clockwise' ? rotation : -rotation;
    return centered.map(([x, y]) => rotatePoint(x, y, actualRotation));
  };
  
  const rotatedShape = getRotatedShape();
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={size} height={size} fill="url(#grid)" />
      
      {/* Center dot */}
      {showCenter && (
        <circle cx={centerX} cy={centerY} r="4" fill="#dc2626" />
      )}
      
      {/* Rotated shape */}
      {rotatedShape.map(([x, y], i) => (
        <rect
          key={i}
          x={centerX + x * cellSize - cellSize / 2}
          y={centerY + y * cellSize - cellSize / 2}
          width={cellSize - 2}
          height={cellSize - 2}
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth="1"
        />
      ))}
      
      {/* Rotation indicator */}
      {rotation > 0 && (
        <g>
          <path
            d={`M ${centerX + 50} ${centerY - 50} A 70 70 0 0 ${direction === 'clockwise' ? 1 : 0} ${centerX + 60} ${centerY - 40}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
            </marker>
          </defs>
          <text
            x={centerX + 70}
            y={centerY - 55}
            fontSize="12"
            fill="#dc2626"
            fontWeight="bold"
          >
            {rotation}°
          </text>
        </g>
      )}
    </svg>
  );
};
