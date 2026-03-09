import React, { useState, useEffect } from 'react';
import { PixelContainer } from '../../shared/components/PixelContainer';
import { PixelButton } from '../../shared/components/PixelButton';
import { useAudio } from '../audio/AudioManager';
import { getQuizSummary } from '../../domain/quiz/quizDomain';
import { fetchLeaderboard, LeaderboardEntry } from '../ranking/RankingManager';

interface ResultViewProps {
    playerName: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    threshold: number;
    onRetry: () => void;
    onViewLeaderboard: () => void;
    onSubmitScore: () => Promise<void>;
}

export const ResultView: React.FC<ResultViewProps> = ({
    playerName,
    score,
    correctCount,
    totalQuestions: total,
    threshold,
    onRetry,
    onViewLeaderboard,
    onSubmitScore
}) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoadingRanks, setIsLoadingRanks] = useState(true);
    const { playGameOver, playCorrect } = useAudio();
    const { isPass, percentage, message } = getQuizSummary({ score: correctCount, total, threshold });

    useEffect(() => {
        if (isPass) {
            playCorrect();
        } else {
            playGameOver();
        }
    }, [isPass, playGameOver, playCorrect]);

    useEffect(() => {
        let mounted = true;
        const submitAndFetch = async () => {
            setIsLoadingRanks(true);
            await onSubmitScore();
            const data = await fetchLeaderboard();
            if (mounted) {
                setEntries(data);
                setIsLoadingRanks(false);
            }
        };
        submitAndFetch();
        return () => { mounted = false; };
    }, [onSubmitScore]);

    const getRankColor = (index: number) => {
        if (index === 0) return '#FFD700'; // Gold
        if (index === 1) return '#C0C0C0'; // Silver
        if (index === 2) return '#CD7F32'; // Bronze
        return 'var(--text-color)';
    };

    return (
        <div className="result-view" style={{ textAlign: 'center', padding: '20px 0' }}>
            <h1 className={`stagger-1 neon-text-primary ${isPass ? 'pop-effect' : 'glitch'}`} style={{
                color: isPass ? 'var(--success-color)' : 'var(--danger-color)',
                fontSize: '3.5rem',
                marginBottom: '2rem',
                filter: isPass ? 'drop-shadow(0 0 15px var(--success-color))' : 'drop-shadow(0 0 15px var(--danger-color))'
            }}>
                {message}
            </h1>

            <PixelContainer title="MISSION COMPLETE" variant="glass" className="stagger-2">
                <div style={{ fontSize: '1.2rem', margin: '20px 0', lineHeight: 2 }}>
                    <div style={{
                        margin: '20px auto',
                        width: 'fit-content',
                        padding: '10px 30px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--secondary-color)',
                        boxShadow: 'var(--cyan-glow)',
                        borderRadius: '4px'
                    }}>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)', letterSpacing: '2px' }}>FINAL SCORE</p>
                        <p style={{
                            margin: 0,
                            color: 'var(--secondary-color)',
                            fontSize: '3rem',
                            fontFamily: 'var(--font-heading)',
                            textShadow: 'var(--cyan-glow)'
                        }} className="tabular-nums">{score}</p>
                    </div>

                    <p className="neon-text-secondary tabular-nums" style={{ margin: '15px 0' }}>
                        ACCURACY: {correctCount}/{total} ({percentage}%)
                    </p>

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                        <p style={{ fontSize: '0.8rem', marginBottom: '15px', color: 'var(--secondary-color)', letterSpacing: '2px' }}>TOP RANKINGS</p>
                        {isLoadingRanks ? (
                            <div className="blink" style={{ fontSize: '0.9rem' }}>SYNCING RECORDS...</div>
                        ) : (
                            <table style={{ width: '100%', maxWidth: '400px', margin: '0 auto', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <tbody>
                                    {entries.slice(0, 3).map((entry, index) => (
                                        <tr key={index} style={{ color: getRankColor(index), borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <td style={{ padding: '8px 4px', textAlign: 'left' }}>#{index + 1}</td>
                                            <td style={{ padding: '8px 4px', textAlign: 'left' }}>{entry.name}</td>
                                            <td style={{ padding: '8px 4px', textAlign: 'right' }} className="tabular-nums">{entry.score}</td>
                                        </tr>
                                    ))}
                                    {(() => {
                                        const myRank = entries.findIndex(e => e.name === playerName);
                                        if (myRank > 2) {
                                            return (
                                                <tr style={{ color: 'var(--success-color)' }}>
                                                    <td style={{ padding: '8px 4px', textAlign: 'left' }}>#{myRank + 1}</td>
                                                    <td style={{ padding: '8px 4px', textAlign: 'left' }}>{playerName} (YOU)</td>
                                                    <td style={{ padding: '8px 4px', textAlign: 'right' }} className="tabular-nums">{score}</td>
                                                </tr>
                                            );
                                        } else if (myRank !== -1) {
                                            return (
                                                <tr style={{ color: 'var(--success-color)' }}>
                                                    <td colSpan={3} style={{ padding: '8px 4px', textAlign: 'center' }}>★ YOU ARE IN THE TOP 3 ★</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })()}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                    <PixelButton variant="primary" onClick={onRetry}>
                        REBOOT
                    </PixelButton>
                    <PixelButton variant="secondary" onClick={onViewLeaderboard}>
                        RANKS
                    </PixelButton>
                </div>
            </PixelContainer>
        </div>
    );
};

