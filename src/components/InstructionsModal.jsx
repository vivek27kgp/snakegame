import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InstructionsModal({ onClose }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1f2937',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxWidth: '500px',
          width: '100%',
          border: '2px solid var(--color-primary)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--color-text-light)',
            padding: '5px 10px'
          }}
        >
          ✕
        </button>
        <h2 style={{
          fontSize: '28px',
          color: 'var(--color-primary)',
          marginBottom: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🎮 How to Play
        </h2>
        <div style={{ fontSize: '16px', color: 'var(--color-text-light)', lineHeight: '1.8', marginBottom: '15px' }}>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: 'var(--color-secondary)' }}>🎯 Objective:</strong><br/>
            Eat fruits to grow your snake and earn points!
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: 'var(--color-secondary)' }}>🎮 Controls:</strong><br/>
            {isMobile ? (
              <span>📱 <strong>Swipe</strong> on screen (Up/Down/Left/Right) to move</span>
            ) : (
              <span>⌨️ Use <strong>Arrow Keys (↑↓←→)</strong> or <strong>W/A/S/D</strong> to move</span>
            )}
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: 'var(--color-secondary)' }}>🌟 Special Feature:</strong><br/>
            Receive ethical wisdom messages as you play!
          </p>
          <p>
            <strong style={{ color: 'var(--color-secondary)' }}>⚠️ Avoid:</strong><br/>
            Don't hit walls or your own body!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'var(--color-secondary)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Got it!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}