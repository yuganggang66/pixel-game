import React from 'react';
import { useAudio } from '../shared/contexts/AudioContext';

const toggleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 1000,
    textShadow: '2px 2px 0px #000',
    transition: 'transform 0.1s ease',
};

export const AudioToggle: React.FC = () => {
    const { muted, toggleMute } = useAudio();

    return (
        <button
            style={toggleStyle}
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            {muted ? '🔇' : '🔊'}
        </button>
    );
};
