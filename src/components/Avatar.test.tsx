import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
    it('renders an image with deterministic src based on the seed', () => {
        const testSeed = 'test-seed-123';
        render(<Avatar seed={testSeed} />);

        const imgElement = screen.getByRole('img');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', expect.stringContaining(testSeed));
        expect(imgElement).toHaveAttribute('alt', `Avatar for ${testSeed}`);
    });

    it('applies custom size and className properly', () => {
        const { container } = render(<Avatar seed="test" size={200} className="custom-test-class" />);

        const divElement = container.firstChild as HTMLElement;
        expect(divElement).toHaveClass('custom-test-class');
        expect(divElement.style.width).toBe('200px');
        expect(divElement.style.height).toBe('200px');
    });
});
