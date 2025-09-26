import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
// import { useAISuggestions } from '@/contexts/AISuggestionContext'; // Temporarily removed

interface AISuggestion {
  id: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
}

const dummySuggestions: AISuggestion[] = [
  { id: '1', message: 'Improve sentence structure for clarity.', confidence: 'high' },
  { id: '2', message: 'Add a call-to-action at the end of the block.', confidence: 'medium' },
  { id: '3', message: 'Check for passive voice in paragraph 2.', confidence: 'low' },
];

interface MobileAISuggestionsPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: (suggestion: AISuggestion) => void;
  onApplyAllSuggestions: (suggestions: AISuggestion[]) => void;
  onRevertAllSuggestions: () => void;
}

const MobileAISuggestionsPanel: React.FC<MobileAISuggestionsPanelProps> = ({
  onApplySuggestion,
  onDismissSuggestion,
  onApplyAllSuggestions,
  onRevertAllSuggestions,
}) => {
  // const { suggestions } = useAISuggestions(); // Temporarily removed
  const suggestions = dummySuggestions; // Using dummy data for now

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return '#28a745'; // Green
      case 'medium': return '#ffc107'; // Yellow
      case 'low': return '#dc3545'; // Red
      default: return '#6c757d'; // Gray
    }
  };

  const AnimatedSuggestionItem: React.FC<{ suggestion: AISuggestion; children: React.ReactNode }> = ({
    suggestion,
    children,
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const highlightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(highlightAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
          Animated.timing(highlightAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]),
      ]).start();
    }, [fadeAnim, highlightAnim]);

    const backgroundColor = highlightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', getConfidenceColor(suggestion.confidence) + '30'], // Add some transparency
    });

    return (
      <Animated.View style={{ opacity: fadeAnim, backgroundColor, ...styles.suggestionItem }}>
        {children}
      </Animated.View>
    );
  };

  return (
    <View style={styles.panelContainer}>
      <Text style={styles.panelTitle}>AI Suggestions</Text>
      <View style={styles.bulkActions}>
        <TouchableOpacity
          onPress={() => onApplyAllSuggestions(suggestions)}
          style={[styles.actionButton, styles.applyAllButton]}
        >
          <Text style={styles.actionButtonText}>Apply All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRevertAllSuggestions}
          style={[styles.actionButton, styles.revertAllButton]}
        >
          <Text style={styles.actionButtonText}>Revert All</Text>
        </TouchableOpacity>
      </View>
      {suggestions.length === 0 ? (
        <Text style={styles.noSuggestionsText}>No AI suggestions available.</Text>
      ) : (
        <ScrollView style={styles.suggestionsList}>
          {suggestions.map((suggestion) => (
            <AnimatedSuggestionItem key={suggestion.id} suggestion={suggestion}>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionText}>{suggestion.message}</Text>
                <Text style={[styles.confidenceText, { color: getConfidenceColor(suggestion.confidence) }]}>
                  Confidence: {suggestion.confidence.toUpperCase()}
                </Text>
              </View>
              <View style={styles.suggestionActions}>
                <TouchableOpacity onPress={() => onApplySuggestion(suggestion)} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDismissSuggestion(suggestion)} style={[styles.actionButton, styles.dismissButton]}>
                  <Text style={styles.actionButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </AnimatedSuggestionItem>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noSuggestionsText: {
    color: '#666',
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  applyAllButton: {
    backgroundColor: '#007bff',
  },
  revertAllButton: {
    backgroundColor: '#6c757d',
  },
  suggestionContent: {
    flex: 1,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  confidenceText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  suggestionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  dismissButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default MobileAISuggestionsPanel;
