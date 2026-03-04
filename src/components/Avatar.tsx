import React from 'react';

interface AvatarProps {
    seed: string;
    size?: number;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    seed,
    size = 120,
    className = ''
}) => {
    // Use DiceBear pixel-art style
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;

    const containerStyle = {
        width: size,
        height: size,
        backgroundColor: '#fff',
        boxShadow: 'var(--pixel-shadow)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 1.5rem auto'
    };

    return (
        <div style={containerStyle} className={`avatar-container ${className}`}>
            <img
                src={avatarUrl}
                alt={`Avatar for ${seed}`}
                width={size * 0.9}
                height={size * 0.9}
                style={{ imageRendering: 'pixelated' }}
            />
        </div>
    );
};
