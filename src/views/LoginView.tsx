import React, { useState } from 'react';
import { PixelContainer } from '../components/PixelContainer';
import { PixelButton } from '../components/PixelButton';

interface LoginViewProps {
    onLogin: (id: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId.trim()) {
            onLogin(userId.trim());
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '1.2rem',
        fontFamily: 'inherit',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        border: '2px solid var(--border-color)',
        outline: 'none',
        marginBottom: '20px',
        textAlign: 'center' as const
    };

    return (
        <div className="login-view">
            <h1 className="blink" style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginBottom: '2rem' }}>
                PIXEL TRIVIA
            </h1>

            <PixelContainer title="INSERT COIN">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ marginBottom: '10px', fontSize: '0.9rem' }}>ENTER PLAYER ID:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g. PLAYER_1"
                        style={inputStyle}
                        autoFocus
                    />
                    <PixelButton type="submit" disabled={!userId.trim()}>
                        START GAME
                    </PixelButton>
                </form>
            </PixelContainer>
        </div>
    );
};
