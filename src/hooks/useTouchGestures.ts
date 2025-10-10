import { useState, useCallback, useRef, useEffect } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate' | 'pan';
  startPoint: TouchPoint;
  endPoint?: TouchPoint;
  distance?: number;
  angle?: number;
  scale?: number;
  velocity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

interface TouchGestureOptions {
  tapThreshold?: number;
  doubleTapDelay?: number;
  longPressDelay?: number;
  swipeThreshold?: number;
  pinchThreshold?: number;
  rotateThreshold?: number;
  panThreshold?: number;
}

interface UseTouchGesturesProps {
  onGesture?: (gesture: TouchGesture) => void;
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
  onSwipe?: (gesture: TouchGesture) => void;
  onPinch?: (gesture: TouchGesture) => void;
  onRotate?: (gesture: TouchGesture) => void;
  onPan?: (gesture: TouchGesture) => void;
  options?: TouchGestureOptions;
  enabled?: boolean;
}

const DEFAULT_OPTIONS: TouchGestureOptions = {
  tapThreshold: 10,
  doubleTapDelay: 300,
  longPressDelay: 500,
  swipeThreshold: 50,
  pinchThreshold: 10,
  rotateThreshold: 15,
  panThreshold: 10
};

export const useTouchGestures = ({
  onGesture,
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  onPinch,
  onRotate,
  onPan,
  options = DEFAULT_OPTIONS,
  enabled = true
}: UseTouchGesturesProps) => {
  const [touches, setTouches] = useState<TouchPoint[]>([]);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [gestureStart, setGestureStart] = useState<{
    time: number;
    touches: TouchPoint[];
  } | null>(null);

  const lastTapRef = useRef<{ time: number; point: TouchPoint } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gestureRef = useRef<HTMLDivElement>(null);

  const getDistance = (point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const getDirection = (point1: TouchPoint, point2: TouchPoint): 'up' | 'down' | 'left' | 'right' => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  const getVelocity = (point1: TouchPoint, point2: TouchPoint, duration: number): number => {
    const distance = getDistance(point1, point2);
    return distance / duration;
  };

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    event.preventDefault();
    const touchList = Array.from(event.touches);
    const newTouches: TouchPoint[] = touchList.map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }));

    setTouches(newTouches);
    setGestureStart({
      time: Date.now(),
      touches: newTouches
    });
    setIsGestureActive(true);

    // Start long press timer
    if (newTouches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        const gesture: TouchGesture = {
          type: 'long-press',
          startPoint: newTouches[0],
          duration: options.longPressDelay
        };
        onGesture?.(gesture);
        onLongPress?.(newTouches[0]);
      }, options.longPressDelay);
    }
  }, [enabled, onGesture, onLongPress, options.longPressDelay]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enabled || !isGestureActive || !gestureStart) return;

    event.preventDefault();
    const touchList = Array.from(event.touches);
    const currentTouches: TouchPoint[] = touchList.map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }));

    setTouches(currentTouches);

    // Clear long press timer on movement
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle multi-touch gestures
    if (currentTouches.length === 2 && gestureStart.touches.length === 2) {
      const startDistance = getDistance(gestureStart.touches[0], gestureStart.touches[1]);
      const currentDistance = getDistance(currentTouches[0], currentTouches[1]);
      const scale = currentDistance / startDistance;

      // Pinch gesture
      if (Math.abs(scale - 1) > options.pinchThreshold! / 100) {
        const gesture: TouchGesture = {
          type: 'pinch',
          startPoint: gestureStart.touches[0],
          endPoint: currentTouches[0],
          scale,
          distance: currentDistance
        };
        onGesture?.(gesture);
        onPinch?.(gesture);
      }

      // Rotate gesture
      const startAngle = getAngle(gestureStart.touches[0], gestureStart.touches[1]);
      const currentAngle = getAngle(currentTouches[0], currentTouches[1]);
      const angleDiff = Math.abs(currentAngle - startAngle);

      if (angleDiff > options.rotateThreshold!) {
        const gesture: TouchGesture = {
          type: 'rotate',
          startPoint: gestureStart.touches[0],
          endPoint: currentTouches[0],
          angle: currentAngle - startAngle,
          distance: currentDistance
        };
        onGesture?.(gesture);
        onRotate?.(gesture);
      }
    }

    // Handle single touch pan
    if (currentTouches.length === 1 && gestureStart.touches.length === 1) {
      const distance = getDistance(gestureStart.touches[0], currentTouches[0]);
      if (distance > options.panThreshold!) {
        const gesture: TouchGesture = {
          type: 'pan',
          startPoint: gestureStart.touches[0],
          endPoint: currentTouches[0],
          distance,
          direction: getDirection(gestureStart.touches[0], currentTouches[0])
        };
        onGesture?.(gesture);
        onPan?.(gesture);
      }
    }
  }, [enabled, isGestureActive, gestureStart, onGesture, onPinch, onRotate, onPan, options]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!enabled || !isGestureActive || !gestureStart) return;

    event.preventDefault();
    const duration = Date.now() - gestureStart.time;

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle single touch gestures
    if (gestureStart.touches.length === 1 && touches.length === 1) {
      const startPoint = gestureStart.touches[0];
      const endPoint = touches[0];
      const distance = getDistance(startPoint, endPoint);
      const velocity = getVelocity(startPoint, endPoint, duration);

      // Tap gesture
      if (distance < options.tapThreshold!) {
        const now = Date.now();
        const lastTap = lastTapRef.current;

        if (lastTap && (now - lastTap.time) < options.doubleTapDelay!) {
          // Double tap
          const gesture: TouchGesture = {
            type: 'double-tap',
            startPoint,
            duration
          };
          onGesture?.(gesture);
          onDoubleTap?.(startPoint);
          lastTapRef.current = null;
        } else {
          // Single tap
          const gesture: TouchGesture = {
            type: 'tap',
            startPoint,
            duration
          };
          onGesture?.(gesture);
          onTap?.(startPoint);
          lastTapRef.current = { time: now, point: startPoint };
        }
      } else if (distance > options.swipeThreshold!) {
        // Swipe gesture
        const gesture: TouchGesture = {
          type: 'swipe',
          startPoint,
          endPoint,
          distance,
          velocity,
          direction: getDirection(startPoint, endPoint),
          duration
        };
        onGesture?.(gesture);
        onSwipe?.(gesture);
      }
    }

    setTouches([]);
    setIsGestureActive(false);
    setGestureStart(null);
  }, [enabled, isGestureActive, gestureStart, touches, onGesture, onTap, onDoubleTap, onSwipe, options]);

  const handleTouchCancel = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    event.preventDefault();
    setTouches([]);
    setIsGestureActive(false);
    setGestureStart(null);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, [enabled]);

  // Attach event listeners
  useEffect(() => {
    const element = gestureRef.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, enabled]);

  return {
    gestureRef,
    touches,
    isGestureActive,
    gestureStart
  };
};

export default useTouchGestures;
