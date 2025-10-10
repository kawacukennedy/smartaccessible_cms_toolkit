import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { globalGestureSupport, VoiceCommand } from '../lib/mobileGestureSupport';

interface MobileVoiceNavigationProps {
  isVisible: boolean;
  onClose: () => void;
  onVoiceCommand?: (command: VoiceCommand) => void;
}

interface VoiceCommandItem {
  command: string;
  description: string;
  example: string;
}

const availableCommands: VoiceCommandItem[] = [
  { command: 'Go back', description: 'Navigate to previous screen', example: 'Say "go back"' },
  { command: 'Go home', description: 'Navigate to home screen', example: 'Say "go home"' },
  { command: 'Open settings', description: 'Open settings menu', example: 'Say "open settings"' },
  { command: 'Show menu', description: 'Display navigation menu', example: 'Say "show menu"' },
  { command: 'Close', description: 'Close current modal or screen', example: 'Say "close"' },
  { command: 'Next', description: 'Move to next item', example: 'Say "next"' },
  { command: 'Previous', description: 'Move to previous item', example: 'Say "previous"' },
  { command: 'Select', description: 'Select current item', example: 'Say "select"' },
  { command: 'Edit', description: 'Enter edit mode', example: 'Say "edit"' },
  { command: 'Save', description: 'Save current changes', example: 'Say "save"' },
  { command: 'Search', description: 'Open search interface', example: 'Say "search"' },
  { command: 'Help', description: 'Show help information', example: 'Say "help"' },
];

const MobileVoiceNavigation: React.FC<MobileVoiceNavigationProps> = ({
  isVisible,
  onClose,
  onVoiceCommand
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const recognitionTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleVoiceCommand = (command: VoiceCommand) => {
      setLastCommand(command);
      setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
      onVoiceCommand?.(command);

      // Provide feedback based on command
      provideVoiceFeedback(command);
    };

    globalGestureSupport.addVoiceListener(handleVoiceCommand);

    return () => {
      globalGestureSupport.removeVoiceListener(handleVoiceCommand);
    };
  }, [onVoiceCommand]);

  const startVoiceRecognition = async () => {
    try {
      setIsListening(true);
      await globalGestureSupport.startVoiceRecognition();

      // Simulate voice recognition with mock commands for demo
      recognitionTimeout.current = setTimeout(() => {
        simulateVoiceCommand();
      }, 2000);

    } catch (error) {
      Alert.alert('Voice Recognition Error', 'Unable to start voice recognition');
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      setIsListening(false);
      if (recognitionTimeout.current) {
        clearTimeout(recognitionTimeout.current);
      }
      await globalGestureSupport.stopVoiceRecognition();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const simulateVoiceCommand = () => {
    // Simulate random voice commands for demo purposes
    const mockCommands = [
      'go back',
      'go home',
      'open settings',
      'show menu',
      'close',
      'next',
      'previous',
      'select',
      'edit',
      'save',
      'search',
      'help'
    ];

    const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
    const mockConfidence = 0.8 + Math.random() * 0.2; // 0.8-1.0

    globalGestureSupport.processVoiceCommand(randomCommand, mockConfidence);
    setIsListening(false);
  };

  const provideVoiceFeedback = (command: VoiceCommand) => {
    let feedback = '';

    switch (command.action) {
      case 'navigate_back':
        feedback = 'Going back';
        break;
      case 'navigate_home':
        feedback = 'Going home';
        break;
      case 'open_settings':
        feedback = 'Opening settings';
        break;
      case 'show_menu':
        feedback = 'Showing menu';
        break;
      case 'close_modal':
        feedback = 'Closing';
        break;
      case 'next_item':
        feedback = 'Next item';
        break;
      case 'previous_item':
        feedback = 'Previous item';
        break;
      case 'select_item':
        feedback = 'Item selected';
        break;
      case 'edit_mode':
        feedback = 'Edit mode activated';
        break;
      case 'save_changes':
        feedback = 'Changes saved';
        break;
      case 'open_search':
        feedback = 'Opening search';
        break;
      case 'show_help':
        feedback = 'Showing help';
        break;
      default:
        feedback = 'Command recognized';
    }

    // In a real implementation, this would use Text-to-Speech
    console.log(`Voice Feedback: ${feedback}`);
  };

  const clearHistory = () => {
    setCommandHistory([]);
    setLastCommand(null);
  };

  const renderCommandItem = ({ item }: { item: VoiceCommandItem }) => (
    <View style={styles.commandItem}>
      <Text style={styles.commandText}>{item.command}</Text>
      <Text style={styles.commandDescription}>{item.description}</Text>
      <Text style={styles.commandExample}>{item.example}</Text>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: VoiceCommand }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyCommand}>"{item.command}"</Text>
      <Text style={styles.historyAction}>{item.action.replace('_', ' ')}</Text>
      <Text style={styles.historyConfidence}>
        {Math.round(item.confidence * 100)}% confidence
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Voice Navigation</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.voiceSection}>
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.listeningButton]}
            onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
          >
            <Text style={[styles.voiceButtonText, isListening && styles.listeningText]}>
              {isListening ? '🎤 Listening...' : '🎤 Start Voice Command'}
            </Text>
          </TouchableOpacity>

          {lastCommand && (
            <View style={styles.lastCommand}>
              <Text style={styles.lastCommandLabel}>Last Command:</Text>
              <Text style={styles.lastCommandText}>"{lastCommand.command}"</Text>
              <Text style={styles.lastCommandAction}>
                Action: {lastCommand.action.replace('_', ' ')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Commands</Text>
            </View>
            <FlatList
              data={availableCommands}
              renderItem={renderCommandItem}
              keyExtractor={(item) => item.command}
              showsVerticalScrollIndicator={false}
              style={styles.commandList}
            />
          </View>

          {commandHistory.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Command History</Text>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.clearButton}>Clear</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={commandHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.timestamp.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.historyList}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  voiceSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  voiceButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  listeningButton: {
    backgroundColor: '#dc3545',
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listeningText: {
    color: '#fff',
  },
  lastCommand: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    width: '100%',
  },
  lastCommandLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  lastCommandText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  lastCommandAction: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  section: {
    flex: 1,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 14,
    color: '#dc3545',
  },
  commandList: {
    flex: 1,
  },
  commandItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commandText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commandDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  commandExample: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 5,
  },
  historyCommand: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyAction: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyConfidence: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
});

export default MobileVoiceNavigation;