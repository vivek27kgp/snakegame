import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreBoard({ score }) {
  const displayScore = Math.floor(score / 2);
  
  return (
    <motion.div
      key={displayScore}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.3 }}
      style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'var(--color-text-light)',
        marginBottom: '20px',
        textAlign: 'center',
        textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
      }}
    >
      🏆 Score: <span style={{ color: 'var(--color-primary)' }}>{displayScore}</span>
    </motion.div>
  );
}