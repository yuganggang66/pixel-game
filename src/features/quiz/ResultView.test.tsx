import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultView } from './ResultView';

vi.mock('../audio/AudioManager', () => ({
    useAudio: () => ({
        playGameOver: vi.fn(),
        playCorrect: vi.fn(),
        playHover: vi.fn(),
        playClick: vi.fn(),
    })
}));

vi.mock('../ranking/RankingManager', () => ({
    fetchLeaderboard: vi.fn().mockResolvedValue([
        { name: 'HERO', score: 500, timestamp: '2026-01-01T00:00:00.000Z' },
        { name: 'PLAYER2', score: 300, timestamp: '2026-01-01T00:00:00.000Z' }
    ])
}));

describe('ResultView Component', () => {
    it('renders STAGE CLEAR! when accuracy meets the threshold', async () => {
        const handleSubmit = vi.fn().mockResolvedValue(undefined);
        await act(async () => {
            render(<ResultView playerName="HERO" score={300} correctCount={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} onViewLeaderboard={vi.fn()} onSubmitScore={handleSubmit} />);
        });
        expect(screen.getByText('STAGE CLEAR!')).toBeInTheDocument();
        expect(handleSubmit).toHaveBeenCalled(); // Auto-submitted
    });

    it('renders top rankings after submit', async () => {
        const handleSubmit = vi.fn().mockResolvedValue(undefined);
        await act(async () => {
            render(<ResultView playerName="HERO" score={300} correctCount={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} onViewLeaderboard={vi.fn()} onSubmitScore={handleSubmit} />);
        });

        await waitFor(() => {
            expect(screen.getByText('HERO')).toBeInTheDocument();
            expect(screen.getByText('PLAYER2')).toBeInTheDocument();
        });
    });

    it('triggers onViewLeaderboard when leaderboard is clicked', async () => {
        const handleViewLeaderboard = vi.fn();
        await act(async () => {
            render(<ResultView playerName="HERO" score={300} correctCount={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} onViewLeaderboard={handleViewLeaderboard} onSubmitScore={vi.fn().mockResolvedValue(undefined)} />);
        });

        fireEvent.click(screen.getByText('RANKS'));
        expect(handleViewLeaderboard).toHaveBeenCalled();
    });

    it('triggers onRetry when try again is clicked', async () => {
        const handleRetry = vi.fn();
        await act(async () => {
            render(<ResultView playerName="HERO" score={300} correctCount={3} totalQuestions={5} threshold={3} onRetry={handleRetry} onViewLeaderboard={vi.fn()} onSubmitScore={vi.fn().mockResolvedValue(undefined)} />);
        });

        fireEvent.click(screen.getByText('REBOOT'));
        expect(handleRetry).toHaveBeenCalledTimes(1);
    });
});
