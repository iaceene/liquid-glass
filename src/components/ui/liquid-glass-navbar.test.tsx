import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiquidNavbar } from './liquid-glass-navbar';

describe('LiquidNavbar component', () => {
  it('renders navigation element with default items', () => {
    render(<LiquidNavbar />);
    const nav = screen.getByRole('navigation', { name: /main/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
  });

  it('changes active item when clicked', () => {
    render(<LiquidNavbar defaultActive={0} />);
    const exploreBtn = screen.getByRole('button', { name: /explore/i });
    fireEvent.click(exploreBtn);
    expect(exploreBtn).toHaveAttribute('aria-current', 'page');
  });

  it('renders custom link items when href is provided', () => {
    const customItems = [
      { label: 'Home Link', href: '/home' },
      { label: 'About Link', href: '/about' },
    ];
    render(<LiquidNavbar items={customItems} />);
    const homeLink = screen.getByRole('link', { name: /home link/i });
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('applies dark tone attribute', () => {
    const { container } = render(<LiquidNavbar tone="dark" />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('data-tone', 'dark');
  });
});
