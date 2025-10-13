import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { Bookmark } from '@monday-bookmark/types';
import clsx from 'clsx';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

/**
 * 변경 사항
 * - 카드 루트: flex 제거 → block/inline-block로 자연 높이 계산 (Masonry 호환)
 * - 섹션별 조건부 렌더링(이미지/타이틀/메모/태그)
 * - break-inside 회피(표준 + avoid-column)로 컬럼에서 분리 금지
 */
export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onToggleFavorite,
}) => {
  // ---- 값 존재 여부
  const hasImage = !!bookmark.metaImageUrl?.trim();
  const hasTitle = !!bookmark.title?.trim();
  const memoText = bookmark.content?.trim() || bookmark.memo?.trim() || '';
  const hasMemo = memoText.length > 0;
  const hasUrl = !!bookmark.url?.trim();

  // TODO: 실제 태그 데이터로 교체
  const mockTags = [
    { name: '브랜딩', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'UX',      color: 'bg-rose-100 text-rose-800'  },
  ];
  const tags = mockTags;
  const hasTags = tags.length > 0;

  return (
    <article
      className={clsx(
        // 🔹 Masonry 호환: 하나의 블록으로 취급 + 컬럼 경계에서 분리 금지
        'inline-block align-top w-full break-inside-avoid [break-inside:avoid-column]',
        'relative rounded-xl bg-white overflow-hidden' // << ring(아웃라인) 제거
      )}
    >
      {/* 이미지 섹션 (있을 때만) */}
      {hasImage && (
        <div className="relative">
          {/* ❌ aspect/h-고정 금지 → ✅ 원본 비율로 높이 자동 */}
          <img
            src={bookmark.metaImageUrl!}
            alt={hasTitle ? bookmark.title! : 'bookmark thumbnail'}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto rounded-xl"
          />

          {/* 외부 링크 아이콘 (이미지 우상단) */}
          {hasUrl && (
            <a
              href={bookmark.url!}
              target="_blank"
              rel="noreferrer"
              aria-label="새 창에서 열기"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/55 text-white"
            >
              <ExternalLink size={16} />
            </a>
          )}

          {/* 즐겨찾기 토글 (이미지 좌상단) */}
          <button
            type="button"
            onClick={() => onToggleFavorite?.(bookmark.id, !bookmark.isFavorite)}
            aria-label={bookmark.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
            className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90"
          >
            <Heart
              size={16}
              className={clsx(
                bookmark.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
              )}
            />
          </button>
        </div>
      )}

      {/* 본문 (필드 있을 때만) */}
      {(hasTitle || hasMemo || hasTags) && (
        <div className="p-3.5">
          {hasTitle && (
            <h3 className="text-[15px] font-semibold leading-snug text-gray-900">
              {bookmark.title}
            </h3>
          )}

          {/* 메모: 높이 가변을 위해 line-clamp 제거 */}
          {hasMemo && (
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500 whitespace-pre-line">
              {memoText}
            </p>
          )}

          {hasTags && (
            <div className={clsx('flex flex-wrap gap-1', (hasTitle || hasMemo) && 'mt-2')}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={clsx(
                    'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium',
                    tag.color
                  )}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};