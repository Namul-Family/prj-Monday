import React from 'react';
import { Files, Plus, User } from 'lucide-react';
import { clsx } from 'clsx';

interface BottomNavProps {
  inboxCount?: number;
  onOrganizeClick: () => void;
  onAddClick: () => void;
  onProfileClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  inboxCount = 0,
  onOrganizeClick,
  onAddClick,
  onProfileClick,
}) => {
  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-50',
        'px-4 pb-2', // 좌우 여백 + 하단 여백
      )}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      {/* Glass/Blur Background Bar (뒤에만 적용) */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-20',
          'backdrop-blur-md bg-white/50', // 유리 효과
          // 상단으로 갈수록 투명해지는 마스크 (경계 제거 핵심)
          '[mask-image:linear-gradient(to_top,white_30%,transparent_100%)]',
          '[-webkit-mask-image:linear-gradient(to_top,white_90%,transparent_100%)]',
        )}
      />

      {/* 실제 버튼 레이어 */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left: 정리하기(Organize) - 솔리드 */}
        <button
          onClick={onOrganizeClick}
          className={clsx(
            'flex items-center justify-center gap-2',
            'h-12 px-4 rounded-2xl active:scale-95 transition',
            inboxCount > 0
              ? 'bg-gray-900 text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          <Files size={18} strokeWidth={2.0} />
          <span className="text-[14px] font-medium leading-none">{inboxCount}</span>
          <span className="sr-only">미분류 {inboxCount}개 정리하기</span>
        </button>

        {/* Center: 추가(Plus) - 솔리드 강조 */}
        <button
          onClick={onAddClick}
          className={clsx(
            'flex items-center justify-center',
            'h-12 w-28 rounded-2xl',
            'bg-gray-100 text-gray-800',
            'shadow-[0_8px_22px_rgba(0,0,0,0.22)]',
            'active:scale-95 transition'
          )}
          aria-label="추가"
        >
          <Plus size={22} strokeWidth={2.4} />
        </button>

        {/* Right: 프로필 - 솔리드 라이트 */}
        <button
          onClick={onProfileClick}
          className={clsx(
            'flex items-center justify-center',
            'w-12 h-12 rounded-2xl',
            'bg-gray-100 text-gray-800',
            'shadow-[0_6px_18px_rgba(0,0,0,0.12)]',
            'active:scale-95 transition'
          )}
          aria-label="내 정보"
        >
          <User size={20} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
};