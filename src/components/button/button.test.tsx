import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button, CheckoutButton, LiquidCheckoutButton } from './button';

describe('Button component (LiquidButton alias)', () => {
  it('renders correctly as a button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('supports variants and tones', () => {
    const { rerender } = render(<Button variant="glass" tone="dark">Glass</Button>);
    const btn = screen.getByRole('button', { name: /glass/i });
    expect(btn).toHaveAttribute('data-variant', 'glass');
    expect(btn).toHaveAttribute('data-tone', 'dark');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button', { name: /destructive/i })).toHaveAttribute('data-variant', 'destructive');
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('renders CheckoutButton and LiquidCheckoutButton with checkout variant', () => {
    const { rerender } = render(<CheckoutButton>Pay $50.00</CheckoutButton>);
    const checkoutBtn = screen.getByRole('button', { name: /pay \$50\.00/i });
    expect(checkoutBtn).toBeInTheDocument();
    expect(checkoutBtn).toHaveAttribute('data-variant', 'checkout');
    expect(checkoutBtn).toHaveAttribute('data-shape', 'pill');

    rerender(<LiquidCheckoutButton>Confirm Order</LiquidCheckoutButton>);
    expect(screen.getByRole('button', { name: /confirm order/i })).toHaveAttribute('data-variant', 'checkout');
  });
});
