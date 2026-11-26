import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Form, LiquidForm } from './form';

describe('Form barrel export', () => {
  it('renders Form alias correctly', () => {
    render(<Form title="Barrel Form" />);
    expect(screen.getByText('Barrel Form')).toBeInTheDocument();
  });

  it('renders LiquidForm correctly', () => {
    render(<LiquidForm title="Original Form" />);
    expect(screen.getByText('Original Form')).toBeInTheDocument();
  });
});
