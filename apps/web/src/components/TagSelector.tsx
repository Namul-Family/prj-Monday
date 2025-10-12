import React from 'react';
import { Tag } from '@monday-bookmark/types';
import { clsx } from 'clsx';
import { Filter } from 'lucide-react';

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagSelect: (tagId: string, meta?: { isAllOnlySelected?: boolean }) => void;
  onTagManagerOpen: () => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTagIds,
  onTagSelect,
  onTagManagerOpen,
}) => {
  const isAllOnlySelected = selectedTagIds.length === 0 || selectedTagIds.includes('all');
  const hasAnyFilter = selectedTagIds.length > 0; // 하나 이상 태그 선택됨

  const handleTagClick = (tagId: string) => {
    if (tagId === 'all') {
      if (isAllOnlySelected) {
        onTagSelect('all', { isAllOnlySelected: true });
        onTagManagerOpen();
      } else {
        onTagSelect('all');
      }
      return;
    }
    onTagSelect(tagId);
  };

  return (
    <div className="bg-white">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
        {/* All / Filter 칩 */}
        <button
          onClick={() => handleTagClick('all')}
          aria-label={hasAnyFilter ? `필터 ${selectedTagIds.length}개 적용됨` : 'All'}
          className={clsx(
            'flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition select-none flex items-center justify-center gap-1.5 min-w-[60px]',
            (hasAnyFilter || isAllOnlySelected)
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          )}
        >
          {/* “필터 아이콘 + 숫자”와 “All” 모두 동일한 높이·정렬 유지 */}
          <span className="flex items-center justify-center h-4">
            {hasAnyFilter ? (
              <>
                <Filter size={14} className="shrink-0" />
                <span className="ml-0.5 text-sm leading-none">{selectedTagIds.length}</span>
              </>
            ) : (
              <span className="text-sm leading-none">All</span>
            )}
          </span>
        </button>

        {/* 개별 태그들 */}
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          const dynamicStyle = isSelected
            ? { backgroundColor: tag.color, color: '#fff' }
            : undefined;

          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={clsx(
                'flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition select-none',
                !isSelected && 'bg-white border border-gray-200 text-gray-800'
              )}
              style={dynamicStyle}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};