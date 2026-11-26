import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  LiquidCard,
  LiquidCardHeader,
  LiquidCardTitle,
  LiquidCardDescription,
  LiquidCardContent,
  LiquidCardFooter,
} from './liquid-card';

describe('LiquidCard component', () => {
  it('renders card with all slots', () => {
    render(
      <LiquidCard>
        <LiquidCardHeader>
          <LiquidCardTitle>Card Title</LiquidCardTitle>
          <LiquidCardDescription>Card description text</LiquidCardDescription>
        </LiquidCardHeader>
        <LiquidCardContent>
          <p>Main content area</p>
        </LiquidCardContent>
        <LiquidCardFooter>
          <button type="button">Action</button>
        </LiquidCardFooter>
      </LiquidCard>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description text')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders canvas element when water is true', () => {
    const { container } = render(<LiquidCard water>Water Slab</LiquidCard>);
    const canvas = container.querySelector('canvas.nc-water');
    expect(canvas).toBeInTheDocument();
  });

  it('omits canvas when water is false', () => {
    const { container } = render(<LiquidCard water={false}>Plain Glass</LiquidCard>);
    const canvas = container.querySelector('canvas.nc-water');
    expect(canvas).not.toBeInTheDocument();
  });

  it('handles tone and theme data attributes', () => {
    const { container, rerender } = render(<LiquidCard tone="dark" theme="deep">Deep Card</LiquidCard>);
    const scene = container.querySelector('.nimbus-card-scene');
    expect(scene).toHaveAttribute('data-tone', 'dark');

    rerender(<LiquidCard tone="light" theme="sky">Sky Card</LiquidCard>);
    expect(scene).toHaveAttribute('data-tone', 'light');
  });

  it('handles pointer movements without error', () => {
    const { container } = render(<LiquidCard tilt>Interactive Slab</LiquidCard>);
    const card = container.querySelector('.nimbus-card');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.pointerMove(card, { clientX: 50, clientY: 50, pointerType: 'mouse' });
      fireEvent.pointerDown(card, { clientX: 60, clientY: 60 });
      fireEvent.pointerLeave(card);
    }
  });
});
