import { describe, it, expect } from 'vitest';
import { formatGreeting } from '@prj/utils';

describe('App basics', () => {
  it('formats greeting', () => {
    expect(formatGreeting('Test')).toBe('Hello, Test!');
  });
});

