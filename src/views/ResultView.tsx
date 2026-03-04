import React from 'react';
import { PixelContainer } from '../components/PixelContainer';
import { PixelButton } from '../components/PixelButton';

interface ResultViewProps {
    score: number;
    totalQuestions: number;
    threshold: number;
    onRetry: () => void;
    isSubmitting: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
    score,
    totalQuestions,
    threshold,
    onRetry,
    isSubmitting
}) => {
    const isPass = score >= threshold;

    return (
        <div className="result-view" style={{ textAlign: 'center' }}>
            <h2 style={{
                color: isPass ? 'var(--success-color)' : 'var(--danger-color)',
                fontSize: '2.5rem',
                marginBottom: '2rem'
            }}>
                {isPass ? 'STAGE CLEAR!' : 'GAME OVER'}
            </h2>

            <PixelContainer title="RESULTS">
                <div style={{ fontSize: '1.2rem', margin: '20px 0', lineHeight: 2 }}>
                    <p>QUESTIONS: {totalQuestions}</p>
                    <p>SCORE: <span style={{ color: 'var(--secondary-color)', fontSize: '1.5rem' }}>{score}</span></p>
                    <p>REQUIRED: {threshold}</p>

                    <div style={{ marginTop: '20px', borderTop: '2px dashed var(--border-color)', paddingTop: '20px' }}>
                        {isSubmitting ? (
                            <p className="blink" style={{ color: 'var(--primary-hover)' }}>Saving score to server...</p>
                        ) : (
                            <p style={{ color: 'var(--success-color)' }}>Score saved successfully!</p>
                        )}
                    </div>
                </div>

                <PixelButton
                    onClick={onRetry}
                    disabled={isSubmitting}
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    PLAY AGAIN
                </PixelButton>
            </PixelContainer>
        </div>
    );
};
