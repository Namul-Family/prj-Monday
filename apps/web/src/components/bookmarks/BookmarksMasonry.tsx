import React from 'react';
import clsx from 'clsx';
import { Bookmark } from '@monday-bookmark/types';
import { BookmarkCard } from './BookmarkCard';

export function BookmarksMasonry({ items }: { items: Bookmark[] }) {
  return (
    <div
      className={clsx(
        'w-full',
        // ✅ CSS Multi-column 기반 Masonry
        //    columns-* : 컬럼 수, gap-x-* : 컬럼 간격
        'columns-1 sm:columns-2 lg:columns-3 gap-x-4',

        // ✅ 컬럼 높이 균형 (브라우저별)
        '[column-fill:balance]',
        '[-webkit-column-fill:balance]',

        // ✅ 카드(직계 자식)에게 필수 속성 강제
        //    - inline-block : 컬럼 레이아웃에서 카드가 하나의 블록으로 취급되도록
        //    - break-inside : 컬럼 경계에서 쪼개지지 않도록(표준/벤더 값 둘 다)
        //    - mb-4         : 카드 사이 세로 간격
        '[&>*]:inline-block',
        '[&>*]:break-inside-avoid',
        '[&>*]:[break-inside:avoid-column]',
        '[&>*]:mb-4',
        '[&>*]:w-full' // 카드가 컬럼 너비를 꽉 채우도록
      )}
    >
      {items.map((b) => (
        <BookmarkCard key={b.id} bookmark={b} />
      ))}
    </div>
  );
}