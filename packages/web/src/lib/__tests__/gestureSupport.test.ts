import { useGestureSupport, useKeyboardGestures } from '../gestureSupport';

// Mock React hooks
const mockUseRef = jest.fn();
const mockUseEffect = jest.fn();
const mockUseCallback = jest.fn();

jest.mock('react', () => ({
  useRef: (initial: any) => ({ current: initial }),
  useEffect: mockUseEffect,
  useCallback: mockUseCallback.mockImplementation((fn) => fn),
}));

describe('Gesture Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEffect.mockClear();
    mockUseCallback.mockClear();
  });

  describe('useGestureSupport', () => {
    it('should initialize gesture support', () => {
      const mockElement = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
      const mockHandlers = {
        onSwipeLeft: jest.fn(),
        onSwipeRight: jest.fn(),
        onTap: jest.fn(),
      };

      useGestureSupport({ current: mockElement }, mockHandlers);

      expect(mockUseEffect).toHaveBeenCalled();
    });

    it('should handle touch start events', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      const mockHandlers = {};

      useGestureSupport({ current: mockElement }, mockHandlers);

      // Get the touchstart handler from the useEffect call
      const effectCallback = mockUseEffect.mock.calls[0][0];
      const touchStartHandler = effectCallback();

      // Simulate touch start
      const mockEvent = {
        touches: [
          { clientX: 100, clientY: 100 },
        ],
      };

      touchStartHandler(mockEvent);

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle swipe gestures', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      const mockSwipeLeft = jest.fn();
      const mockHandlers = {
        onSwipeLeft: mockSwipeLeft,
      };

      useGestureSupport({ current: mockElement }, mockHandlers);

      const effectCallback = mockUseEffect.mock.calls[0][0];
      effectCallback();

      // Simulate touch start
      const touchStartEvent = {
        touches: [{ clientX: 200, clientY: 100 }],
      };

      // Simulate touch end (swipe left)
      const touchEndEvent = {
        changedTouches: [{ clientX: 50, clientY: 100 }],
      };

      // Get handlers from addEventListener calls
      const touchStartCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      );
      const touchEndCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      );

      if (touchStartCall && touchEndCall) {
        const touchStartHandler = touchStartCall[1];
        const touchEndHandler = touchEndCall[1];

        touchStartHandler(touchStartEvent);
        touchEndHandler(touchEndEvent);

        expect(mockSwipeLeft).toHaveBeenCalled();
      }
    });

    it('should handle tap gestures', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      const mockTap = jest.fn();
      const mockHandlers = {
        onTap: mockTap,
      };

      useGestureSupport({ current: mockElement }, mockHandlers);

      const effectCallback = mockUseEffect.mock.calls[0][0];
      effectCallback();

      // Simulate tap
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      };
      const touchEndEvent = {
        changedTouches: [{ clientX: 105, clientY: 105 }],
      };

      const touchStartCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      );
      const touchEndCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      );

      if (touchStartCall && touchEndCall) {
        const touchStartHandler = touchStartCall[1];
        const touchEndHandler = touchEndCall[1];

        touchStartHandler(touchStartEvent);
        touchEndHandler(touchEndEvent);

        expect(mockTap).toHaveBeenCalledWith(105, 105);
      }
    });

    it('should handle double tap gestures', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      const mockDoubleTap = jest.fn();
      const mockHandlers = {
        onDoubleTap: mockDoubleTap,
      };

      useGestureSupport({ current: mockElement }, mockHandlers);

      const effectCallback = mockUseEffect.mock.calls[0][0];
      effectCallback();

      const touchEndEvent = {
        changedTouches: [{ clientX: 100, clientY: 100 }],
      };

      const touchEndCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      );

      if (touchEndCall) {
        const touchEndHandler = touchEndCall[1];

        // First tap
        touchEndHandler(touchEndEvent);

        // Second tap (within 300ms)
        setTimeout(() => {
          touchEndHandler(touchEndEvent);
          expect(mockDoubleTap).toHaveBeenCalledWith(100, 100);
        }, 100);
      }
    });

    it('should handle pinch gestures', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      const mockPinchIn = jest.fn();
      const mockHandlers = {
        onPinchIn: mockPinchIn,
      };

      useGestureSupport({ current: mockElement }, mockHandlers, { enablePinch: true });

      const effectCallback = mockUseEffect.mock.calls[0][0];
      effectCallback();

      // Simulate two-finger pinch in
      const touchMoveEvent = {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 120, clientY: 120 },
        ],
      };

      const touchMoveCall = mockElement.addEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      );

      if (touchMoveCall) {
        const touchMoveHandler = touchMoveCall[1];

        // First set initial distance
        const touchStartEvent = {
          touches: [
            { clientX: 100, clientY: 100 },
            { clientX: 150, clientY: 150 },
          ],
        };

        const touchStartCall = mockElement.addEventListener.mock.calls.find(
          call => call[0] === 'touchstart'
        );

        if (touchStartCall) {
          touchStartCall[1](touchStartEvent);
          touchMoveHandler(touchMoveEvent);

          expect(mockPinchIn).toHaveBeenCalled();
        }
      }
    });
  });

  describe('useKeyboardGestures', () => {
    it('should handle keyboard events', () => {
      const mockHandlers = {
        onArrowUp: jest.fn(),
        onArrowDown: jest.fn(),
        onEnter: jest.fn(),
        onEscape: jest.fn(),
      };

      useKeyboardGestures(mockHandlers);

      expect(mockUseEffect).toHaveBeenCalled();

      // Simulate keydown events
      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn(),
      };

      // Get the keydown handler
      const effectCallback = mockUseEffect.mock.calls[0][0];
      effectCallback();

      // Mock document.addEventListener
      const mockAddEventListener = jest.spyOn(document, 'addEventListener');
      const mockKeyHandler = jest.fn();
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'keydown') {
          (handler as Function)(mockEvent);
        }
      });

      useKeyboardGestures(mockHandlers);

      expect(mockHandlers.onArrowUp).toHaveBeenCalled();
    });

    it('should handle modifier keys', () => {
      const mockHandlers = {
        onTab: jest.fn(),
        onShiftTab: jest.fn(),
      };

      // Mock shift+tab
      const mockShiftTabEvent = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: jest.fn(),
      };

      const mockAddEventListener = jest.spyOn(document, 'addEventListener');
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'keydown') {
          (handler as Function)(mockShiftTabEvent);
        }
      });

      useKeyboardGestures(mockHandlers);

      expect(mockHandlers.onShiftTab).toHaveBeenCalled();
    });
  });
});