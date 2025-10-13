import React, { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { BookmarkCard } from '../components/bookmarks/BookmarkCard';
import { useUpdateBookmark, useDeleteBookmark } from '../hooks/useBookmarks';
import { Filter, Star, Archive } from 'lucide-react';

export const Library: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [favoriteFilter, setFavoriteFilter] = useState<boolean | undefined>(undefined);

  const queryParams: any = { limit: 20 };
  if (statusFilter !== 'all') {
    queryParams.status = statusFilter;
  }
  if (favoriteFilter !== undefined) {
    queryParams.isFavorite = favoriteFilter;
  }

  const { data: bookmarksData, isLoading, error } = useBookmarks(queryParams);
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

  const clearFilters = () => {
    setStatusFilter('all');
    setFavoriteFilter(undefined);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">라이브러리</h1>
        <p className="text-gray-600">정리된 북마크들을 관리하세요.</p>
        
        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">필터:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="archived">보관됨</option>
          </select>

          <select
            value={favoriteFilter === undefined ? 'all' : favoriteFilter.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setFavoriteFilter(value === 'all' ? undefined : value === 'true');
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="all">모든 북마크</option>
            <option value="true">즐겨찾기</option>
            <option value="false">일반 북마크</option>
          </select>

          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            필터 초기화
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            총 {bookmarksData?.total || 0}개
          </span>
          {favoriteFilter && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <Star size={14} className="mr-1" />
              즐겨찾기
            </span>
          )}
          {statusFilter === 'archived' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <Archive size={14} className="mr-1" />
              보관됨
            </span>
          )}
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all' && favoriteFilter === undefined
              ? '라이브러리가 비어있습니다.'
              : '필터 조건에 맞는 북마크가 없습니다.'}
          </p>
          <p className="text-sm text-gray-400">
            {statusFilter === 'all' && favoriteFilter === undefined
              ? '새로운 북마크를 추가해보세요!'
              : '다른 필터 조건을 시도해보세요.'}
          </p>
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
