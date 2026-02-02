import React from 'react';

interface View3DProps {
  view: 'top' | 'front' | 'side' | 'back' | 'right' | 'left';
  blocks: number[][]; // 2D array representing block positions
  size?: number;
}

export const View3D: React.FC<View3DProps> = ({ 
  view, 
  blocks,
  size = 150 
}) => {
  const blockSize = 25;
  const gap = 2;
  
  // Generate blocks based on view
  const renderBlocks = () => {
    const elements = [];
    
    if (view === 'top') {
      // Top view - show grid from above
      for (let row = 0; row < blocks.length; row++) {
        for (let col = 0; col < blocks[row].length; col++) {
          if (blocks[row][col] > 0) {
            const x = 20 + col * (blockSize + gap);
            const y = 20 + row * (blockSize + gap);
            elements.push(
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={blockSize}
                height={blockSize}
                fill="#6366f1"
                stroke="#4338ca"
                strokeWidth="2"
              />
            );
          }
        }
      }
    } else if (view === 'front') {
      // Front view - show heights
      const maxCols = Math.max(...blocks.map(row => row.length));
      for (let col = 0; col < maxCols; col++) {
        const height = blocks.reduce((max, row) => Math.max(max, row[col] || 0), 0);
        for (let h = 0; h < height; h++) {
          const x = 20 + col * (blockSize + gap);
          const y = size - 30 - h * (blockSize + gap);
          elements.push(
            <g key={`${col}-${h}`}>
              <rect
                x={x}
                y={y}
                width={blockSize}
                height={blockSize}
                fill="#6366f1"
                stroke="#4338ca"
                strokeWidth="2"
              />
              {/* 3D effect */}
              <path
                d={`M ${x + blockSize} ${y} L ${x + blockSize + 8} ${y - 8} L ${x + blockSize + 8} ${y + blockSize - 8} L ${x + blockSize} ${y + blockSize}`}
                fill="#818cf8"
                stroke="#4338ca"
                strokeWidth="1"
              />
              <path
                d={`M ${x} ${y} L ${x + 8} ${y - 8} L ${x + blockSize + 8} ${y - 8} L ${x + blockSize} ${y}`}
                fill="#a5b4fc"
                stroke="#4338ca"
                strokeWidth="1"
              />
            </g>
          );
        }
      }
    } else {
      // Side view - simplified
      for (let row = 0; row < blocks.length; row++) {
        const height = blocks[row].reduce((sum, val) => sum + val, 0);
        for (let h = 0; h < height; h++) {
          const x = 20 + h * (blockSize + gap);
          const y = 20 + row * (blockSize + gap);
          elements.push(
            <rect
              key={`${row}-${h}`}
              x={x}
              y={y}
              width={blockSize}
              height={blockSize}
              fill="#6366f1"
              stroke="#4338ca"
              strokeWidth="2"
            />
          );
        }
      }
    }
    
    return elements;
  };
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <text
        x={size / 2}
        y={15}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#333"
      >
        {view.charAt(0).toUpperCase() + view.slice(1)} view
      </text>
      {renderBlocks()}
    </svg>
  );
};

// Predefined block configurations for common questions
export const blockConfigurations = {
  LShape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
  TShape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
  Cross: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
  Corner: [[1, 1], [1, 0]],
  Steps: [[1, 0, 0], [1, 1, 0], [1, 1, 1]],
  Tower: [[2], [2], [2]],
};
