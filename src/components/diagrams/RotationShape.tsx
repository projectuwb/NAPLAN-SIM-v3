import React from 'react';

interface RotationShapeProps {
  data: {
    shape: 'triangle' | 'square' | 'rectangle' | 'l-shape';
    rotation: 0 | 90 | 180 | 270;
    showOriginal?: boolean;
    centerPoint?: boolean;
  };
}

export const RotationShape: React.FC<RotationShapeProps> = ({ data }) => {
  const { shape, rotation, showOriginal = true, centerPoint = true } = data;
  const centerX = 100;
  const centerY = 100;
  
  const getRotationTransform = (deg: number) => {
    return `rotate(${deg}, ${centerX}, ${centerY})`;
  };
  
  const renderShape = (isOriginal: boolean) => {
    const fill = isOriginal ? '#e2e8f0' : '#3b82f6';
    const stroke = isOriginal ? '#94a3b8' : '#1d4ed8';
    const strokeWidth = isOriginal ? 1 : 2;
    const opacity = isOriginal ? 0.5 : 1;
    
    switch (shape) {
      case 'triangle':
        return (
          <polygon
            points="100,50 140,120 60,120"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'square':
        return (
          <rect
            x="60"
            y="60"
            width="80"
            height="80"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'rectangle':
        return (
          <rect
            x="50"
            y="70"
            width="100"
            height="60"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      case 'l-shape':
        return (
          <path
            d="M 60,60 L 100,60 L 100,100 L 140,100 L 140,140 L 60,140 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={!isOriginal ? getRotationTransform(rotation) : undefined}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)" />
      
      {/* Original shape (ghost) */}
      {showOriginal && renderShape(true)}
      
      {/* Rotated shape */}
      {renderShape(false)}
      
      {/* Center point */}
      {centerPoint && (
        <>
          <circle cx={centerX} cy={centerY} r="4" fill="#dc2626" />
          <text x={centerX + 10} y={centerY - 5} className="fill-red-600 text-xs">center</text>
        </>
      )}
      
      {/* Rotation label */}
      <text x="100" y="185" textAnchor="middle" className="fill-slate-700 text-sm font-medium">
        {rotation}° clockwise
      </text>
    </svg>
  );
};

export default RotationShape;
