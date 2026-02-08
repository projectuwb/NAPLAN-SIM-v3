import React from 'react';

interface ShapeDiagramProps {
  data: {
    type: 'rectangle' | 'square' | 'triangle' | 'circle' | 'l-shape' | 'composite';
    dimensions: Record<string, number>;
    showLabels?: boolean;
    unit?: string;
  };
}

export const ShapeDiagram: React.FC<ShapeDiagramProps> = ({ data }) => {
  const { type, dimensions, showLabels = true, unit = 'cm' } = data;
  
  const renderRectangle = () => {
    const { width = 100, height = 60 } = dimensions;
    const scale = Math.min(200 / width, 120 / height);
    const w = width * scale;
    const h = height * scale;
    
    return (
      <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto">
        <rect x="40" y="40" width={w} height={h} fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + w / 2} y="30" textAnchor="middle" className="fill-slate-700 text-sm">{width} {unit}</text>
            <text x="30" y={40 + h / 2} textAnchor="middle" className="fill-slate-700 text-sm" transform={`rotate(-90, 30, ${40 + h / 2})`}>{height} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderTriangle = () => {
    const { base = 100, height = 80 } = dimensions;
    const scale = Math.min(200 / base, 140 / height);
    const b = base * scale;
    const h = height * scale;
    
    const points = `40,${160} ${40 + b / 2},${160 - h} ${40 + b},160`;
    
    return (
      <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto">
        <polygon points={points} fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + b / 2} y="175" textAnchor="middle" className="fill-slate-700 text-sm">{base} {unit}</text>
            <line x1={40 + b / 2} y1={160} x2={40 + b / 2} y2={160 - h} stroke="#16a34a" strokeWidth="1" strokeDasharray="4" />
            <text x={45 + b / 2} y={160 - h / 2} textAnchor="start" className="fill-slate-700 text-sm">{height} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderLShape = () => {
    const { outerWidth = 120, outerHeight = 100, innerWidth = 60, innerHeight = 50 } = dimensions;
    const scale = Math.min(200 / outerWidth, 160 / outerHeight);
    const ow = outerWidth * scale;
    const oh = outerHeight * scale;
    const iw = innerWidth * scale;
    const ih = innerHeight * scale;
    
    const path = `M 40,40 L ${40 + ow},40 L ${40 + ow},${40 + oh} L ${40 + ow - iw},${40 + oh} L ${40 + ow - iw},${40 + ih} L 40,${40 + ih} Z`;
    
    return (
      <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto">
        <path d={path} fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        {showLabels && (
          <>
            <text x={40 + ow / 2} y="30" textAnchor="middle" className="fill-slate-700 text-sm">{outerWidth} {unit}</text>
            <text x="25" y={40 + oh / 2} textAnchor="middle" className="fill-slate-700 text-sm" transform={`rotate(-90, 25, ${40 + oh / 2})`}>{outerHeight} {unit}</text>
          </>
        )}
      </svg>
    );
  };
  
  const renderCircle = () => {
    const { radius = 50 } = dimensions;
    const scale = Math.min(90 / radius, 1);
    const r = radius * scale;
    
    return (
      <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto">
        <circle cx="110" cy="90" r={r} fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
        <line x1="110" y1="90" x2={110 + r} y2="90" stroke="#9333ea" strokeWidth="1" />
        <text x={110 + r / 2} y="105" textAnchor="middle" className="fill-slate-700 text-sm">{radius} {unit}</text>
      </svg>
    );
  };
  
  switch (type) {
    case 'rectangle':
    case 'square':
      return renderRectangle();
    case 'triangle':
      return renderTriangle();
    case 'l-shape':
    case 'composite':
      return renderLShape();
    case 'circle':
      return renderCircle();
    default:
      return renderRectangle();
  }
};

export default ShapeDiagram;
