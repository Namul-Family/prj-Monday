export function truncateText(input: string, max = 100, suffix = '…') {
    if (typeof input !== 'string') return '';
    if (input.length <= max) return input;
    return input.slice(0, Math.max(0, max)).trimEnd() + suffix;
  }