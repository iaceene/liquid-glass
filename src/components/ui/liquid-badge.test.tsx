import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiquidBadge } from './liquid-badge';

describe('LiquidBadge component', () => {
  it('renders badge children correctly', () => {
    render(<LiquidBadge>Active</LiquidBadge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders status dot when dot is true', () => {
    const { container } = render(<LiquidBadge dot>Online</LiquidBadge>);
    const dot = container.querySelector('.nbd-dot');
    expect(dot).toBeInTheDocument();
  });

  it('applies variant, size, and tone attributes', () => {
    const { container, rerender } = render(<LiquidBadge variant="destructive" size="sm" tone="dark">Critical</LiquidBadge>);
    let badge = container.querySelector('.nimbus-badge');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
    expect(badge).toHaveAttribute('data-size', 'sm');
    expect(badge).toHaveAttribute('data-tone', 'dark');

    rerender(<LiquidBadge variant="glass" size="lg" tone="light">Refract</LiquidBadge>);
    badge = container.querySelector('.nimbus-badge');
    expect(badge).toHaveAttribute('data-variant', 'glass');
    expect(badge).toHaveAttribute('data-size', 'lg');
    expect(badge).toHaveAttribute('data-tone', 'light');
  });

  it('renders glass layer', () => {
    const { container } = render(<LiquidBadge>Glass</LiquidBadge>);
    expect(container.querySelector('.nbd-glass')).toBeInTheDocument();
  });
});
