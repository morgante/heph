'use client';

import { useState } from 'react';

interface PrettyButtonProps {
  onClick?: () => void;
}

export default function PrettyButton({ onClick }: PrettyButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    padding: '16px 48px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    background: isPressed
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    outline: 'none',
    overflow: 'hidden',
    transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isPressed
      ? '0 4px 15px rgba(102, 126, 234, 0.3)'
      : isHovered
        ? '0 15px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)'
        : '0 10px 25px rgba(102, 126, 234, 0.3)',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  };

  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    animation: isHovered ? 'shimmer 1.5s infinite' : 'none',
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <button
        type="button"
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        <div style={shimmerStyle} />
        <span style={{ position: 'relative', zIndex: 1 }}>HELLO!</span>
      </button>
    </>
  );
}

