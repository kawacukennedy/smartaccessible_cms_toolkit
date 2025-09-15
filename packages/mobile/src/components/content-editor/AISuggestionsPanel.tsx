import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAISuggestions } from '../../src/contexts/AISuggestionContext';
import { AISuggestion } from '../../src/types/ai-suggestion';
import { useTheme } from '../../src/contexts/ThemeContext';

const AISuggestionsPanel: React.FC = () => {
  const { suggestions, applySuggestion, rejectSuggestion } = useAISuggestions();
  const { theme } = useTheme();

  const cardStyle = theme === 'dark' ? darkStyles.card : lightStyles.card;
  const textStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, textStyle]}>AI Suggestions</Text>
      {suggestions.length === 0 ? (
        <Text style={textStyle}>No AI suggestions available.</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {suggestions.map((suggestion: AISuggestion) => (
            <View key={suggestion.id} style={[styles.card, cardStyle]}>
              <Text style={[styles.cardText, textStyle]}>
                <Text style={styles.cardTextBold}>{suggestion.type}:</Text> {suggestion.message} (Confidence: {suggestion.confidence}%)
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.applyButton]}
                  onPress={() => applySuggestion(suggestion.id)}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => rejectSuggestion(suggestion.id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 200, // Limit height for scrollability
  },
  card: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  cardTextBold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  applyButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    borderColor: '#ccc',
  },
});

const darkStyles = StyleSheet.create({
  card: {
    backgroundColor: '#343a40',
    borderColor: '#555',
  },
});

export default AISuggestionsPanel;
