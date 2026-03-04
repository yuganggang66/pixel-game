import React, { useState, useEffect } from 'react';
import { PixelContainer } from '../components/PixelContainer';
import { PixelButton } from '../components/PixelButton';
import { Avatar } from '../components/Avatar';
import { Question } from '../services/api';

interface GameViewProps {
    questions: Question[];
    onGameEnd: (score: number) => void;
}

export const GameView: React.FC<GameViewProps> = ({ questions, onGameEnd }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // eslint-disable-next-line security/detect-object-injection
    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (currentIndex >= questions.length) {
            onGameEnd(score);
        }
    }, [currentIndex, questions.length, score, onGameEnd]);

    if (!currentQuestion) return null;

    const handleAnswer = (key: string) => {
        if (selectedAnswer || isAnimating) return; // Prevent double clicking

        setSelectedAnswer(key);
        setIsAnimating(true);

        const isCorrect = key === currentQuestion.answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Wait for animation then proceed
        setTimeout(() => {
            setSelectedAnswer(null);
            setIsAnimating(false);
            setCurrentIndex(prev => prev + 1);
        }, 1200);
    };

    const isBlinking = (key: string) => {
        return selectedAnswer !== null && key === currentQuestion.answer;
    };

    const getButtonVariant = (key: string) => {
        if (!selectedAnswer) return 'primary';

        if (key === currentQuestion.answer) {
            return 'success';
        }

        if (key === selectedAnswer && key !== currentQuestion.answer) {
            return 'danger';
        }

        return 'primary';
    };

    return (
        <div className={`game-view ${isAnimating && selectedAnswer !== currentQuestion.answer ? 'shake' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--secondary-color)' }}>
                <span>STAGE {currentIndex + 1}/{questions.length}</span>
                <span>SCORE: {score}</span>
            </div>

            <PixelContainer title="BOSS ENCOUNTER">
                <Avatar seed={currentQuestion.id.toString() + currentQuestion.question} />

                <div style={{
                    backgroundColor: 'var(--bg-color)',
                    padding: '15px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px',
                    minHeight: '80px',
                    textAlign: 'left'
                }}>
                    {currentQuestion.question}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {currentQuestion.options.map(option => (
                        <PixelButton
                            key={option.key}
                            variant={getButtonVariant(option.key)}
                            isBlinking={isBlinking(option.key)}
                            onClick={() => handleAnswer(option.key)}
                            style={{ margin: 0, padding: '15px 10px', fontSize: '0.9rem' }}
                        >
                            {option.key}. {option.value}
                        </PixelButton>
                    ))}
                </div>
            </PixelContainer>
        </div>
    );
};
