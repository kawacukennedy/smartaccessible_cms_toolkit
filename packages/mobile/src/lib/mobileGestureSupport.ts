import { PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

export interface GestureConfig {
  enabled: boolean;
  swipeThreshold: number;
  pinchThreshold: number;
  doubleTapDelay: number;
  longPressDelay: number;
}

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'doubleTap' | 'longPress' | 'pan';
  direction?: 'up' | 'down' | 'left' | 'right' | 'in' | 'out';
  velocity?: number;
  scale?: number;
  position?: { x: number; y: number };
  timestamp: number;
}

export interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
  timestamp: number;
}

export class MobileGestureSupport {
  private static defaultConfig: GestureConfig = {
    enabled: true,
    swipeThreshold: 50,
    pinchThreshold: 0.5,
    doubleTapDelay: 300,
    longPressDelay: 500,
  };

  private config: GestureConfig;
  private gestureListeners: ((event: GestureEvent) => void)[] = [];
  private voiceListeners: ((command: VoiceCommand) => void)[] = [];
  private lastTapTime = 0;
  private longPressTimer?: NodeJS.Timeout;

  constructor(config: Partial<GestureConfig> = {}) {
    this.config = { ...MobileGestureSupport.defaultConfig, ...config };
  }

  // Gesture Recognition Methods
  onPanGesture(event: PanGestureHandlerGestureEvent, state: PanGestureHandlerStateChangeEvent['nativeEvent']) {
    if (!this.config.enabled) return;

    const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;

    switch (state.state) {
      case State.END:
        this.handleSwipeGesture(translationX, translationY, velocityX, velocityY);
        break;
      case State.ACTIVE:
        this.emitGestureEvent({
          type: 'pan',
          position: { x: translationX, y: translationY },
          velocity: Math.sqrt(velocityX ** 2 + velocityY ** 2),
          timestamp: Date.now(),
        });
        break;
    }
  }

  private handleSwipeGesture(translationX: number, translationY: number, velocityX: number, velocityY: number) {
    const absX = Math.abs(translationX);
    const absY = Math.abs(translationY);

    if (absX > this.config.swipeThreshold || absY > this.config.swipeThreshold) {
      let direction: 'up' | 'down' | 'left' | 'right';

      if (absX > absY) {
        direction = translationX > 0 ? 'right' : 'left';
      } else {
        direction = translationY > 0 ? 'down' : 'up';
      }

      this.emitGestureEvent({
        type: 'swipe',
        direction,
        velocity: Math.sqrt(velocityX ** 2 + velocityY ** 2),
        timestamp: Date.now(),
      });
    }
  }

  onPinchGesture(scale: number, state: State) {
    if (!this.config.enabled) return;

    if (state === State.END) {
      const direction = scale > 1 ? 'out' : 'in';
      const absScale = Math.abs(scale - 1);

      if (absScale > this.config.pinchThreshold) {
        this.emitGestureEvent({
          type: 'pinch',
          direction,
          scale,
          timestamp: Date.now(),
        });
      }
    }
  }

  onTapGesture(position: { x: number; y: number }) {
    if (!this.config.enabled) return;

    const now = Date.now();
    const timeDiff = now - this.lastTapTime;

    if (timeDiff < this.config.doubleTapDelay) {
      this.emitGestureEvent({
        type: 'doubleTap',
        position,
        timestamp: now,
      });
      this.lastTapTime = 0; // Reset for next potential double tap
    } else {
      this.emitGestureEvent({
        type: 'tap',
        position,
        timestamp: now,
      });
      this.lastTapTime = now;
    }
  }

  onLongPressGesture(position: { x: number; y: number }) {
    if (!this.config.enabled) return;

    this.longPressTimer = setTimeout(() => {
      this.emitGestureEvent({
        type: 'longPress',
        position,
        timestamp: Date.now(),
      });
    }, this.config.longPressDelay);
  }

  cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
  }

  // Voice Navigation Methods
  async startVoiceRecognition(): Promise<void> {
    // Simulate voice recognition start
    // In a real implementation, this would use SpeechRecognition API or similar
    console.log('Voice recognition started');
  }

  async stopVoiceRecognition(): Promise<void> {
    // Simulate voice recognition stop
    console.log('Voice recognition stopped');
  }

  processVoiceCommand(transcript: string, confidence: number): VoiceCommand {
    const command = this.normalizeVoiceCommand(transcript);
    const action = this.mapCommandToAction(command);

    const voiceCommand: VoiceCommand = {
      command,
      action,
      confidence,
      timestamp: Date.now(),
    };

    this.emitVoiceCommand(voiceCommand);
    return voiceCommand;
  }

  private normalizeVoiceCommand(transcript: string): string {
    return transcript.toLowerCase().trim();
  }

  private mapCommandToAction(command: string): string {
    const commandMap: { [key: string]: string } = {
      'go back': 'navigate_back',
      'go home': 'navigate_home',
      'open settings': 'open_settings',
      'show menu': 'show_menu',
      'close': 'close_modal',
      'next': 'next_item',
      'previous': 'previous_item',
      'select': 'select_item',
      'edit': 'edit_mode',
      'save': 'save_changes',
      'delete': 'delete_item',
      'search': 'open_search',
      'help': 'show_help',
    };

    // Check for exact matches first
    if (commandMap[command]) {
      return commandMap[command];
    }

    // Check for partial matches
    for (const [key, action] of Object.entries(commandMap)) {
      if (command.includes(key) || key.includes(command)) {
        return action;
      }
    }

    return 'unknown_command';
  }

  // Event Listener Management
  addGestureListener(listener: (event: GestureEvent) => void): void {
    this.gestureListeners.push(listener);
  }

  removeGestureListener(listener: (event: GestureEvent) => void): void {
    const index = this.gestureListeners.indexOf(listener);
    if (index > -1) {
      this.gestureListeners.splice(index, 1);
    }
  }

  addVoiceListener(listener: (command: VoiceCommand) => void): void {
    this.voiceListeners.push(listener);
  }

  removeVoiceListener(listener: (command: VoiceCommand) => void): void {
    const index = this.voiceListeners.indexOf(listener);
    if (index > -1) {
      this.voiceListeners.splice(index, 1);
    }
  }

  private emitGestureEvent(event: GestureEvent): void {
    this.gestureListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in gesture listener:', error);
      }
    });
  }

  private emitVoiceCommand(command: VoiceCommand): void {
    this.voiceListeners.forEach(listener => {
      try {
        listener(command);
      } catch (error) {
        console.error('Error in voice listener:', error);
      }
    });
  }

  // Configuration
  updateConfig(newConfig: Partial<GestureConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): GestureConfig {
    return { ...this.config };
  }

  // Cleanup
  destroy(): void {
    this.gestureListeners = [];
    this.voiceListeners = [];
    this.cancelLongPress();
  }
}

// Singleton instance for global gesture support
export const globalGestureSupport = new MobileGestureSupport();