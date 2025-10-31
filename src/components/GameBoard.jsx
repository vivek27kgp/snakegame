import React from 'react';
import { motion } from 'framer-motion';

// Snake Component with enhanced appearance
const Snake = ({ snake, direction, cellSize }) => {
  const getRotation = () => {
    if (direction.x === 1) return 0;  // RIGHT
    if (direction.y === 1) return 90; // DOWN
    if (direction.x === -1) return 180; // LEFT
    if (direction.y === -1) return 270; // UP
    return 0;
  };

  return (
    <>
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === snake.length - 1;
        const opacity = 1 - (index / snake.length) * 0.3;
        
        return (
          <motion.div
            key={`${segment.x}-${segment.y}-${index}`}
            initial={{ scale: 0 }}
            animate={{ 
              scale: isHead ? [1, 1.05, 1] : 1,
              rotate: isHead ? getRotation() : 0
            }}
            transition={{ 
              scale: { repeat: Infinity, duration: 0.3 },
              duration: 0.1 
            }}
            style={{
              position: 'absolute',
              left: `${segment.x * cellSize}px`,
              top: `${segment.y * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              background: isHead 
                ? 'radial-gradient(circle at 30% 30%, var(--color-snake-head), var(--color-snake-bright))'
                : `linear-gradient(135deg, var(--color-snake-bright), var(--color-snake-dark))`,
              borderRadius: isHead ? '50% 50% 40% 40%' : isTail ? '40%' : '30%',
              border: `2px solid ${isHead ? 'var(--color-snake-head)' : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: isHead 
                ? '0 0 15px rgba(76, 175, 80, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)'
                : '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
              zIndex: snake.length - index,
              opacity: opacity,
              transform: isHead ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {isHead && (
              <div style={{
                position: 'absolute',
                top: '35%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px'
              }}>
                <div style={{
                  width: '3px',
                  height: '3px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 3px rgba(0,0,0,0.8)'
                }} />
                <div style={{
                  width: '3px',
                  height: '3px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 3px rgba(0,0,0,0.8)'
                }} />
              </div>
            )}
          </motion.div>
        );
      })}
    </>
  );
};

// Fruit Component
const Fruit = ({ position, cellSize }) => {
  if (!position) return null;
  
  const getFruitEmoji = () => {
    if (position.type === 'special') {
      return position.value === 2 ? '🍊' : '🍇'; // Orange for 2pts, Grapes for 3pts
    }
    return '🍎'; // Apple for 1pt
  };
  
  const getFruitGlow = () => {
    if (position.type === 'special') {
      return position.value === 2 
        ? 'drop-shadow(0 0 12px rgba(255, 165, 0, 0.8))' // Orange glow
        : 'drop-shadow(0 0 12px rgba(128, 0, 128, 0.8))'; // Purple glow
    }
    return 'drop-shadow(0 0 8px rgba(255, 99, 71, 0.6))'; // Red glow
  };
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ 
        scale: position.type === 'special' ? [1, 1.3, 1] : [1, 1.2, 1]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: position.type === 'special' ? 0.8 : 1 }
      }}
      style={{
        position: 'absolute',
        left: `${position.x * cellSize}px`,
        top: `${position.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: position.type === 'special' ? '18px' : '16px',
        zIndex: 2,
        filter: getFruitGlow()
      }}
    >
      {getFruitEmoji()}
    </motion.div>
  );
};

export default function GameBoard({ snake, fruit, gridSize, cellSize, direction }) {
  const maxWidth = window.innerWidth - 20;
  const maxHeight = window.innerHeight - 300;
  const boardSize = Math.min(maxWidth, maxHeight, 400);
  const actualCellSize = boardSize / gridSize;
  
  return (
    <div style={{
      position: 'relative',
      width: `${boardSize}px`,
      height: `${boardSize}px`,
      backgroundColor: 'var(--color-dark-bg)',
      border: '3px solid var(--color-secondary)',
      borderRadius: '15px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.3)',
      backgroundImage: `
        linear-gradient(var(--color-grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)
      `,
      backgroundSize: `${actualCellSize}px ${actualCellSize}px`,
      overflow: 'hidden'
    }}>
      <Snake snake={snake} direction={direction} cellSize={actualCellSize} />
      <Fruit position={fruit} cellSize={actualCellSize} />
    </div>
  );
}