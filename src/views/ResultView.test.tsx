import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultView } from './ResultView';

describe('ResultView Component', () => {
    it('renders STAGE CLEAR when score meets the threshold', () => {
        render(<ResultView score={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} isSubmitting={false} />);

        const title = screen.getByText('STAGE CLEAR!');
        expect(title).toBeInTheDocument();
        expect(title.style.color).toBe('var(--success-color)');
    });

    it('renders GAME OVER when score is below the threshold', () => {
        render(<ResultView score={2} totalQuestions={5} threshold={3} onRetry={vi.fn()} isSubmitting={false} />);

        const title = screen.getByText('GAME OVER');
        expect(title).toBeInTheDocument();
        expect(title.style.color).toBe('var(--danger-color)');
    });

    it('shows saving indicator when isSubmitting is true and disables retry button', () => {
        render(<ResultView score={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} isSubmitting={true} />);

        expect(screen.getByText('Saving score to server...')).toBeInTheDocument();

        const retryButton = screen.getByText('PLAY AGAIN');
        expect(retryButton).toBeDisabled();
    });

    it('shows success message when isSubmitting is false and enables retry button', () => {
        render(<ResultView score={3} totalQuestions={5} threshold={3} onRetry={vi.fn()} isSubmitting={false} />);

        expect(screen.getByText('Score saved successfully!')).toBeInTheDocument();

        const retryButton = screen.getByText('PLAY AGAIN');
        expect(retryButton).not.toBeDisabled();
    });

    it('triggers onRetry when retry button is clicked', () => {
        const handleRetry = vi.fn();
        render(<ResultView score={3} totalQuestions={5} threshold={3} onRetry={handleRetry} isSubmitting={false} />);

        fireEvent.click(screen.getByText('PLAY AGAIN'));
        expect(handleRetry).toHaveBeenCalledTimes(1);
    });
});
