import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidTextarea, type LiquidTextareaHandle } from './liquid-textarea';

describe('LiquidTextarea component', () => {
  it('renders textarea with placeholder', () => {
    render(<LiquidTextarea placeholder="Type feedback..." />);
    const textarea = screen.getByPlaceholderText('Type feedback...');
    expect(textarea).toBeInTheDocument();
  });

  it('renders label connected to textarea', () => {
    render(<LiquidTextarea id="comments" label="Comments" />);
    const textarea = screen.getByLabelText('Comments');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'comments');
  });

  it('handles typing and triggers onChange callback', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<LiquidTextarea placeholder="Review" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('Review');
    await user.type(textarea, 'Great fluid design');

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Great fluid design');
  });

  it('tracks character count when showCount is true', async () => {
    const user = userEvent.setup();
    render(<LiquidTextarea placeholder="Count me" showCount maxLength={100} />);

    const textarea = screen.getByPlaceholderText('Count me');
    expect(screen.getByText('0 / 100')).toBeInTheDocument();

    await user.type(textarea, 'Hello');
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('updates focus attribute and renders helper text / error', () => {
    const { container, rerender } = render(
      <LiquidTextarea placeholder="Basin" helperText="Helpful instructions" />
    );
    const textarea = screen.getByPlaceholderText('Basin');
    const root = container.querySelector('.nimbus-textarea-field');

    expect(root).toHaveAttribute('data-focus', 'false');
    expect(screen.getByText('Helpful instructions')).toBeInTheDocument();

    fireEvent.focus(textarea);
    expect(root).toHaveAttribute('data-focus', 'true');

    fireEvent.blur(textarea);
    expect(root).toHaveAttribute('data-focus', 'false');

    rerender(<LiquidTextarea placeholder="Basin" error="This field cannot be empty" />);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('This field cannot be empty');
  });

  it('exposes imperative handle via ref', () => {
    const handleRef = React.createRef<LiquidTextareaHandle>();
    render(<LiquidTextarea ref={handleRef} placeholder="Handle ref" />);

    expect(handleRef.current).not.toBeNull();
    expect(handleRef.current?.textarea).toBeInstanceOf(HTMLTextAreaElement);
    expect(typeof handleRef.current?.focus).toBe('function');
    expect(typeof handleRef.current?.blur).toBe('function');
    expect(typeof handleRef.current?.shake).toBe('function');

    handleRef.current?.shake();
  });

  it('renders canvas element and fallback layers', () => {
    const { container } = render(<LiquidTextarea placeholder="Canvas" />);
    expect(container.querySelector('canvas.na-water')).toBeInTheDocument();
    expect(container.querySelector('.na-glass')).toBeInTheDocument();
    expect(container.querySelector('.na-pool')).toBeInTheDocument();
  });
});
