import React from 'react';
import clsx from 'clsx';
import { Bookmark } from '@monday-bookmark/types';
import { BookmarkCard } from './BookmarkCard';

interface BookmarksMasonryProps {
    items: Bookmark[];
    className?: string;
    columnsClassName?: string;
    columnGapClassName?: string;
    itemGapClassName?: string;
    renderItem?: (bookmark: Bookmark) => React.ReactElement;
  }
  
  export function BookmarksMasonry({
    items,
    className,
    columnsClassName,
    columnGapClassName,
    itemGapClassName,
    renderItem,
  }: BookmarksMasonryProps) {
    const columns = columnsClassName ?? 'columns-1 sm:columns-2 lg:columns-3';
    const columnGap = columnGapClassName ?? 'gap-x-4';
    const itemGap = itemGapClassName ?? '[&>*]:mb-4';
    const renderBookmark =
      renderItem ?? ((bookmark: Bookmark) => <BookmarkCard bookmark={bookmark} />);

  return (
    <div
      className={clsx(
        'w-full',
        // ✅ CSS Multi-column 기반 Masonry
        columns,
        columnGap,

        // ✅ 컬럼 높이 균형 (브라우저별)
        '[column-fill:balance]',
        '[-webkit-column-fill:balance]',

        // ✅ 카드(직계 자식)에게 필수 속성 강제
        //    - inline-block : 컬럼 레이아웃에서 카드가 하나의 블록으로 취급되도록
        //    - break-inside : 컬럼 경계에서 쪼개지지 않도록(표준/벤더 값 둘 다)
        '[&>*]:inline-block',
        '[&>*]:break-inside-avoid',
        '[&>*]:[break-inside:avoid-column]',
        '[&>*]:w-full',
        itemGap,
        className
      )}
    >
    {items.map((bookmark) => {
        const element = renderBookmark(bookmark);
        return React.isValidElement(element)
            ? React.cloneElement(element, { key: bookmark.id })
            : element;
      })}
    </div>
  );
}