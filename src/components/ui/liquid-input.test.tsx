import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidInput, NimbusInputIcons, type LiquidInputHandle } from './liquid-input';

describe('LiquidInput component', () => {
  it('renders input with placeholder', () => {
    render(<LiquidInput placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
  });

  it('renders label linked to input via id', () => {
    render(<LiquidInput id="test-user" label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-user');
  });

  it('handles value changes and triggers onChange callback', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<LiquidInput placeholder="Type here" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'fluid');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('fluid');
  });

  it('updates data-focus attribute on focus and blur', () => {
    const { container } = render(<LiquidInput placeholder="Focus me" />);
    const input = screen.getByPlaceholderText('Focus me');
    const root = container.querySelector('.nimbus-field');

    expect(root).toHaveAttribute('data-focus', 'false');

    fireEvent.focus(input);
    expect(root).toHaveAttribute('data-focus', 'true');

    fireEvent.blur(input);
    expect(root).toHaveAttribute('data-focus', 'false');
  });

  it('renders helper text when provided without error', () => {
    render(<LiquidInput placeholder="Email" helperText="We will never share your email." />);
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('renders error message, sets aria-invalid, and replaces helper text', () => {
    render(
      <LiquidInput
        placeholder="Email"
        helperText="Should not be visible"
        error="Invalid email format"
      />
    );

    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const err = screen.getByRole('alert');
    expect(err).toBeInTheDocument();
    expect(err).toHaveTextContent('Invalid email format');

    expect(screen.queryByText('Should not be visible')).not.toBeInTheDocument();
  });

  it('renders leading and trailing icons', () => {
    render(
      <LiquidInput
        placeholder="Search"
        icon={NimbusInputIcons.search}
        rightIcon={NimbusInputIcons.mail}
      />
    );

    const input = screen.getByPlaceholderText('Search');
    const basin = input.closest('.ni-basin');
    const icons = basin?.querySelectorAll('svg');
    expect(icons?.length).toBe(2);
  });

  it('shows clear button when clearable has value, and clicking clears input', async () => {
    const user = userEvent.setup();
    render(<LiquidInput defaultValue="Clear me" clearable placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    expect(input).toHaveValue('Clear me');

    const clearBtn = screen.getByRole('button', { name: /clear input/i });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(input).toHaveValue('');
  });

  it('toggles password visibility when clicking eye button', async () => {
    const user = userEvent.setup();
    render(<LiquidInput type="password" placeholder="Password" defaultValue="secret123" />);

    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleBtn);

    expect(input).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: /hide password/i });
    await user.click(hideBtn);

    expect(input).toHaveAttribute('type', 'password');
  });

  it('disables input when disabled prop is true', () => {
    render(<LiquidInput disabled placeholder="Disabled input" clearable defaultValue="text" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();

    // Clear button should not be rendered when disabled
    expect(screen.queryByRole('button', { name: /clear input/i })).not.toBeInTheDocument();
  });

  it('exposes imperative handle via ref', () => {
    const handleRef = React.createRef<LiquidInputHandle>();
    render(<LiquidInput ref={handleRef} placeholder="Handle test" />);

    expect(handleRef.current).not.toBeNull();
    expect(handleRef.current?.input).toBeInstanceOf(HTMLInputElement);
    expect(typeof handleRef.current?.focus).toBe('function');
    expect(typeof handleRef.current?.blur).toBe('function');
    expect(typeof handleRef.current?.shake).toBe('function');

    // Trigger shake without error
    handleRef.current?.shake();
  });

  it('applies tone and size attributes to root container', () => {
    const { container, rerender } = render(<LiquidInput tone="dark" size="lg" placeholder="Large" />);
    let root = container.querySelector('.nimbus-field');
    expect(root).toHaveAttribute('data-tone', 'dark');
    expect(root).toHaveAttribute('data-size', 'lg');

    rerender(<LiquidInput tone="light" size="sm" placeholder="Small" />);
    root = container.querySelector('.nimbus-field');
    expect(root).toHaveAttribute('data-tone', 'light');
    expect(root).toHaveAttribute('data-size', 'sm');
  });

  it('renders canvas element and fallback layers', () => {
    const { container } = render(<LiquidInput placeholder="Canvas test" />);
    const canvas = container.querySelector('canvas.ni-water');
    expect(canvas).toBeInTheDocument();

    const glass = container.querySelector('.ni-glass');
    expect(glass).toBeInTheDocument();

    const pool = container.querySelector('.ni-pool');
    expect(pool).toBeInTheDocument();
  });
});
