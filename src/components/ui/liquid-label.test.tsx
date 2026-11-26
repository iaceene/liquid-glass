import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiquidLabel } from './liquid-label';

describe('LiquidLabel component', () => {
  it('renders label text', () => {
    render(<LiquidLabel>Username</LiquidLabel>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders required indicator bead when required is true', () => {
    const { container } = render(<LiquidLabel required>Password</LiquidLabel>);
    const bead = container.querySelector('.nl-bead');
    expect(bead).toBeInTheDocument();
    expect(bead).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders optional text when optional is true and required is false', () => {
    render(<LiquidLabel optional>Bio</LiquidLabel>);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('renders description and badge', () => {
    render(
      <LiquidLabel description="Enter your company email" badge="Work">
        Email
      </LiquidLabel>
    );

    expect(screen.getByText('Enter your company email')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('applies tone and size attributes', () => {
    const { container, rerender } = render(<LiquidLabel tone="dark" size="lg">Theme Test</LiquidLabel>);
    let label = container.querySelector('.nimbus-label');
    expect(label).toHaveAttribute('data-tone', 'dark');
    expect(label).toHaveAttribute('data-size', 'lg');

    rerender(<LiquidLabel tone="light" size="sm">Theme Test</LiquidLabel>);
    label = container.querySelector('.nimbus-label');
    expect(label).toHaveAttribute('data-tone', 'light');
    expect(label).toHaveAttribute('data-size', 'sm');
  });

  it('links to input via htmlFor', () => {
    render(
      <div>
        <LiquidLabel htmlFor="custom-id">Linked Field</LiquidLabel>
        <input id="custom-id" />
      </div>
    );

    const input = screen.getByLabelText('Linked Field');
    expect(input).toBeInTheDocument();
  });
});
