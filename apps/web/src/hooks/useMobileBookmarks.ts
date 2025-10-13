import { useState, useMemo } from 'react';
import { Bookmark, Tag, BookmarkType, BookmarkStatus } from '@monday-bookmark/types';

// ---------- 목업 이미지 3종 ----------
const MOCK_IMAGES = [
  'https://d11d1um5160yk5.cloudfront.net/2024/12/Boston-Terrier-scaled.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cGAVjRcpmAa91Kr6U9AIqfZ3TYA1VTTrfw&s',
  'https://i.pinimg.com/474x/07/80/d8/0780d8aff099a0531d2d312ce40cdb39.jpg',
];

// ---------- 목업 북마크 생성 ----------
const generateMockBookmarks = (): Bookmark[] => {
  const base = [
    {
      id: '1',
      userId: 'demo-user',
      type: 'link',
      status: 'inbox',
      title: 'React 18의 새로운 기능들',
      content: 'Concurrent Features와 Suspense에 대한 설명',
      url: 'https://react.dev/blog/2022/03/29/react-v18',
      memo: null,
      metaTitle: "React 18 What's New",
      metaDescription: 'Learn about the new features in React 18',
      metaImageUrl: MOCK_IMAGES[0],
      isFavorite: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      deletedAt: null,
    },
    {
      id: '2',
      userId: 'demo-user',
      type: 'text',
      status: 'inbox',
      title: '사이드 프로젝트 아이디어 모음',
      content: '북마크 관리, 할 일 관리, 메모 앱 등 아이디어 정리',
      url: null,
      memo: '1. 북마크 앱\n2. 메모 앱\n3. 날씨 앱',
      metaTitle: null,
      metaDescription: null,
      metaImageUrl: null,
      isFavorite: true,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      deletedAt: null,
    },
    {
      id: '3',
      userId: 'demo-user',
      type: 'image',
      status: 'active',
      title: 'UI 디자인 인스피레이션',
      content: '모바일 UI 디자인 참고 이미지',
      url: null,
      memo: '깔끔하고 미니멀한 스타일 참고용',
      metaTitle: null,
      metaDescription: null,
      metaImageUrl: MOCK_IMAGES[1],
      isFavorite: false,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      deletedAt: null,
    },
    {
      id: '4',
      userId: 'demo-user',
      type: 'link',
      status: 'archived',
      title: 'TypeScript 고급 타입 가이드',
      content: '조건부 타입, 유틸리티 타입 정리',
      url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
      memo: 'Advanced Utility Types에 대한 좋은 정리',
      metaTitle: 'TypeScript Types',
      metaDescription: 'Learn how to create types from types',
      metaImageUrl: MOCK_IMAGES[2],
      isFavorite: true,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      deletedAt: null,
    },
    {
      id: '5',
      userId: 'demo-user',
      type: 'text',
      status: 'inbox',
      title: '오늘의 할 일',
      content: '프로젝트 문서 작성, 코드 리뷰, 디자인 시스템 업데이트',
      url: null,
      memo: '- [ ] 문서 작성\n- [ ] 코드 리뷰\n- [ ] 회의 참석',
      metaTitle: null,
      metaDescription: null,
      metaImageUrl: null,
      isFavorite: false,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      deletedAt: null,
    },
  ];

  // --- 복제 및 변형으로 24개 데이터 생성 ---
  const extended: Bookmark[] = [];
  for (let i = 0; i < 24; i++) {
    const baseItem = base[i % base.length];
    extended.push({
      ...baseItem,
      id: (i + 1).toString(),
      title: `${baseItem.title} (${i + 1})`,
      status: i % 7 === 0 ? 'inbox' : i % 3 === 0 ? 'active' : 'archived',
      isFavorite: i % 5 === 0,
      metaImageUrl: MOCK_IMAGES[i % MOCK_IMAGES.length],
      createdAt: new Date(2024, 0, 1 + i),
      updatedAt: new Date(2024, 0, 1 + i),
    });
  }
  return extended;
};

// ---------- 목업 태그 ----------
const generateMockTags = (): Tag[] => {
  return [
    { id: '1', userId: 'demo-user', name: '개발', color: '#3b82f6', description: '개발 관련 북마크', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', userId: 'demo-user', name: '디자인', color: '#10b981', description: '디자인 관련 북마크', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', userId: 'demo-user', name: '프로젝트', color: '#f59e0b', description: '프로젝트 관련 북마크', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', userId: 'demo-user', name: '학습', color: '#8b5cf6', description: '학습 관련 북마크', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', userId: 'demo-user', name: '인사이트', color: '#ef4444', description: '인사이트 관련 북마크', createdAt: new Date(), updatedAt: new Date() },
  ];
};

// ---------- 북마크-태그 연결 ----------
const mockBookmarkTags = Array.from({ length: 24 }).flatMap((_, i) => {
  const tagId = ((i % 5) + 1).toString();
  return [{ bookmarkId: (i + 1).toString(), tagId }];
});

const getBookmarkTags = (bookmarkId: string) => {
  return mockBookmarkTags.filter(bt => bt.bookmarkId === bookmarkId);
};

// ---------- 훅 구현 ----------
const mockBookmarks = generateMockBookmarks();
const mockTags = generateMockTags();

export const useMobileBookmarks = (filters?: { tagIds?: string[]; status?: BookmarkStatus }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter(b => !b.deletedAt);

    // 태그 필터 적용
    if (filters?.tagIds && filters.tagIds.length > 0) {
      filtered = filtered.filter(b => {
        const bookmarkTags = getBookmarkTags(b.id);
        return filters.tagIds!.some(tagId => bookmarkTags.some(bt => bt.tagId === tagId));
      });
    }

    // 상태 필터 적용
    if (filters?.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [bookmarks, filters]);

  const inboxCount = useMemo(
    () => bookmarks.filter(b => b.status === 'inbox' && !b.deletedAt).length,
    [bookmarks]
  );

  const createBookmark = (data: Omit<Bookmark, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newBookmark: Bookmark = {
      ...data,
      id: Date.now().toString(),
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
    return newBookmark;
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev => prev.map(b => (b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b)));
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.map(b => (b.id === id ? { ...b, deletedAt: new Date() } : b)));
  };

  return {
    bookmarks: filteredBookmarks,
    allBookmarks: bookmarks,
    inboxCount,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
};

export const useMobileTags = () => {
  const [tags, setTags] = useState<Tag[]>(mockTags);

  const createTag = (data: Omit<Tag, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTag: Tag = {
      ...data,
      id: Date.now().toString(),
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  return { tags, createTag, deleteTag };
};

export const useInboxCount = () => {
  const { inboxCount } = useMobileBookmarks();
  return inboxCount;
};