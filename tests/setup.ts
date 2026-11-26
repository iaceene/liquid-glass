import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Polyfill browser globals for jsdom environment
if (typeof window !== 'undefined') {
  window.IntersectionObserver = MockIntersectionObserver as any;
  window.ResizeObserver = MockResizeObserver as any;
  window.matchMedia =
    window.matchMedia ||
    vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
}

globalThis.IntersectionObserver = MockIntersectionObserver as any;
globalThis.ResizeObserver = MockResizeObserver as any;

afterEach(() => {
  cleanup();
});

