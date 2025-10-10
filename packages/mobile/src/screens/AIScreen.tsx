import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { mobileAIService, AIContentAnalysis } from '../lib/mobileAIService';

const AIScreen = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [analysis, setAnalysis] = useState<AIContentAnalysis | null>(null);
  const [improvedText, setImprovedText] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      Alert.alert('No Content', 'Please enter some text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await mobileAIService.analyzeContent(inputText);
      setAnalysis(result);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async (style: 'professional' | 'casual' | 'creative') => {
    if (!inputText.trim()) {
      Alert.alert('No Content', 'Please enter some text to improve.');
      return;
    }

    setIsImproving(true);
    try {
      const improved = await mobileAIService.improveWriting(inputText, style);
      setImprovedText(improved);
      Alert.alert('Writing Improved', `Your content has been enhanced in ${style} style!`);
    } catch (error) {
      Alert.alert('Improvement Failed', 'Unable to improve writing. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleGenerateTitle = async () => {
    if (!inputText.trim()) {
      Alert.alert('No Content', 'Please enter some text to generate a title for.');
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const title = await mobileAIService.generateTitle(inputText);
      setGeneratedTitle(title);
      Alert.alert('Title Generated', `Suggested title: "${title}"`);
    } catch (error) {
      Alert.alert('Title Generation Failed', 'Unable to generate title. Please try again.');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!analysis) return null;

    return (
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Content Analysis</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Readability:</Text>
          <Text style={[styles.metricValue, { color: getScoreColor(analysis.readability.score) }]}>
            {analysis.readability.score}% ({analysis.readability.level})
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>SEO Score:</Text>
          <Text style={[styles.metricValue, { color: getScoreColor(analysis.seo.score) }]}>
            {analysis.seo.score}%
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Accessibility:</Text>
          <Text style={[styles.metricValue, { color: getScoreColor(analysis.accessibility.score) }]}>
            {analysis.accessibility.score}%
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sentiment:</Text>
          <Text style={[styles.metricValue, { color: getSentimentColor(analysis.sentiment.score) }]}>
            {analysis.sentiment.label} ({Math.round(analysis.sentiment.score * 100)}%)
          </Text>
        </View>

        {analysis.seo.keywords.length > 0 && (
          <View style={styles.keywordsContainer}>
            <Text style={styles.keywordsTitle}>Top Keywords:</Text>
            <Text style={styles.keywordsText}>
              {analysis.seo.keywords.join(', ')}
            </Text>
          </View>
        )}

        {analysis.readability.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Readability Suggestions:</Text>
            {analysis.readability.suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return '#28a745';
    if (score < -0.1) return '#dc3545';
    return '#ffc107';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Writing Assistant</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter your content:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type or paste your content here..."
          value={inputText}
          onChangeText={setInputText}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.analyzeButton]}
          onPress={handleAnalyze}
          disabled={isAnalyzing || !inputText.trim()}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>📊 Analyze Content</Text>
          )}
        </TouchableOpacity>

        <View style={styles.improveButtons}>
          <TouchableOpacity
            style={[styles.improveButton, { backgroundColor: '#007bff' }]}
            onPress={() => handleImprove('professional')}
            disabled={isImproving || !inputText.trim()}
          >
            <Text style={styles.improveButtonText}>Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.improveButton, { backgroundColor: '#28a745' }]}
            onPress={() => handleImprove('casual')}
            disabled={isImproving || !inputText.trim()}
          >
            <Text style={styles.improveButtonText}>Casual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.improveButton, { backgroundColor: '#6f42c1' }]}
            onPress={() => handleImprove('creative')}
            disabled={isImproving || !inputText.trim()}
          >
            <Text style={styles.improveButtonText}>Creative</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.titleButton]}
          onPress={handleGenerateTitle}
          disabled={isGeneratingTitle || !inputText.trim()}
        >
          {isGeneratingTitle ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>🏷️ Generate Title</Text>
          )}
        </TouchableOpacity>
      </View>

      {generatedTitle && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Title:</Text>
          <Text style={styles.generatedTitle}>{generatedTitle}</Text>
        </View>
      )}

      {improvedText && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Improved Content:</Text>
          <Text style={styles.improvedText}>{improvedText}</Text>
        </View>
      )}

      {renderAnalysisResults()}

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>AI Features Available:</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>• Content analysis and scoring</Text>
          <Text style={styles.featureItem}>• Writing style improvement</Text>
          <Text style={styles.featureItem}>• SEO optimization suggestions</Text>
          <Text style={styles.featureItem}>• Grammar and style checking</Text>
          <Text style={styles.featureItem}>• Accessibility enhancement</Text>
          <Text style={styles.featureItem}>• Title generation</Text>
          <Text style={styles.featureItem}>• Sentiment analysis</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    color: '#333',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#17a2b8',
  },
  titleButton: {
    backgroundColor: '#fd7e14',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  improveButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  improveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  improveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  generatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  improvedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  analysisContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  keywordsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  keywordsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  featuresList: {
    paddingLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default AIScreen;