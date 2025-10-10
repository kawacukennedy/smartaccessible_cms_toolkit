import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { mobileAIService } from '../lib/mobileAIService';

interface SEOPanelProps {
  title: string;
  description: string;
  keywords: string[];
  content?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onKeywordsChange: (keywords: string[]) => void;
}

const SEOPanel: React.FC<SEOPanelProps> = React.memo(({
  title,
  description,
  keywords,
  content = '',
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
}) => {
  const { theme } = useTheme();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputStyle = theme === 'dark' ? darkStyles.input : lightStyles.input;
  const labelStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };
  const cardStyle = theme === 'dark' ? darkStyles.card : lightStyles.card;

  const seoScore = useMemo(() => {
    let score = 0;
    const issues: string[] = [];

    // Title checks
    if (title.length > 0) {
      score += 20;
      if (title.length >= 30 && title.length <= 60) score += 15;
      else issues.push('Title should be 30-60 characters');
    } else {
      issues.push('Title is required');
    }

    // Description checks
    if (description.length > 0) {
      score += 20;
      if (description.length >= 120 && description.length <= 160) score += 15;
      else if (description.length < 120) issues.push('Description should be at least 120 characters');
      else if (description.length > 160) issues.push('Description should be no more than 160 characters');
    } else {
      issues.push('Description is required');
    }

    // Keywords checks
    if (keywords.length > 0) {
      score += 20;
      if (keywords.length >= 3 && keywords.length <= 7) score += 15;
      else issues.push('Use 3-7 relevant keywords');
    } else {
      issues.push('Keywords are required');
    }

    // Content-based checks
    if (content) {
      const wordCount = content.split(/\s+/).length;
      if (wordCount >= 300) score += 10;
      else issues.push('Content should be at least 300 words for better SEO');

      // Check if keywords appear in content
      const contentLower = content.toLowerCase();
      const missingKeywords = keywords.filter(keyword =>
        !contentLower.includes(keyword.toLowerCase())
      );
      if (missingKeywords.length > 0) {
        issues.push(`Include these keywords in content: ${missingKeywords.join(', ')}`);
      }
    }

    return { score: Math.min(100, score), suggestions: issues };
  }, [title, description, keywords, content]);

  useEffect(() => {
    setSeoScore(seoScore.score);
    setSuggestions(seoScore.suggestions);
  }, [seoScore]);



  const handleOptimizeSEO = async () => {
    if (!content.trim()) {
      Alert.alert('No Content', 'Please add content before optimizing SEO.');
      return;
    }

    setIsOptimizing(true);
    try {
      const seoSuggestions = await mobileAIService.optimizeSEO(content, keywords);
      const aiSuggestions = seoSuggestions.map(s => s.message);

      Alert.alert(
        'SEO Optimization Complete',
        `Found ${aiSuggestions.length} optimization suggestions.`,
        [
          { text: 'View Suggestions', onPress: () => setSuggestions(aiSuggestions) },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Optimization Failed', 'Unable to optimize SEO. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      onKeywordsChange([...keywords, keyword.trim()]);
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onKeywordsChange(newKeywords);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, labelStyle]}>SEO Optimization</Text>
        <View style={[styles.scoreCard, { borderLeftColor: getScoreColor(seoScore) }]}>
          <Text style={[styles.scoreValue, { color: getScoreColor(seoScore) }]}>
            {seoScore}
          </Text>
          <Text style={[styles.scoreLabel, labelStyle]}>{getScoreLabel(seoScore)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.optimizeButton, isOptimizing && styles.disabledButton]}
        onPress={handleOptimizeSEO}
        disabled={isOptimizing}
      >
        <Text style={styles.optimizeButtonText}>
          {isOptimizing ? '🔍 Analyzing...' : '🚀 Optimize SEO'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.inputGroup, cardStyle]}>
          <Text style={[styles.label, labelStyle]}>SEO Title ({title.length}/60)</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            value={title}
            onChangeText={onTitleChange}
            placeholder="Enter SEO title..."
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
            maxLength={60}
          />
        </View>

        <View style={[styles.inputGroup, cardStyle]}>
          <Text style={[styles.label, labelStyle]}>Meta Description ({description.length}/160)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput, inputStyle]}
            value={description}
            onChangeText={onDescriptionChange}
            multiline
            numberOfLines={3}
            placeholder="Enter meta description..."
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
            maxLength={160}
          />
        </View>

        <View style={[styles.inputGroup, cardStyle]}>
          <Text style={[styles.label, labelStyle]}>Keywords ({keywords.length})</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder="Add keyword and press enter..."
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
            onSubmitEditing={(e) => {
              addKeyword(e.nativeEvent.text);
              e.currentTarget.clear();
            }}
          />

          {keywords.length > 0 && (
            <View style={styles.keywordsContainer}>
              {keywords.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.keywordChip, theme === 'dark' ? darkStyles.keywordChip : lightStyles.keywordChip]}
                  onPress={() => removeKeyword(index)}
                >
                  <Text style={[styles.keywordText, labelStyle]}>{keyword} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={[styles.suggestionsCard, cardStyle]}>
            <Text style={[styles.suggestionsTitle, labelStyle]}>SEO Suggestions</Text>
            {suggestions.map((suggestion, index) => (
              <Text key={index} style={[styles.suggestionText, labelStyle]}>
                • {suggestion}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  optimizeButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  optimizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  keywordChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsCard: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    borderColor: '#dee2e6',
    color: '#000',
    backgroundColor: '#fff',
  },
  keywordChip: {
    backgroundColor: '#e9ecef',
    borderColor: '#dee2e6',
  },
});

const darkStyles = StyleSheet.create({
  card: {
    backgroundColor: '#343a40',
    borderWidth: 1,
    borderColor: '#495057',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    borderColor: '#495057',
    color: '#fff',
    backgroundColor: '#212529',
  },
  keywordChip: {
    backgroundColor: '#495057',
    borderColor: '#6c757d',
  },
});

export default SEOPanel;
