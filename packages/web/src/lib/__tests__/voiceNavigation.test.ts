import { useVoiceNavigation, createDefaultVoiceCommands } from '../voiceNavigation';

// Mock SpeechRecognition
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  lang: '',
  continuous: false,
  interimResults: false,
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null,
};

const mockSpeechSynthesisUtterance = jest.fn();
const mockSpeechSynthesis = {
  speak: jest.fn(),
};

// Mock window properties
Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true,
});

describe('Voice Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock functions
    mockSpeechRecognition.start.mockClear();
    mockSpeechRecognition.stop.mockClear();
    mockSpeechSynthesis.speak.mockClear();
  });

  describe('useVoiceNavigation', () => {
    it('should initialize voice navigation', () => {
      const commands = [
        { command: 'test', action: jest.fn(), description: 'Test command' },
      ];

      const { startListening, stopListening, speak } = useVoiceNavigation(commands);

      expect(typeof startListening).toBe('function');
      expect(typeof stopListening).toBe('function');
      expect(typeof speak).toBe('function');
    });

    it('should start listening when supported', () => {
      const commands = [
        { command: 'hello', action: jest.fn(), description: 'Say hello' },
      ];

      const { startListening } = useVoiceNavigation(commands);
      startListening();

      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });

    it('should handle speech recognition results', () => {
      const mockAction = jest.fn();
      const commands = [
        { command: 'test command', action: mockAction, description: 'Test command' },
      ];

      useVoiceNavigation(commands);

      // Simulate speech recognition result
      const mockEvent = {
        results: [
          {
            [0]: { transcript: 'test command' },
            isFinal: true,
          },
        ],
      };

      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }

      expect(mockAction).toHaveBeenCalled();
    });

    it('should speak text using speech synthesis', () => {
      const { speak } = useVoiceNavigation([]);
      speak('Hello world');

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should handle unsupported browsers', () => {
      // Temporarily remove speech recognition support
      const originalWebkit = window.webkitSpeechRecognition;
      const originalSpeech = window.SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;
      delete (window as any).SpeechRecognition;

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { startListening } = useVoiceNavigation([]);
      startListening();

      expect(consoleSpy).toHaveBeenCalledWith('Speech recognition not supported');

      // Restore
      window.webkitSpeechRecognition = originalWebkit;
      window.SpeechRecognition = originalSpeech;
      consoleSpy.mockRestore();
    });
  });

  describe('createDefaultVoiceCommands', () => {
    it('should create default voice commands', () => {
      const actions = {
        navigateTo: jest.fn(),
        toggleMenu: jest.fn(),
        search: jest.fn(),
        goBack: jest.fn(),
        scrollUp: jest.fn(),
        scrollDown: jest.fn(),
      };

      const commands = createDefaultVoiceCommands(actions);

      expect(commands.length).toBeGreaterThan(0);
      expect(commands.some(cmd => cmd.command === 'go to')).toBe(true);
      expect(commands.some(cmd => cmd.command === 'open menu')).toBe(true);
      expect(commands.some(cmd => cmd.command === 'go back')).toBe(true);
      expect(commands.some(cmd => cmd.command === 'scroll up')).toBe(true);
    });

    it('should handle missing actions', () => {
      const commands = createDefaultVoiceCommands({});

      expect(commands.length).toBe(0);
    });

    it('should call actions when commands match', () => {
      const mockNavigate = jest.fn();
      const commands = createDefaultVoiceCommands({
        navigateTo: mockNavigate,
      });

      const navigateCommand = commands.find(cmd => cmd.command === 'go to');
      expect(navigateCommand).toBeDefined();

      navigateCommand?.action();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});