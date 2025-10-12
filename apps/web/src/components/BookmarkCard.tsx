import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { Bookmark } from '@monday-bookmark/types';
import { clsx } from 'clsx';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onToggleFavorite,
}) => {
  const getImageUrl = () => {
    if (bookmark.metaImageUrl) return bookmark.metaImageUrl;
    return `https://via.placeholder.com/400x300/9ca3af/ffffff?text=${encodeURIComponent(
      bookmark.title.slice(0, 8)
    )}`;
  };

  const getTagBadges = () => {
    const mockTags = [
      { name: '브랜딩', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'UX', color: 'bg-rose-100 text-rose-800' },
      { name: 'React', color: 'bg-green-100 text-green-800' },
    ];
    return mockTags.slice(0, 2).map((tag, i) => (
      <span
        key={i}
        className={clsx(
          'rounded-full px-2 py-0.5 text-[11px] font-medium',
          tag.color
        )}
      >
        {tag.name}
      </span>
    ));
  };

  return (
    <div className="relative flex flex-col">
      {/* 이미지 섹션 */}
      <div className="relative w-full">
        <img
          src={getImageUrl()}
          alt={bookmark.title}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover rounded-lg"
        />

        {/* 외부 링크 아이콘 */}
        {bookmark.url && (
          <div className="absolute top-1.5 right-1.5 bg-white bg-opacity-90 rounded-full p-1">
            <ExternalLink size={12} className="text-gray-700" />
          </div>
        )}

        {/* 즐겨찾기 */}
        <button
          onClick={() => onToggleFavorite?.(bookmark.id, !bookmark.isFavorite)}
          className="absolute top-1.5 left-1.5 bg-white bg-opacity-90 rounded-full p-1"
        >
          <Heart
            size={12}
            className={clsx(
              bookmark.isFavorite
                ? 'text-red-500 fill-current'
                : 'text-gray-400'
            )}
          />
        </button>
      </div>

      {/* 텍스트 섹션 */}
      <div className="mt-2">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
          {bookmark.title}
        </h3>
        {bookmark.content && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-snug">
            {bookmark.content}
          </p>
        )}
      </div>

      {/* 태그 섹션 */}
      <div className="flex flex-wrap gap-1 mt-2">{getTagBadges()}</div>
    </div>
  );
};