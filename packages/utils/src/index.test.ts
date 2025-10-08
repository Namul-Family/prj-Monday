import { describe, it, expect } from 'vitest';
import { formatGreeting } from './index';

describe('formatGreeting', () => {
  it('greets with name', () => {
    expect(formatGreeting('World')).toBe('Hello, World!');
  });
  it('handles empty/whitespace', () => {
    expect(formatGreeting('   ')).toBe('Hello!');
  });
});

