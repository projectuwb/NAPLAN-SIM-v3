import React from 'react';

interface View3DProps {
  data: {
    shape: 'cube' | 'rectangular-prism' | 'pyramid' | 'cylinder';
    dimensions: { width: number; height: number; depth: number };
    view: 'isometric' | 'front' | 'top' | 'side';
    showDimensions?: boolean;
  };
}

export const View3D: React.FC<View3DProps> = ({ data }) => {
  const { shape, dimensions, view, showDimensions = true } = data;
  const { width = 60, height = 60, depth = 60 } = dimensions;
  
  const renderCube = () => {
    // Isometric projection
    const scale = 1.2;
    const w = width * scale;
    const h = height * scale;
    const d = depth * scale * 0.6; // Foreshorten depth
    
    const centerX = 100;
    const centerY = 100;
    
    // Front face
    const front = {
      tl: { x: centerX - w / 2, y: centerY + h / 2 },
      tr: { x: centerX + w / 2, y: centerY + h / 2 },
      br: { x: centerX + w / 2, y: centerY - h / 2 },
      bl: { x: centerX - w / 2, y: centerY - h / 2 },
    };
    
    // Back face (offset for isometric)
    const offsetX = d * 0.866;
    const offsetY = d * 0.5;
    
    const back = {
      tl: { x: front.tl.x - offsetX, y: front.tl.y - offsetY },
      tr: { x: front.tr.x - offsetX, y: front.tr.y - offsetY },
      br: { x: front.br.x - offsetX, y: front.br.y - offsetY },
      bl: { x: front.bl.x - offsetX, y: front.bl.y - offsetY },
    };
    
    return (
      <g>
        {/* Back faces (darker) */}
        <polygon
          points={`${back.tl.x},${back.tl.y} ${back.tr.x},${back.tr.y} ${back.br.x},${back.br.y} ${back.bl.x},${back.bl.y}`}
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Side faces */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${back.tl.x},${back.tl.y} ${back.bl.x},${back.bl.y} ${front.bl.x},${front.bl.y}`}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="1"
        />
        <polygon
          points={`${front.tr.x},${front.tr.y} ${back.tr.x},${back.tr.y} ${back.br.x},${back.br.y} ${front.br.x},${front.br.y}`}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Top face */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${front.tr.x},${front.tr.y} ${back.tr.x},${back.tr.y} ${back.tl.x},${back.tl.y}`}
          fill="#e2e8f0"
          stroke="#475569"
          strokeWidth="1"
        />
        
        {/* Front face (lightest) */}
        <polygon
          points={`${front.tl.x},${front.tl.y} ${front.tr.x},${front.tr.y} ${front.br.x},${front.br.y} ${front.bl.x},${front.bl.y}`}
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="2"
        />
        
        {/* Dimensions */}
        {showDimensions && (
          <>
            <text x={centerX} y={front.tl.y + 20} textAnchor="middle" className="fill-slate-700 text-xs">{width}</text>
            <text x={front.tr.x + 15} y={centerY} textAnchor="start" className="fill-slate-700 text-xs">{height}</text>
            <text x={back.tr.x - 10} y={back.tr.y - 10} textAnchor="middle" className="fill-slate-700 text-xs">{depth}</text>
          </>
        )}
      </g>
    );
  };
  
  const renderTopView = () => {
    const scale = 1.5;
    const w = width * scale;
    const d = depth * scale;
    const centerX = 100;
    const centerY = 100;
    
    return (
      <g>
        <rect
          x={centerX - w / 2}
          y={centerY - d / 2}
          width={w}
          height={d}
          fill="#dbeafe"
          stroke="#2563eb"
          strokeWidth="2"
        />
        {/* Dashed lines for hidden edges */}
        <line x1={centerX} y1={centerY - d / 2} x2={centerX} y2={centerY + d / 2} stroke="#2563eb" strokeWidth="1" strokeDasharray="4" />
        <line x1={centerX - w / 2} y1={centerY} x2={centerX + w / 2} y2={centerY} stroke="#2563eb" strokeWidth="1" strokeDasharray="4" />
        
        {showDimensions && (
          <>
            <text x={centerX} y={centerY - d / 2 - 8} textAnchor="middle" className="fill-slate-700 text-xs">{width}</text>
            <text x={centerX + w / 2 + 15} y={centerY + 4} textAnchor="start" className="fill-slate-700 text-xs">{depth}</text>
          </>
        )}
      </g>
    );
  };
  
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {view === 'isometric' ? renderCube() : renderTopView()}
    </svg>
  );
};

export default View3D;
