import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { globalGestureSupport, GestureEvent } from '../lib/mobileGestureSupport';

interface MobileGestureHandlerProps {
  children: React.ReactNode;
  onGesture?: (event: GestureEvent) => void;
  enabled?: boolean;
  style?: any;
}

const MobileGestureHandler: React.FC<MobileGestureHandlerProps> = ({
  children,
  onGesture,
  enabled = true,
  style,
}) => {
  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const tapRef = useRef(null);
  const doubleTapRef = useRef(null);

  useEffect(() => {
    const handleGesture = (event: GestureEvent) => {
      onGesture?.(event);
    };

    globalGestureSupport.addGestureListener(handleGesture);

    return () => {
      globalGestureSupport.removeGestureListener(handleGesture);
    };
  }, [onGesture]);

  const onPanGestureEvent = (event: any) => {
    if (!enabled) return;
    globalGestureSupport.onPanGesture(event, event.nativeEvent);
  };

  const onPinchGestureEvent = (event: any) => {
    if (!enabled) return;
    const { scale } = event.nativeEvent;
    globalGestureSupport.onPinchGesture(scale, event.nativeEvent.state);
  };

  const onTapGestureEvent = (event: any) => {
    if (!enabled) return;
    if (event.nativeEvent.state === State.END) {
      const { x, y } = event.nativeEvent;
      globalGestureSupport.onTapGesture({ x, y });
    }
  };

  const onLongPressGestureEvent = (event: any) => {
    if (!enabled) return;
    const { state, x, y } = event.nativeEvent;

    if (state === State.BEGAN) {
      globalGestureSupport.onLongPressGesture({ x, y });
    } else if (state === State.END || state === State.CANCELLED) {
      globalGestureSupport.cancelLongPress();
    }
  };

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanGestureEvent}
      enabled={enabled}
    >
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchGestureEvent}
        enabled={enabled}
      >
        <TapGestureHandler
          ref={tapRef}
          onGestureEvent={onTapGestureEvent}
          onHandlerStateChange={onTapGestureEvent}
          enabled={enabled}
          numberOfTaps={1}
        >
          <TapGestureHandler
            ref={doubleTapRef}
            onGestureEvent={onTapGestureEvent}
            onHandlerStateChange={onTapGestureEvent}
            enabled={enabled}
            numberOfTaps={2}
          >
            <TapGestureHandler
              onGestureEvent={onLongPressGestureEvent}
              onHandlerStateChange={onLongPressGestureEvent}
              enabled={enabled}
              minDurationMs={500}
            >
              <View style={[styles.container, style]}>
                {children}
              </View>
            </TapGestureHandler>
          </TapGestureHandler>
        </TapGestureHandler>
      </PinchGestureHandler>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MobileGestureHandler;