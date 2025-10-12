import { useState, useMemo } from 'react';
import { Bookmark, Tag, BookmarkType, BookmarkStatus } from '@monday-bookmark/types';

// Mock 데이터 생성 함수
const generateMockBookmarks = (): Bookmark[] => {
  return [
    {
      id: '1',
      userId: 'demo-user',
      type: 'link',
      status: 'inbox',
      title: 'React 18의 새로운 기능들',
      content: 'React 18에서 추가된 Concurrent Features와 Suspense에 대한 자세한 설명',
      url: 'https://react.dev/blog/2022/03/29/react-v18',
      memo: null,
      metaTitle: 'React 18: What\'s New',
      metaDescription: 'Learn about the new features in React 18',
      metaImageUrl: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=React+18',
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
      title: '프로젝트 아이디어 모음',
      content: '새로운 사이드 프로젝트를 위한 아이디어들을 정리한 노트',
      url: null,
      memo: '1. 북마크 관리 앱\n2. 할 일 관리 앱\n3. 메모 앱\n4. 날씨 앱',
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
      content: '모바일 앱 UI 디자인을 위한 참고 이미지',
      url: null,
      memo: '클린하고 미니멀한 디자인 스타일 참고용',
      metaTitle: null,
      metaDescription: null,
      metaImageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=UI+Design',
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
      content: 'TypeScript의 고급 타입 기능들을 배우는 완벽한 가이드',
      url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
      memo: '유틸리티 타입과 조건부 타입에 대한 내용이 특히 유용함',
      metaTitle: 'TypeScript: Creating Types from Types',
      metaDescription: 'Learn how to create types from existing types',
      metaImageUrl: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=TypeScript',
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
      content: '오늘 해야 할 일들의 체크리스트',
      url: null,
      memo: '- [ ] 프로젝트 문서 작성\n- [ ] 코드 리뷰\n- [ ] 팀 미팅 참석\n- [ ] 디자인 시스템 업데이트',
      metaTitle: null,
      metaDescription: null,
      metaImageUrl: null,
      isFavorite: false,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      deletedAt: null,
    },
  ];
};

const generateMockTags = (): Tag[] => {
  return [
    { id: '1', userId: 'demo-user', name: '개발', color: '#3b82f6', description: '개발 관련 북마크', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: '2', userId: 'demo-user', name: '디자인', color: '#10b981', description: '디자인 관련 북마크', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: '3', userId: 'demo-user', name: '프로젝트', color: '#f59e0b', description: '프로젝트 관련 북마크', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: '4', userId: 'demo-user', name: '학습', color: '#8b5cf6', description: '학습 관련 북마크', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: '5', userId: 'demo-user', name: '인사이어', color: '#ef4444', description: '인사이어 관련 북마크', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  ];
};

// Mock 데이터
const mockBookmarks = generateMockBookmarks();
const mockTags = generateMockTags();

export const useMobileBookmarks = (filters?: { tagIds?: string[]; status?: BookmarkStatus }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter(bookmark => !bookmark.deletedAt);

    // 태그 필터 적용
    if (filters?.tagIds && filters.tagIds.length > 0) {
      filtered = filtered.filter(bookmark => {
        // Mock 데이터에서는 태그 연결을 시뮬레이션
        const bookmarkTags = getBookmarkTags(bookmark.id);
        return filters.tagIds!.some(tagId => 
          bookmarkTags.some(bt => bt.tagId === tagId)
        );
      });
    }

    // 상태 필터 적용
    if (filters?.status) {
      filtered = filtered.filter(bookmark => bookmark.status === filters.status);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookmarks, filters]);

  const inboxCount = useMemo(() => {
    return bookmarks.filter(bookmark => 
      bookmark.status === 'inbox' && !bookmark.deletedAt
    ).length;
  }, [bookmarks]);

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
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id 
        ? { ...bookmark, ...updates, updatedAt: new Date() }
        : bookmark
    ));
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id 
        ? { ...bookmark, deletedAt: new Date() }
        : bookmark
    ));
  };

  return {
    bookmarks: filteredBookmarks,
    allBookmarks: bookmarks,
    inboxCount,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    selectedTagIds,
    setSelectedTagIds,
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

  return {
    tags,
    createTag,
    deleteTag,
  };
};

// Mock 북마크-태그 연결 데이터
const mockBookmarkTags = [
  { bookmarkId: '1', tagId: '1' },
  { bookmarkId: '1', tagId: '4' },
  { bookmarkId: '2', tagId: '3' },
  { bookmarkId: '3', tagId: '2' },
  { bookmarkId: '4', tagId: '1' },
  { bookmarkId: '4', tagId: '4' },
  { bookmarkId: '5', tagId: '3' },
];

const getBookmarkTags = (bookmarkId: string) => {
  return mockBookmarkTags.filter(bt => bt.bookmarkId === bookmarkId);
};

export const useInboxCount = () => {
  const { inboxCount } = useMobileBookmarks();
  return inboxCount;
};
