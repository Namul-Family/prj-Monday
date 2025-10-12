import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { BookmarkCard } from '../components/BookmarkCard';
import { useUpdateBookmark, useDeleteBookmark } from '../hooks/useBookmarks';

export const Inbox: React.FC = () => {
  const { data: bookmarksData, isLoading, error } = useBookmarks({ 
    status: 'inbox',
    limit: 20,
    offset: 0
  });
  const updateBookmark = useUpdateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    updateBookmark.mutate({ id, data: { isFavorite } });
  };

  const handleStatusChange = (id: string, status: 'inbox' | 'active' | 'archived') => {
    updateBookmark.mutate({ id, data: { status } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('북마크를 삭제하시겠습니까?')) {
      deleteBookmark.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">북마크를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const bookmarks = bookmarksData?.bookmarks || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">인박스</h1>
        <p className="text-gray-600">새로 추가된 북마크들을 정리해보세요.</p>
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {bookmarksData?.total || 0}개 항목
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">인박스가 비어있습니다.</p>
          <p className="text-sm text-gray-400">새로운 북마크를 추가해보세요!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onToggleFavorite={handleToggleFavorite}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
