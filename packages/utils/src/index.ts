import { z } from 'zod';

/** Date formatting utilities */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
};

/** String utilities */
export const truncateText = (text: string, maxLength: number, suffix = '…'): string => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength)).trimEnd() + suffix;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/** URL utilities */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getDomainFromUrl = (url: string): string | null => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/** OG (Open Graph) metadata fetcher */
export interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// NOTE: Node 18+ 환경이면 글로벌 fetch 사용 가능.
// 그 이하 버전이면 cross-fetch/undici 등을 의존성에 추가해 주세요.
export const fetchOGMetadata = async (url: string): Promise<OGMetadata> => {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const titleMatch =
      html.match(/<meta property="og:title" content="([^"]*)"[^>]*>/i) ||
      html.match(/<title>([^<]*)<\/title>/i);

    const descriptionMatch =
      html.match(/<meta property="og:description" content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta name="description" content="([^"]*)"[^>]*>/i);

    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"[^>]*>/i);
    const urlMatch = html.match(/<meta property="og:url" content="([^"]*)"[^>]*>/i);

    return {
      title: titleMatch?.[1]?.trim(),
      description: descriptionMatch?.[1]?.trim(),
      image: imageMatch?.[1]?.trim(),
      url: urlMatch?.[1]?.trim() || url,
    };
  } catch (error) {
    console.error('Failed to fetch OG metadata:', error);
    return {};
  }
};

/** Validation utilities */
export const validateBookmarkData = (data: unknown) => {
  const schema = z.object({
    title: z.string().min(1).max(200),
    type: z.enum(['text', 'link', 'image']),
    url: z.string().url().optional(),
    content: z.string().optional(),
    memo: z.string().max(5000).optional(),
  });

  return schema.safeParse(data);
};

export const validateTagData = (data: unknown) => {
  const schema = z.object({
    name: z.string().min(1).max(50),
    color: z.string().optional(),
    description: z.string().optional(),
  });

  return schema.safeParse(data);
};

/** Color utilities */
export const generateRandomColor = (): string => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#6b7280'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/** Array utilities */
export const groupBy = <T, K extends string | number>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = key(item);
    (groups[groupKey] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: (item: T) => string | number,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = key(a);
    const bVal = key(b);
    if (order === 'desc') return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  });
