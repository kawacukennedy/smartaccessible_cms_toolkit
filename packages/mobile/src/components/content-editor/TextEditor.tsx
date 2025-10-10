import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { mobileAIService } from '../lib/mobileAIService';

interface TextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showToolbar?: boolean;
  onWordCountChange?: (count: number) => void;
}

const TextEditor: React.FC<TextEditorProps> = React.memo(({
  value,
  onChangeText,
  placeholder = "Enter your content here...",
  autoFocus = false,
  showToolbar = true,
  onWordCountChange,
}) => {
  const { theme } = useTheme();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const textInputRef = useRef<TextInput>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const inputStyle = theme === 'dark' ? darkStyles.input : lightStyles.input;
  const labelStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };
  const toolbarStyle = theme === 'dark' ? darkStyles.toolbar : lightStyles.toolbar;

  const wordCount = useMemo(() => value.trim() ? value.trim().split(/\s+/).length : 0, [value]);

  React.useEffect(() => {
    onWordCountChange?.(wordCount);
  }, [wordCount, onWordCountChange]);

  const debouncedOnChangeText = useCallback((text: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      onChangeText(text);
    }, 300);
  }, [onChangeText]);

  const handleAnalyze = async () => {
    if (!value.trim()) {
      Alert.alert('No Content', 'Please enter some text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await mobileAIService.analyzeContent(value);
      setAnalysis(result);
      Alert.alert(
        'Content Analysis',
        `Words: ${result.wordCount}\nReading Time: ${result.readingTime} min\nReadability: ${result.readabilityScore.toFixed(1)}%\nSentiment: ${result.sentiment}`
      );
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async (style: 'professional' | 'casual' | 'creative') => {
    if (!value.trim()) {
      Alert.alert('No Content', 'Please enter some text to improve.');
      return;
    }

    setIsImproving(true);
    try {
      const improved = await mobileAIService.improveWriting(value, style);
      onChangeText(improved);
      Alert.alert('Content Improved', `Your content has been enhanced in ${style} style!`);
    } catch (error) {
      Alert.alert('Improvement Failed', 'Unable to improve writing. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const insertText = (text: string) => {
    const currentValue = value;
    const selection = textInputRef.current?.selection || { start: currentValue.length, end: currentValue.length };
    const newValue = currentValue.slice(0, selection.start) + text + currentValue.slice(selection.end);
    onChangeText(newValue);
  };

  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <View style={[styles.toolbar, toolbarStyle]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbarScroll}>
          <TouchableOpacity
            style={[styles.toolbarButton, isAnalyzing && styles.disabledButton]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Text style={styles.toolbarButtonText}>
              {isAnalyzing ? '🔍...' : '🔍 Analyze'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#007bff' }, isImproving && styles.disabledButton]}
            onPress={() => handleImprove('professional')}
            disabled={isImproving}
          >
            <Text style={styles.toolbarButtonText}>💼 Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#28a745' }, isImproving && styles.disabledButton]}
            onPress={() => handleImprove('casual')}
            disabled={isImproving}
          >
            <Text style={styles.toolbarButtonText}>😊 Casual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#6f42c1' }, isImproving && styles.disabledButton]}
            onPress={() => handleImprove('creative')}
            disabled={isImproving}
          >
            <Text style={styles.toolbarButtonText}>🎨 Creative</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#fd7e14' }]}
            onPress={() => insertText('**bold text**')}
          >
            <Text style={styles.toolbarButtonText}>B</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#fd7e14' }]}
            onPress={() => insertText('*italic text*')}
          >
            <Text style={styles.toolbarButtonText}>I</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: '#fd7e14' }]}
            onPress={() => insertText('\n- List item')}
          >
            <Text style={styles.toolbarButtonText}>📝</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, labelStyle]}>Content Editor</Text>
        <Text style={[styles.wordCount, labelStyle]}>{wordCount} words</Text>
      </View>

      {renderToolbar()}

      <TextInput
        ref={textInputRef}
        style={[styles.input, inputStyle]}
        multiline
        value={value}
        onChangeText={debouncedOnChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
        autoFocus={autoFocus}
        textAlignVertical="top"
        selectionColor={theme === 'dark' ? '#fff' : '#007bff'}
      />

      {analysis && (
        <View style={[styles.analysisSummary, theme === 'dark' ? darkStyles.analysisSummary : lightStyles.analysisSummary]}>
          <Text style={[styles.analysisText, labelStyle]}>
            📊 {analysis.readingTime}min read • {analysis.sentiment} tone
          </Text>
          {analysis.suggestions.length > 0 && (
            <Text style={[styles.suggestionsText, labelStyle]}>
              💡 {analysis.suggestions[0]}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  wordCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  toolbar: {
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
  },
  toolbarScroll: {
    flexGrow: 0,
  },
  toolbarButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  toolbarButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    maxHeight: 300,
  },
  analysisSummary: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
  },
  analysisText: {
    fontSize: 12,
    marginBottom: 4,
  },
  suggestionsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

const lightStyles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  input: {
    borderColor: '#dee2e6',
    color: '#000',
    backgroundColor: '#fff',
  },
  analysisSummary: {
    backgroundColor: '#e9ecef',
    borderColor: '#dee2e6',
    borderWidth: 1,
  },
});

const darkStyles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#343a40',
    borderWidth: 1,
    borderColor: '#495057',
  },
  input: {
    borderColor: '#495057',
    color: '#fff',
    backgroundColor: '#212529',
  },
  analysisSummary: {
    backgroundColor: '#495057',
    borderColor: '#6c757d',
    borderWidth: 1,
  },
});

export default TextEditor;
