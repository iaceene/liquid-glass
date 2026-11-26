import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LiquidSkeleton } from './liquid-skeleton';

describe('LiquidSkeleton component', () => {
  it('renders with default text variant and aria-hidden', () => {
    const { container } = render(<LiquidSkeleton />);
    const skeleton = container.querySelector('.nimbus-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('data-variant', 'text');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports circular and rectangular variants with custom dimensions', () => {
    const { container, rerender } = render(<LiquidSkeleton variant="circular" width={48} height={48} />);
    let skeleton = container.querySelector('.nimbus-skeleton') as HTMLElement;
    expect(skeleton).toHaveAttribute('data-variant', 'circular');
    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('48px');

    rerender(<LiquidSkeleton variant="rectangular" width="100%" height={120} />);
    skeleton = container.querySelector('.nimbus-skeleton') as HTMLElement;
    expect(skeleton).toHaveAttribute('data-variant', 'rectangular');
    expect(skeleton.style.height).toBe('120px');
  });

  it('applies tone data attribute', () => {
    const { container } = render(<LiquidSkeleton tone="dark" />);
    const skeleton = container.querySelector('.nimbus-skeleton');
    expect(skeleton).toHaveAttribute('data-tone', 'dark');
  });
});
