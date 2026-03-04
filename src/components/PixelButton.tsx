import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  isBlinking?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isBlinking = false,
  ...props 
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'secondary': return 'var(--secondary-color)';
      case 'danger': return 'var(--danger-color)';
      case 'success': return 'var(--success-color)';
      default: return 'var(--primary-color)';
    }
  };

  const buttonStyle = {
    backgroundColor: getVariantColor(),
    color: '#fff',
    padding: '12px 24px',
    fontSize: '1rem',
    textTransform: 'uppercase' as const,
    boxShadow: 'var(--pixel-shadow)',
    margin: '10px',
    transition: 'transform 0.1s, filter 0.1s',
  };

  return (
    <button
      className={`pixel-button ${isBlinking ? 'blink' : ''} ${className}`}
      style={buttonStyle}
      onMouseOver={(e) => {
        (e.target as HTMLButtonElement).style.filter = 'brightness(1.2)';
      }}
      onMouseOut={(e) => {
        (e.target as HTMLButtonElement).style.filter = 'brightness(1)';
      }}
      onMouseDown={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};
