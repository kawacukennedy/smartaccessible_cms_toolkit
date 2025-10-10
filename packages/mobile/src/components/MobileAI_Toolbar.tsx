import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { mobileAIService, AIContentAnalysis } from '../lib/mobileAIService';

interface MobileAI_ToolbarProps {
  content: string;
  onGenerateSuggestions: () => void;
  onApplyAISuggestion?: (suggestion: any) => void;
  onContentAnalysis?: (analysis: AIContentAnalysis) => void;
  onImproveWriting?: (improvedContent: string) => void;
  onGenerateTitle?: (title: string) => void;
}

const MobileAI_Toolbar: React.FC<MobileAI_ToolbarProps> = ({
  content,
  onGenerateSuggestions,
  onApplyAISuggestion,
  onContentAnalysis,
  onImproveWriting,
  onGenerateTitle,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      Alert.alert('No Content', 'Please add some content before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await mobileAIService.analyzeContent(content);
      onContentAnalysis?.(analysis);

      Alert.alert(
        'Content Analysis Complete',
        `Readability: ${analysis.readability.score}%\nSEO Score: ${analysis.seo.score}%\nSentiment: ${analysis.sentiment.label}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImproveWriting = async () => {
    if (!content.trim()) {
      Alert.alert('No Content', 'Please add some content before improving.');
      return;
    }

    const styles = ['professional', 'casual', 'creative'] as const;
    Alert.alert(
      'Choose Writing Style',
      'Select the style for improvement:',
      styles.map(style => ({
        text: style.charAt(0).toUpperCase() + style.slice(1),
        onPress: async () => {
          setIsImproving(true);
          try {
            const improvedContent = await mobileAIService.improveWriting(content, style);
            onImproveWriting?.(improvedContent);
            Alert.alert('Writing Improved', 'Your content has been enhanced!');
          } catch (error) {
            Alert.alert('Improvement Failed', 'Unable to improve writing. Please try again.');
          } finally {
            setIsImproving(false);
          }
        }
      }))
    );
  };

  const handleGenerateTitle = async () => {
    if (!content.trim()) {
      Alert.alert('No Content', 'Please add some content before generating a title.');
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const title = await mobileAIService.generateTitle(content);
      onGenerateTitle?.(title);
      Alert.alert('Title Generated', `Suggested title: "${title}"`);
    } catch (error) {
      Alert.alert('Title Generation Failed', 'Unable to generate title. Please try again.');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleQuickActions = () => {
    Alert.alert(
      'AI Quick Actions',
      'Choose an action:',
      [
        { text: 'Check Grammar', onPress: () => onGenerateSuggestions() },
        { text: 'SEO Optimization', onPress: () => onGenerateSuggestions() },
        { text: 'Accessibility Check', onPress: () => onGenerateSuggestions() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.toolbarContainer}>
      <TouchableOpacity
        onPress={onGenerateSuggestions}
        style={styles.toolbarButton}
        disabled={!content.trim()}
      >
        <Text style={[styles.buttonText, !content.trim() && styles.disabledText]}>
          💡 Suggestions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAnalyzeContent}
        style={styles.toolbarButton}
        disabled={isAnalyzing || !content.trim()}
      >
        {isAnalyzing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, !content.trim() && styles.disabledText]}>
            📊 Analyze
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleImproveWriting}
        style={styles.toolbarButton}
        disabled={isImproving || !content.trim()}
      >
        {isImproving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, !content.trim() && styles.disabledText]}>
            ✍️ Improve
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGenerateTitle}
        style={styles.toolbarButton}
        disabled={isGeneratingTitle || !content.trim()}
      >
        {isGeneratingTitle ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, !content.trim() && styles.disabledText]}>
            🏷️ Title
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleQuickActions}
        style={styles.quickActionsButton}
      >
        <Text style={styles.quickActionsText}>⚡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  toolbarButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: '#adb5bd',
  },
  quickActionsButton: {
    padding: 8,
    backgroundColor: '#28a745',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MobileAI_Toolbar;
