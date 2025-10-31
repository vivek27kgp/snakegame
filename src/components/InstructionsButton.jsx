import React from 'react';
import { motion } from 'framer-motion';

export default function InstructionsButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        border: '3px solid var(--color-secondary)',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(255, 140, 0, 0.5)',
        zIndex: 100,
        fontWeight: 'bold'
      }}
    >
      ℹ️
    </motion.button>
  );
}