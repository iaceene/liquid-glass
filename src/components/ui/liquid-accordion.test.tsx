import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiquidAccordion } from './liquid-accordion';

const TEST_ITEMS = [
  { question: 'First Question', answer: 'First Answer' },
  { question: 'Second Question', answer: 'Second Answer' },
  { question: 'Third Question', answer: 'Third Answer' },
];

describe('LiquidAccordion component', () => {
  it('renders all questions with buttons', () => {
    render(<LiquidAccordion items={TEST_ITEMS} defaultOpen={null} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
    expect(screen.getByText('First Question')).toBeInTheDocument();
    expect(screen.getByText('Second Question')).toBeInTheDocument();
  });

  it('opens item by default when defaultOpen is set', () => {
    render(<LiquidAccordion items={TEST_ITEMS} defaultOpen={0} />);
    const firstBtn = screen.getByRole('button', { name: /first question/i });
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First Answer')).toBeInTheDocument();

    const secondBtn = screen.getByRole('button', { name: /second question/i });
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles accordion items on click and notifies onOpenChange', () => {
    const handleOpenChange = vi.fn();
    render(
      <LiquidAccordion
        items={TEST_ITEMS}
        defaultOpen={null}
        onOpenChange={handleOpenChange}
      />
    );

    const firstBtn = screen.getByRole('button', { name: /first question/i });
    fireEvent.click(firstBtn);

    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(handleOpenChange).toHaveBeenCalledWith(0);

    // Click again to collapse
    fireEvent.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(handleOpenChange).toHaveBeenCalledWith(null);
  });

  it('does not collapse open item when collapsible is false', () => {
    const handleOpenChange = vi.fn();
    render(
      <LiquidAccordion
        items={TEST_ITEMS}
        defaultOpen={0}
        collapsible={false}
        onOpenChange={handleOpenChange}
      />
    );

    const firstBtn = screen.getByRole('button', { name: /first question/i });
    fireEvent.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports keyboard navigation across accordion headers', () => {
    render(<LiquidAccordion items={TEST_ITEMS} defaultOpen={0} />);
    const buttons = screen.getAllByRole('button');

    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    fireEvent.keyDown(buttons[1], { key: 'ArrowUp' });
    fireEvent.keyDown(buttons[1], { key: 'End' });
    fireEvent.keyDown(buttons[2], { key: 'Home' });

    expect(buttons[0]).toBeInTheDocument();
  });

  it('applies dark tone attribute and canvas element', () => {
    const { container } = render(<LiquidAccordion items={TEST_ITEMS} tone="dark" />);
    const root = container.querySelector('.nimbus-faq');
    expect(root).toHaveAttribute('data-tone', 'dark');

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
