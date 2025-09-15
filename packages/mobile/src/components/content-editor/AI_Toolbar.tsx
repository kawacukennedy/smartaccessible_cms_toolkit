import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

interface AI_ToolbarProps {
  onGenerateSuggestions: () => void;
}

const AI_Toolbar: React.FC<AI_ToolbarProps> = ({ onGenerateSuggestions }) => {
  const { theme } = useTheme();

  const buttonStyle = theme === 'dark' ? darkStyles.button : lightStyles.button;
  const buttonTextStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  return (
    <View style={styles.container}>
      <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>AI Actions</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onGenerateSuggestions}>
          <Text style={[styles.buttonText, buttonTextStyle]}>Generate Suggestions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={() => alert('Simulating accessibility check...')}>
          <Text style={[styles.buttonText, buttonTextStyle]}>Check Accessibility</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});

const lightStyles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
});

const darkStyles = StyleSheet.create({
  button: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
});

export default AI_Toolbar;
