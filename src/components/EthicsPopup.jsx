import React from 'react';
import { motion } from 'framer-motion';

export default function EthicsPopup({ message, onContinue }) {
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
        initial={{ scale: 0.5, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          backgroundColor: '#1f2937',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          border: '2px solid var(--color-secondary)'
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '20px' }}>🌟</div>
        <h2 style={{
          fontSize: '32px',
          color: 'var(--color-primary)',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          {message.title}
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-text-light)',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          {message.message}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          style={{
            padding: '12px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'var(--color-secondary)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.5)'
          }}
        >
          Continue →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}