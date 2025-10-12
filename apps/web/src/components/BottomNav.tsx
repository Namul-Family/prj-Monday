import React from 'react';
import { Trash2, Plus, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface BottomNavProps {
  inboxCount?: number;
  onTrashClick: () => void;
  onAddClick: () => void;
  onProfileClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  inboxCount = 0,
  onTrashClick,
  onAddClick,
  onProfileClick,
}) => {
  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-50 flex justify-between items-end px-4',
        'pointer-events-none' // 개별 버튼만 클릭 가능하도록
      )}
      // iOS 홈 인디케이터 여유 + 살짝 떠 보이도록 여백
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
    >
      {/* Left: Inbox/정리하기 (Dark pill) */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        aria-label="정리하기"
        onClick={onTrashClick}
        className={clsx(
          'relative pointer-events-auto',
          'flex items-center justify-center gap-2',
          'h-12 px-4 rounded-2xl',
          'bg-black/85 text-white backdrop-blur-md',
          'shadow-[0_6px_20px_rgba(0,0,0,0.25)]'
        )}
      >
        <Trash2 size={20} />
        {inboxCount > 0 && (
          <span
            className={clsx(
              'absolute -top-1.5 -right-1.5',
              'w-5 h-5 rounded-full',
              'bg-red-500 text-white text-[10px] font-semibold',
              'flex items-center justify-center shadow-sm'
            )}
          >
            {inboxCount > 99 ? '99+' : inboxCount}
          </span>
        )}
        <span className="sr-only">미분류 {inboxCount}개</span>
      </motion.button>

      {/* Center: Add (Large glass pill) */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        aria-label="추가"
        onClick={onAddClick}
        className={clsx(
          'pointer-events-auto',
          'h-12 w-28 rounded-2xl',
          'bg-white/70 text-gray-900 backdrop-blur-lg',
          'shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
          'flex items-center justify-center active:bg-white/80'
        )}
      >
        <Plus size={22} />
      </motion.button>

      {/* Right: Profile (Glass circle) */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        aria-label="내 정보"
        onClick={onProfileClick}
        className={clsx(
          'pointer-events-auto',
          'w-12 h-12 rounded-full',
          'bg-white/70 text-gray-800 backdrop-blur-lg',
          'shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
          'flex items-center justify-center active:bg-white/80'
        )}
      >
        <User size={20} />
      </motion.button>
    </div>
  );
};