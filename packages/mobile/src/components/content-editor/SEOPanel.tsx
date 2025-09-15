import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

const SEOPanel: React.FC = () => {
  const { theme } = useTheme();

  const inputStyle = theme === 'dark' ? darkStyles.input : lightStyles.input;
  const labelStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, labelStyle]}>SEO Metadata</Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, labelStyle]}>Title</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="SEO Title"
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, labelStyle]}>Description</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          multiline
          numberOfLines={3}
          placeholder="SEO Description"
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, labelStyle]}>Keywords</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Comma-separated keywords"
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
        />
      </View>
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
  inputGroup: {
    marginBottom: 10,
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

export default SEOPanel;
