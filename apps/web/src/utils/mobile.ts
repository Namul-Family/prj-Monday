// 모바일 웹 전용 유틸리티 함수들

/**
 * body 스크롤을 잠그거나 해제합니다 (바텀시트 열릴 때 사용)
 */
export const lockScroll = () => {
  document.body.classList.add('scroll-lock');
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};

export const unlockScroll = () => {
  document.body.classList.remove('scroll-lock');
  document.body.style.position = '';
  document.body.style.width = '';
};

/**
 * Safe area inset 값을 가져옵니다
 */
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: computedStyle.getPropertyValue('--safe-area-inset-top') || '0px',
    bottom: computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: computedStyle.getPropertyValue('--safe-area-inset-left') || '0px',
    right: computedStyle.getPropertyValue('--safe-area-inset-right') || '0px',
  };
};

/**
 * 터치 디바이스인지 확인합니다
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * iOS Safari인지 확인합니다
 */
export const isIOSSafari = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
};

/**
 * Android Chrome인지 확인합니다
 */
export const isAndroidChrome = () => {
  const ua = navigator.userAgent;
  return /Android/.test(ua) && /Chrome/.test(ua);
};

/**
 * 모바일 브라우저인지 확인합니다
 */
export const isMobileBrowser = () => {
  return isIOSSafari() || isAndroidChrome();
};

/**
 * 뷰포트 높이를 안전하게 가져옵니다 (키보드 고려)
 */
export const getViewportHeight = () => {
  if (isMobileBrowser()) {
    // 모바일에서는 dvh 사용
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  }
  return window.innerHeight || 0;
};

/**
 * 바텀시트의 최적 위치를 계산합니다 (키보드 고려)
 */
export const getBottomSheetPosition = () => {
  const viewportHeight = getViewportHeight();
  const maxHeight = Math.floor(viewportHeight * 0.85); // 최대 85% 높이
  
  return {
    maxHeight: `${maxHeight}px`,
    bottom: '0px',
  };
};

/**
 * 입력 필드가 포커스될 때 키보드 대응을 위한 스크롤 조정
 */
export const scrollToInput = (inputElement: HTMLElement) => {
  if (!isMobileBrowser()) return;
  
  setTimeout(() => {
    inputElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300); // 키보드가 올라올 시간을 고려
};

/**
 * 스와이프 제스처 감지를 위한 기본 설정
 */
export const createSwipeDetector = (
  element: HTMLElement,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) => {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!e.changedTouches[0]) return;
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    // 최소 거리와 시간 체크
    if (deltaTime > 300 || Math.abs(deltaX) < 50 && Math.abs(deltaY) < 50) {
      return;
    }
    
    // 수직 스와이프가 더 강하면 수직으로 판단
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -50) {
        onSwipeUp?.();
      } else if (deltaY > 50) {
        onSwipeDown?.();
      }
    } else {
      if (deltaX < -50) {
        onSwipeLeft?.();
      } else if (deltaX > 50) {
        onSwipeRight?.();
      }
    }
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

/**
 * 햅틱 피드백 (지원하는 디바이스에서)
 */
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }
};
