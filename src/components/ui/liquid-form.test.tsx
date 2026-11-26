import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LiquidForm } from './liquid-form';

describe('LiquidForm component', () => {
  it('renders default fields, title, description, and submit button', () => {
    render(<LiquidForm title="Contact Us" description="We are here to help." />);

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('We are here to help.')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inquiry type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('supports dark tone', () => {
    const { container } = render(<LiquidForm tone="dark" />);
    expect(container.querySelector('.nimbus-form')).toHaveAttribute('data-tone', 'dark');
  });

  it('validates required fields on empty submit', async () => {
    render(<LiquidForm />);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<LiquidForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const msgInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(msgInput, { target: { value: 'Hello' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form values and transitions through processing and success phases', async () => {
    const onSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
    render(
      <LiquidForm
        onSubmit={onSubmit}
        submitLabel="Send"
        processingLabel="Sending..."
        successLabel="Sent!"
        resetAfter={0}
      />
    );

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Rivera' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Interested in Nimbus UI.' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getAllByText(/sending/i).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alex Rivera',
          email: 'alex@example.com',
          message: 'Interested in Nimbus UI.',
        })
      );
    });

    await waitFor(
      () => {
        expect(screen.getAllByText(/sent!/i).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it('handles server rejection with error message', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Server unavailable'));
    render(<LiquidForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@test.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toHaveTextContent('Server unavailable');
      },
      { timeout: 3000 }
    );
  });
});
