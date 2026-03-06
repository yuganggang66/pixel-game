import React, { useState } from 'react';
import { PixelContainer } from '../../shared/components/PixelContainer';
import { PixelButton } from '../../shared/components/PixelButton';

import './auth.css';

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

    return (
        <div className="login-view">
            <h1 className="stagger-1">
                PIXEL QUIZ
            </h1>

            <PixelContainer title="LOGIN" className="stagger-2">
                <form onSubmit={handleSubmit} className="auth-form">
                    <label className="auth-label">ENTER PLAYER ID:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g. PLAYER_1"
                        className="auth-input"
                        autoFocus
                    />
                    <PixelButton type="submit" className="stagger-3" disabled={!userId.trim()}>
                        START GAME
                    </PixelButton>
                </form>
            </PixelContainer>
        </div>
    );
};
