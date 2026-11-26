import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LiquidCheckout } from './liquid-checkout';

const DEMO_CARDS = [
  {
    id: 'c1',
    label: 'Primary Card',
    theme: 'sky' as const,
    brand: 'visa',
    last4: '4242',
    holder: 'ALEX RIVERA',
    expiry: '12/28',
  },
  {
    id: 'c2',
    label: 'Secondary Card',
    theme: 'glass' as const,
    brand: 'mastercard',
    last4: '8812',
    holder: 'ALEX RIVERA',
    expiry: '09/27',
  },
];

describe('LiquidCheckout component', () => {
  it('renders checkout with merchant and formatted amount', () => {
    render(<LiquidCheckout amount={84} currency="USD" merchant="Nimbus Studio" layout="form" />);
    
    expect(screen.getByText('Nimbus Studio')).toBeInTheDocument();
    expect(screen.getByText('$84.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay \$84\.00/i })).toBeInTheDocument();
  });

  it('renders credit card input fields in form mode', () => {
    render(<LiquidCheckout amount={50} layout="form" />);
    
    expect(screen.getByLabelText(/Card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name on card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument();
  });

  it('formats card number with spaces on typing', () => {
    render(<LiquidCheckout amount={50} layout="form" />);
    
    const cardInput = screen.getByLabelText(/Card number/i) as HTMLInputElement;
    fireEvent.change(cardInput, { target: { value: '4242424242424242' } });
    
    expect(cardInput.value).toBe('4242 4242 4242 4242');
  });

  it('validates fields and prevents payment when inputs are empty or invalid', async () => {
    const handlePay = vi.fn();
    render(<LiquidCheckout amount={50} onPay={handlePay} layout="form" />);
    
    const payBtn = screen.getByRole('button', { name: /Pay/i });
    fireEvent.click(payBtn);
    
    expect(handlePay).not.toHaveBeenCalled();
    // Error message should appear
    expect(screen.getByText(/check the card number/i)).toBeInTheDocument();
  });

  it('renders wallet layout when cards are provided and layout is wallet', () => {
    render(<LiquidCheckout amount={100} currency="USD" cards={DEMO_CARDS} layout="wallet" />);
    
    expect(screen.getByText(/Primary Card ·· 4242/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay \$100\.00/i })).toBeInTheDocument();
  });

  it('submits payment in wallet mode when clicking pay button', async () => {
    const handlePay = vi.fn().mockResolvedValue({ ok: true });
    render(<LiquidCheckout amount={100} currency="USD" cards={DEMO_CARDS} layout="wallet" onPay={handlePay} />);
    
    const payBtn = screen.getByRole('button', { name: /Pay \$100\.00/i });
    fireEvent.click(payBtn);
    
    await waitFor(() => {
      expect(handlePay).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'wallet',
          card: expect.objectContaining({ id: 'c1' }),
        })
      );
    });
  });
});
