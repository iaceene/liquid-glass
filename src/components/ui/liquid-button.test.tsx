import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidButton, NimbusButtonIcons } from './liquid-button';

describe('LiquidButton component', () => {
  it('renders button with children', () => {
    render(<LiquidButton>Click me</LiquidButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('nimbus-btn');
  });

  it('handles click interactions', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<LiquidButton onClick={handleClick}>Clickable</LiquidButton>);

    const button = screen.getByRole('button', { name: /clickable/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders variant and tone data attributes', () => {
    const { rerender } = render(<LiquidButton variant="primary" tone="dark">Nimbus</LiquidButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-tone', 'dark');

    rerender(<LiquidButton variant="glass" tone="light">Glass</LiquidButton>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'glass');
    expect(button).toHaveAttribute('data-tone', 'light');

    rerender(<LiquidButton variant="destructive">Destructive</LiquidButton>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'destructive');
  });

  it('renders size and shape data attributes', () => {
    const { rerender } = render(<LiquidButton size="sm" shape="rounded">Small Rounded</LiquidButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveAttribute('data-shape', 'rounded');

    rerender(<LiquidButton size="lg" shape="pill">Large Pill</LiquidButton>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-shape', 'pill');
  });

  it('renders canvas element and fallback layers', () => {
    const { container } = render(<LiquidButton>Water Glass</LiquidButton>);
    const canvas = container.querySelector('canvas.nb-water');
    expect(canvas).toBeInTheDocument();

    const glass = container.querySelector('.nb-glass');
    expect(glass).toBeInTheDocument();

    const drop = container.querySelector('.nb-drop');
    expect(drop).toBeInTheDocument();
  });

  it('prevents click events when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <LiquidButton disabled onClick={handleClick}>
        Disabled
      </LiquidButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading spinner and disables button when loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <LiquidButton loading onClick={handleClick}>
        Processing
      </LiquidButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');

    // Loader icon should be present
    const spinner = button.querySelector('svg.nb-spin');
    expect(spinner).toBeInTheDocument();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders custom loadingText when loading', () => {
    render(
      <LiquidButton loading loadingText="Pumping...">
        Submit
      </LiquidButton>
    );

    expect(screen.getByText('Pumping...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('renders checkmark in success state', () => {
    render(<LiquidButton success>Done</LiquidButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-success', 'true');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('forwards ref correctly to the underlying HTML button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<LiquidButton ref={ref}>Ref test</LiquidButton>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.querySelector('.nb-content')?.textContent).toBe('Ref test');
  });

  it('handles pointer interactions and sound prop safely', () => {
    render(<LiquidButton sound>Interactive</LiquidButton>);
    const button = screen.getByRole('button', { name: /interactive/i });

    fireEvent.pointerDown(button, { clientX: 30, clientY: 15 });
    fireEvent.pointerMove(button, { clientX: 35, clientY: 18, pointerType: 'mouse' });
    fireEvent.pointerUp(button);
    fireEvent.pointerLeave(button);

    expect(button).toBeInTheDocument();
  });

  it('renders custom icons correctly', () => {
    render(
      <LiquidButton icon={NimbusButtonIcons.drop} rightIcon={NimbusButtonIcons.arrowRight}>
        With Icons
      </LiquidButton>
    );

    const button = screen.getByRole('button');
    const svgs = button.querySelectorAll('svg');
    expect(svgs.length).toBe(2);
  });

  it('renders checkout and pay variants with liquid dots and checkmark', () => {
    const { rerender } = render(<LiquidButton variant="checkout" loading loadingText="Processing">Sign in</LiquidButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'checkout');
    expect(button.querySelector('.nb-dots')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();

    rerender(<LiquidButton variant="checkout" success>Sign in</LiquidButton>);
    button = screen.getByRole('button');
    expect(button.querySelector('.nb-check-anim')).toBeInTheDocument();

    rerender(<LiquidButton variant="pay" disableWater>Pay Now</LiquidButton>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'pay');
    expect(button).toHaveAttribute('data-disable-water', 'true');
  });
});
