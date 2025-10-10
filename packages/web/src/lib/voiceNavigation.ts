import { useEffect, useCallback, useRef } from 'react';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

interface VoiceNavigationOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceNavigation = (commands: VoiceCommand[], options: VoiceNavigationOptions = {}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  const {
    language = 'en-US',
    continuous = true,
    interimResults = false
  } = options;

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      isListeningRef.current = true;
      console.log('Voice navigation started');
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();

        // Find matching command
        const matchedCommand = commands.find(cmd =>
          transcript.includes(cmd.command.toLowerCase())
        );

        if (matchedCommand) {
          console.log(`Voice command recognized: ${matchedCommand.command}`);
          matchedCommand.action();

          // Provide audio feedback
          speak(`Executing: ${matchedCommand.description}`);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      console.log('Voice navigation ended');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [commands, language, continuous, interimResults]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    startListening,
    stopListening,
    speak,
    isListening: isListeningRef.current
  };
};

// Predefined voice commands for common actions
export const createDefaultVoiceCommands = (
  actions: {
    navigateTo?: (page: string) => void;
    toggleMenu?: () => void;
    search?: (query: string) => void;
    goBack?: () => void;
    goForward?: () => void;
    scrollUp?: () => void;
    scrollDown?: () => void;
    focusElement?: (selector: string) => void;
  }
): VoiceCommand[] => {
  const commands: VoiceCommand[] = [];

  if (actions.navigateTo) {
    commands.push(
      { command: 'go to', action: () => actions.navigateTo?.('home'), description: 'Navigate to home page' },
      { command: 'open dashboard', action: () => actions.navigateTo?.('dashboard'), description: 'Open dashboard' },
      { command: 'show settings', action: () => actions.navigateTo?.('settings'), description: 'Open settings' },
      { command: 'view profile', action: () => actions.navigateTo?.('profile'), description: 'View profile' }
    );
  }

  if (actions.toggleMenu) {
    commands.push(
      { command: 'open menu', action: actions.toggleMenu, description: 'Open navigation menu' },
      { command: 'close menu', action: actions.toggleMenu, description: 'Close navigation menu' },
      { command: 'toggle menu', action: actions.toggleMenu, description: 'Toggle navigation menu' }
    );
  }

  if (actions.search) {
    commands.push(
      { command: 'search for', action: () => {
        const query = 'user input'; // This would be extracted from speech
        actions.search?.(query);
      }, description: 'Perform search' }
    );
  }

  if (actions.goBack) {
    commands.push(
      { command: 'go back', action: actions.goBack, description: 'Go back to previous page' }
    );
  }

  if (actions.scrollUp) {
    commands.push(
      { command: 'scroll up', action: actions.scrollUp, description: 'Scroll up' },
      { command: 'page up', action: actions.scrollUp, description: 'Page up' }
    );
  }

  if (actions.scrollDown) {
    commands.push(
      { command: 'scroll down', action: actions.scrollDown, description: 'Scroll down' },
      { command: 'page down', action: actions.scrollDown, description: 'Page down' }
    );
  }

  return commands;
};