// src/pages/bookmarks/index.tsx
import React from 'react';
import { BookmarksMasonry } from '@/components/bookmarks/BookmarksMasonry';

export default function BookmarkPage() {
  const items = [
    {
      id: '1',
      title: 'Lorem ipsum dolor sit amet',
      memo: '설명 텍스트...',
      imageUrl: '/sample.jpg',
      tags: ['브랜딩', 'UX'],
    },
    {
      id: '2',
      title: '이미지 없는 북마크',
      memo: '이 경우 카드 높이가 낮게 표시됨',
    },
  ];

  return (
    <main className="p-4">
      <BookmarksMasonry items={items} />
    </main>
  );
}