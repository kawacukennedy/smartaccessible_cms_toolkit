import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

interface TextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChangeText }) => {
  const { theme } = useTheme();

  const inputStyle = theme === 'dark' ? darkStyles.input : lightStyles.input;
  const labelStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>Content</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        multiline
        numberOfLines={10}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your content here..."
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

const lightStyles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    color: '#000',
    backgroundColor: '#fff',
  },
});

const darkStyles = StyleSheet.create({
  input: {
    borderColor: '#555',
    color: '#fff',
    backgroundColor: '#333',
  },
});

export default TextEditor;
