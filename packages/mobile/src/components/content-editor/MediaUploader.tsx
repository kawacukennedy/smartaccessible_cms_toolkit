import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

const MediaUploader: React.FC = () => {
  const { theme } = useTheme();

  const buttonStyle = theme === 'dark' ? darkStyles.button : lightStyles.button;
  const buttonTextStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  const handleUpload = () => {
    alert('Simulating media upload...');
  };

  return (
    <View style={styles.container}>
      <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>Media Uploader</Text>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={handleUpload}>
        <Text style={[styles.buttonText, buttonTextStyle]}>Upload Media</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginTop: 5,
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

export default MediaUploader;
