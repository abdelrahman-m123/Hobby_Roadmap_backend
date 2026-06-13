import { useState, useCallback } from 'react';

export function useTouch() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const getSwipeDirection = useCallback(() => {
    if (!touchStart || !touchEnd) return null;
    
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      return xDiff > 0 ? 'left' : 'right';
    } else {
      return yDiff > 0 ? 'up' : 'down';
    }
  }, [touchStart, touchEnd]);

  return { onTouchStart, onTouchMove, getSwipeDirection };
}
