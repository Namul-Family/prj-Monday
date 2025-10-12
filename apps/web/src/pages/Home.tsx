import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TagSelector } from '../components/TagSelector';
import { BookmarkCard } from '../components/BookmarkCard';
import { BottomNav } from '../components/BottomNav';
import { AddSheet } from '../components/sheets/AddSheet';
import { TagManagerSheet } from '../components/sheets/TagManagerSheet';
import { useMobileBookmarks, useMobileTags, useInboxCount } from '../hooks/useMobileBookmarks';
import { BookmarkType } from '@monday-bookmark/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  const { bookmarks, updateBookmark, createBookmark } = useMobileBookmarks({
    tagIds: selectedTagIds.includes('all') ? [] : selectedTagIds,
  });
  const { tags, createTag, deleteTag } = useMobileTags();
  const inboxCount = useInboxCount();

  const handleTagSelect = (tagId: string, meta?: { isAllOnlySelected?: boolean }) => {
    // All 단일 선택 상태에서 다시 탭하면 태그관리 바텀시트 오픈
    if (tagId === 'all') {
      if (meta?.isAllOnlySelected) {
        setIsTagManagerOpen(true);
        return;
      }
      setSelectedTagIds([]); // All 선택 = 나머지 선택 해제
      return;
    }

    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId],
    );
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    updateBookmark(id, { isFavorite });
  };

  const handleTrashClick = () => navigate('/sort');
  const handleAddClick = () => setIsAddSheetOpen(true);
  const handleProfileClick = () => console.log('프로필 페이지로 이동');
  const handleTagManagerOpen = () => setIsTagManagerOpen(true);

  const handleAddBookmark = (data: {
    type: BookmarkType;
    title: string;
    content?: string;
    url?: string;
  }) => {
    createBookmark({
      ...data,
      userId: 'demo-user',
      status: 'inbox',
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleCreateTag = (name: string) => {
    createTag({
      name,
      userId: 'demo-user',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      {/* Safe Area Top */}
      <div className="h-[env(safe-area-inset-top)]" />

      {/* 태그 스트립: 좌우 여백 축소, 수평 스크롤 */}
      <div className="px-3 pt-2">
        <TagSelector
          tags={tags}
          selectedTagIds={selectedTagIds}
          onTagSelect={handleTagSelect}
          onTagManagerOpen={handleTagManagerOpen}
          // TagSelector에서 chip 스타일은: 선택 bg-gray-800 text-white / 비선택 bg-gray-100 text-gray-700
          // 첫번째는 항상 "All"
        />
      </div>

      {/* 북마크 그리드: 모바일 2열(375px 이상), 360px 이하 1열 */}
      <div
        className="
          flex-1 overflow-y-auto px-3 pt-2
          pb-[calc(env(safe-area-inset-bottom)+88px)]  /* 하단 네비게이션 높이만큼 여유 */
        "
      >
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 text-sm text-gray-500">
            북마크가 없습니다. 하단 + 버튼으로 추가해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-[360px]:grid-cols-1">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                // 카드 내부 스타일 가이드:
                // - 썸네일: aspect-[4/3] object-cover rounded-lg
                // - 제목: font-semibold text-sm line-clamp-2
                // - 설명: text-gray-500 text-xs line-clamp-2
                // - 태그배지: rounded-full px-2 py-0.5 text-[11px]
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 네비게이션: iOS 스타일 플로팅 바 */}
      <BottomNav
        inboxCount={inboxCount}
        onTrashClick={handleTrashClick}
        onAddClick={handleAddClick}
        onProfileClick={handleProfileClick}
      />

      {/* 바텀시트들 */}
      <AddSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onSubmit={handleAddBookmark}
      />
      <TagManagerSheet
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={tags}
        onCreateTag={handleCreateTag}
        onDeleteTag={deleteTag}
      />
    </div>
  );
};
