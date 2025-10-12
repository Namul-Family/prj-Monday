import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { lockScroll, unlockScroll, createSwipeDetector } from '../../utils/mobile';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;

    // 스와이프 다운으로 닫기
    const cleanup = createSwipeDetector(
      sheetRef.current,
      undefined, // swipeUp
      onClose,   // swipeDown
    );

    return cleanup;
  }, [isOpen, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="backdrop"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={clsx(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85dvh] flex flex-col',
          'transform transition-transform duration-300 ease-out',
          className
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto touch-scroll px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
