import { useEffect, useCallback, useRef } from 'react';

interface GestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  enableSwipe?: boolean;
  enablePinch?: boolean;
  enableRotate?: boolean;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
}

export const useGestureSupport = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: GestureHandlers,
  options: GestureOptions = {}
) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    enableSwipe = true,
    enablePinch = true,
    enableRotate = true
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Multi-touch gesture tracking
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const touchesRef = useRef<Touch[]>([]);

  const getDistance = useCallback((touches: Touch[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getAngle = useCallback((touches: Touch[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches);
    touchesRef.current = touches;

    if (touches.length === 1) {
      // Single touch gestures
      const touch = touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      // Start long press timer
      longPressTimerRef.current = setTimeout(() => {
        if (handlers.onLongPress && touchStartRef.current) {
          handlers.onLongPress(touchStartRef.current.x, touchStartRef.current.y);
        }
      }, 500);
    } else if (touches.length === 2 && (enablePinch || enableRotate)) {
      // Multi-touch gestures
      initialDistanceRef.current = getDistance(touches);
      initialAngleRef.current = getAngle(touches);
    }
  }, [handlers, enablePinch, enableRotate, getDistance, getAngle]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches);

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (touches.length === 2 && (enablePinch || enableRotate)) {
      const currentDistance = getDistance(touches);
      const currentAngle = getAngle(touches);

      if (enablePinch && initialDistanceRef.current > 0) {
        const scale = currentDistance / initialDistanceRef.current;
        if (scale < 0.8 && handlers.onPinchIn) {
          handlers.onPinchIn(scale);
        } else if (scale > 1.2 && handlers.onPinchOut) {
          handlers.onPinchOut(scale);
        }
      }

      if (enableRotate && initialAngleRef.current !== 0) {
        const angleDiff = currentAngle - initialAngleRef.current;
        if (Math.abs(angleDiff) > 15 && handlers.onRotate) {
          handlers.onRotate(angleDiff);
        }
      }
    }
  }, [handlers, enablePinch, enableRotate, getDistance, getAngle]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.changedTouches);

    // Clear timers
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (touches.length === 1 && touchStartRef.current) {
      const touch = touches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;
      const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

      // Handle swipe gestures
      if (enableSwipe && velocity > velocityThreshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && handlers.onSwipeRight) {
              handlers.onSwipeRight();
            } else if (deltaX < 0 && handlers.onSwipeLeft) {
              handlers.onSwipeLeft();
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0 && handlers.onSwipeDown) {
              handlers.onSwipeDown();
            } else if (deltaY < 0 && handlers.onSwipeUp) {
              handlers.onSwipeUp();
            }
          }
        }
      }

      // Handle tap gestures
      const now = Date.now();
      if (velocity < velocityThreshold && handlers.onTap) {
        handlers.onTap(touchEndRef.current.x, touchEndRef.current.y);

        // Check for double tap
        if (now - lastTapRef.current < 300 && handlers.onDoubleTap) {
          handlers.onDoubleTap(touchEndRef.current.x, touchEndRef.current.y);
        }
        lastTapRef.current = now;
      }
    }

    // Reset multi-touch refs
    initialDistanceRef.current = 0;
    initialAngleRef.current = 0;
    touchesRef.current = [];
  }, [handlers, enableSwipe, threshold, velocityThreshold]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);
};

// Keyboard gesture support for accessibility
export const useKeyboardGestures = (handlers: {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlers.onArrowRight?.();
        break;
      case 'Enter':
        handlers.onEnter?.();
        break;
      case 'Escape':
        handlers.onEscape?.();
        break;
      case 'Tab':
        if (e.shiftKey) {
          handlers.onShiftTab?.();
        } else {
          handlers.onTab?.();
        }
        break;
    }
  }, [handlers]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};