import React from 'react';
import { motion } from 'framer-motion';

export default function GameOverModal({ score, onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          backgroundColor: '#1f2937',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
          border: '2px solid #e74c3c'
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          style={{ fontSize: '48px', marginBottom: '20px' }}
        >
          😔
        </motion.div>
        <h2 style={{
          fontSize: '36px',
          color: '#e74c3c',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          Game Over!
        </h2>
        <p style={{
          fontSize: '20px',
          color: 'var(--color-text-light)',
          marginBottom: '10px'
        }}>
          Final Score
        </p>
        <p style={{
          fontSize: '42px',
          color: 'var(--color-primary)',
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          {score}
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRestart}
          style={{
            padding: '15px 50px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'var(--color-primary)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.5)'
          }}
        >
          🔄 Restart Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
}