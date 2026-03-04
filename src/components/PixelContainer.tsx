import React from 'react';

interface PixelContainerProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const PixelContainer: React.FC<PixelContainerProps> = ({
    children,
    className = '',
    title
}) => {
    const containerStyle = {
        backgroundColor: 'var(--card-bg)',
        boxShadow: 'var(--pixel-shadow), inset 0 0 0 4px var(--bg-color), inset 0 0 0 8px var(--border-color)',
        padding: '32px 24px 24px 24px',
        margin: '16px',
        position: 'relative' as const,
        width: '100%',
    };

    const titleStyle = {
        position: 'absolute' as const,
        top: '-15px',
        left: '20px',
        backgroundColor: 'var(--bg-color)',
        boxShadow: 'var(--pixel-shadow)',
        padding: '2px 12px',
        color: 'var(--secondary-color)',
        fontSize: '0.8rem',
    };

    return (
        <div className={`pixel-container ${className}`} style={containerStyle}>
            {title && <div style={titleStyle}>{title}</div>}
            {children}
        </div>
    );
};
