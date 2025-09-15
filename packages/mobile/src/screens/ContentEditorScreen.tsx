import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TextEditor from './../components/content-editor/TextEditor';
import MediaUploader from './../components/content-editor/MediaUploader';
import AI_Toolbar from './../components/content-editor/AI_Toolbar';
import SEOPanel from './../components/content-editor/SEOPanel';
import { useAISuggestions } from '../contexts/AISuggestionContext';
import { generateMockAISuggestions } from '../../src/lib/ai-suggestions';
import AISuggestionsPanel from './../components/content-editor/AISuggestionsPanel';

const ContentEditorScreen: React.FC = () => {
  const [content, setContent] = useState('');
  const { addSuggestion } = useAISuggestions();

  const handleGenerateSuggestions = () => {
    const suggestions = generateMockAISuggestions(content);
    suggestions.forEach(addSuggestion);
  };

  return (
    <ScrollView style={styles.container}>
      <TextEditor value={content} onChangeText={setContent} />
      <MediaUploader />
      <AI_Toolbar onGenerateSuggestions={handleGenerateSuggestions} />
      <SEOPanel />
      <AISuggestionsPanel />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ContentEditorScreen;
