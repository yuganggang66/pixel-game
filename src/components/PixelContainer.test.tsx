import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PixelContainer } from './PixelContainer';

describe('PixelContainer Component', () => {
    it('renders children correctly', () => {
        render(<PixelContainer><div>Inner Content</div></PixelContainer>);
        expect(screen.getByText('Inner Content')).toBeInTheDocument();
    });

    it('renders title if provided', () => {
        render(<PixelContainer title="Boss Phase">Content</PixelContainer>);
        expect(screen.getByText('Boss Phase')).toBeInTheDocument();
    });

    it('does not render title if not provided', () => {
        const { container } = render(<PixelContainer>Only Content</PixelContainer>);
        // Since the title div is only added when title exists, it shouldn't be there
        // The title div has a style position absolute. It's safer to just check children length or specific style
        expect(container.firstChild?.childNodes.length).toBe(1); // Only the children
        expect(screen.queryByText('Boss Phase')).not.toBeInTheDocument();
    });
});
