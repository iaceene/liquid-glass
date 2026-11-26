import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiquidToggle, NimbusToggleIcons } from './liquid-toggle';

describe('LiquidToggle component', () => {
  it('renders switch button with correct ARIA attributes', () => {
    render(<LiquidToggle label="Power toggle" />);
    const toggle = screen.getByRole('switch', { name: /power toggle/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');
  });

  it('renders checked state initially when defaultChecked is true', () => {
    render(<LiquidToggle defaultChecked label="Active toggle" />);
    const toggle = screen.getByRole('switch', { name: /active toggle/i });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('toggles state on click and fires onCheckedChange', () => {
    const handleCheckedChange = vi.fn();
    render(<LiquidToggle onCheckedChange={handleCheckedChange} label="Click toggle" />);

    const toggle = screen.getByRole('switch', { name: /click toggle/i });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('handles keyboard navigation (ArrowRight / ArrowLeft)', () => {
    const handleCheckedChange = vi.fn();
    render(<LiquidToggle onCheckedChange={handleCheckedChange} label="Key toggle" />);

    const toggle = screen.getByRole('switch', { name: /key toggle/i });

    fireEvent.keyDown(toggle, { key: 'ArrowRight' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(toggle, { key: 'ArrowLeft' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('renders hidden input when name is provided for form compatibility', () => {
    const { container } = render(<LiquidToggle name="newsletter" value="yes" defaultChecked />);
    const input = container.querySelector('input[name="newsletter"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', 'yes');
    expect(input).toBeChecked();
  });

  it('renders optional icons inside the toggle knob', () => {
    const { container } = render(
      <LiquidToggle
        icons={{ off: NimbusToggleIcons.sun, on: NimbusToggleIcons.moon }}
        label="Icon toggle"
      />
    );
    const iconContainer = container.querySelector('.nt-icon');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer?.querySelectorAll('svg').length).toBe(2);
  });

  it('does not toggle when disabled', () => {
    const handleCheckedChange = vi.fn();
    render(<LiquidToggle disabled onCheckedChange={handleCheckedChange} label="Disabled toggle" />);

    const toggle = screen.getByRole('switch', { name: /disabled toggle/i });
    expect(toggle).toBeDisabled();

    fireEvent.click(toggle);
    expect(handleCheckedChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('applies dark tone attribute', () => {
    render(<LiquidToggle tone="dark" label="Dark tone toggle" />);
    const toggle = screen.getByRole('switch', { name: /dark tone toggle/i });
    expect(toggle).toHaveAttribute('data-tone', 'dark');
  });
});
