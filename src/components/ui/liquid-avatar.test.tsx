import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiquidAvatar } from './liquid-avatar';

describe('LiquidAvatar component', () => {
  it('renders image when src is valid', () => {
    render(<LiquidAvatar src="https://example.com/avatar.png" alt="Test User" />);
    const img = screen.getByAltText('Test User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('renders fallback when image fails to load', () => {
    render(<LiquidAvatar src="https://example.com/broken.png" alt="Broken" fallback="BR" />);
    const img = screen.getByAltText('Broken');

    fireEvent.error(img);
    expect(screen.getByText('BR')).toBeInTheDocument();
  });

  it('renders default user silhouette when no fallback is provided and src fails', () => {
    const { container } = render(<LiquidAvatar src="invalid-url" alt="Fallback" />);
    const img = screen.getByAltText('Fallback');

    fireEvent.error(img);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders live status bead', () => {
    const { container } = render(<LiquidAvatar status="online" />);
    const status = container.querySelector('.nav-status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('data-state', 'online');
  });

  it('handles size and ring attributes', () => {
    const { container } = render(<LiquidAvatar size="xl" ring />);
    const avatar = container.querySelector('.nimbus-avatar');
    expect(avatar).toHaveAttribute('data-size', 'xl');
    expect(avatar).toHaveAttribute('data-ring', 'true');
  });
});
