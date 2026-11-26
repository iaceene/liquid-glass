import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click interactions', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole('button', { name: /clickable/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders all variant classes accurately', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border-input');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('underline-offset-4');

    rerender(<Button variant="glass">Glass</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('backdrop-blur-md');
  });

  it('renders all size classes correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');

    rerender(<Button size="icon" aria-label="Icon">Icon</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('w-10');
  });

  it('applies custom className', () => {
    render(<Button className="custom-test-class">Styled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-test-class');
  });

  it('prevents click events when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
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
      <Button loading onClick={handleClick}>
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    // Loader icon should be present
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders custom loadingText when loading', () => {
    render(
      <Button loading loadingText="Processing...">
        Submit
      </Button>
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('forwards ref correctly to the underlying HTML button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref test');
  });

  it('supports native button type attribute', () => {
    render(<Button type="submit">Submit form</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('sets data-liquid-tone attribute when tone prop is provided', () => {
    const { rerender } = render(<Button tone="dark">Dark Tone</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-liquid-tone', 'dark');

    rerender(<Button tone="light">Light Tone</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-liquid-tone', 'light');
  });

  it('creates ripple effect on pointer down and respects disableRipple', () => {
    const { unmount } = render(<Button>Ripple Test</Button>);
    const button = screen.getByRole('button', { name: /ripple test/i });

    fireEvent.pointerDown(button, { clientX: 20, clientY: 10 });
    const ripple = button.querySelector('.animate-liquid-ripple');
    expect(ripple).toBeInTheDocument();

    unmount();

    render(<Button disableRipple>No Ripple</Button>);
    const noRippleButton = screen.getByRole('button', { name: /no ripple/i });
    fireEvent.pointerDown(noRippleButton, { clientX: 20, clientY: 10 });
    const noRipples = noRippleButton.querySelectorAll('.animate-liquid-ripple');
    expect(noRipples.length).toBe(0);
  });

  it('renders canvas element for WebGL water simulation on non-link buttons', () => {
    const { container, rerender } = render(<Button>Water Button</Button>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    rerender(<Button variant="link">Link Button</Button>);
    const linkCanvas = container.querySelector('canvas');
    expect(linkCanvas).not.toBeInTheDocument();
  });

  it('handles pointer interactions and sound prop safely', () => {
    render(<Button sound>Interactive</Button>);
    const button = screen.getByRole('button', { name: /interactive/i });

    fireEvent.pointerDown(button, { clientX: 30, clientY: 15 });
    fireEvent.pointerMove(button, { clientX: 35, clientY: 18 });
    fireEvent.pointerLeave(button);

    expect(button).toBeInTheDocument();
  });
});
