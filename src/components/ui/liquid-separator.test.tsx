import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiquidSeparator } from './liquid-separator';

describe('LiquidSeparator component', () => {
  it('renders with separator role and default horizontal orientation', () => {
    render(<LiquidSeparator />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders with vertical orientation', () => {
    render(<LiquidSeparator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('omits separator role when decorative is true', () => {
    const { container } = render(<LiquidSeparator decorative />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(container.querySelector('.nimbus-separator')).toBeInTheDocument();
  });

  it('applies shimmer and tone data attributes', () => {
    const { container } = render(<LiquidSeparator shimmer tone="dark" />);
    const separator = container.querySelector('.nimbus-separator');
    expect(separator).toHaveAttribute('data-shimmer', 'true');
    expect(separator).toHaveAttribute('data-tone', 'dark');
  });
});
