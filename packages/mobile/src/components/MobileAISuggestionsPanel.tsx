import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { mobileAIService, AISuggestion } from '../lib/mobileAIService';

interface MobileAISuggestionsPanelProps {
  content: string;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: (suggestion: AISuggestion) => void;
  onApplyAllSuggestions: (suggestions: AISuggestion[]) => void;
  onRevertAllSuggestions: () => void;
}

const MobileAISuggestionsPanel: React.FC<MobileAISuggestionsPanelProps> = ({
  content,
  onApplySuggestion,
  onDismissSuggestion,
  onApplyAllSuggestions,
  onRevertAllSuggestions,
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (content.trim()) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [content]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const allSuggestions = await mobileAIService.generateSuggestions(content);
      setSuggestions(allSuggestions);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredSuggestions = () => {
    if (activeCategory === 'all') return suggestions;
    return suggestions.filter(s => s.category === activeCategory);
  };

  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = { all: suggestions.length };
    suggestions.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.id));
    onApplySuggestion(suggestion);
  };

  const handleDismissSuggestion = (suggestion: AISuggestion) => {
    onDismissSuggestion(suggestion);
  };

  const handleApplyAllFiltered = () => {
    const filtered = getFilteredSuggestions();
    setAppliedSuggestions(prev => {
      const newSet = new Set(prev);
      filtered.forEach(s => newSet.add(s.id));
      return newSet;
    });
    onApplyAllSuggestions(filtered);
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return '#28a745'; // Green
      case 'medium': return '#ffc107'; // Yellow
      case 'low': return '#dc3545'; // Red
      default: return '#6c757d'; // Gray
    }
  };

  const AnimatedSuggestionItem: React.FC<{ suggestion: AISuggestion; children: React.ReactNode }> = ({
    suggestion,
    children,
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const highlightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(highlightAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
          Animated.timing(highlightAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]),
      ]).start();
    }, [fadeAnim, highlightAnim]);

    const backgroundColor = highlightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', getConfidenceColor(suggestion.confidence) + '30'], // Add some transparency
    });

    return (
      <Animated.View style={{ opacity: fadeAnim, backgroundColor, ...styles.suggestionItem }}>
        {children}
      </Animated.View>
    );
  };

  const filteredSuggestions = getFilteredSuggestions();
  const categoryCounts = getCategoryCounts();

  return (
    <View style={styles.panelContainer}>
      <View style={styles.header}>
        <Text style={styles.panelTitle}>AI Writing Assistant</Text>
        {isLoading && <ActivityIndicator size="small" color="#007bff" />}
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bulk Actions */}
      <View style={styles.bulkActions}>
        <TouchableOpacity
          onPress={handleApplyAllFiltered}
          style={[styles.actionButton, styles.applyAllButton]}
          disabled={filteredSuggestions.length === 0}
        >
          <Text style={styles.actionButtonText}>Apply All ({filteredSuggestions.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRevertAllSuggestions}
          style={[styles.actionButton, styles.revertAllButton]}
          disabled={appliedSuggestions.size === 0}
        >
          <Text style={styles.actionButtonText}>Revert All ({appliedSuggestions.size})</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Analyzing your content...</Text>
        </View>
      ) : filteredSuggestions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noSuggestionsText}>
            {content.trim() ? 'No suggestions for this category.' : 'Add some content to get AI suggestions.'}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.suggestionsList}>
          {filteredSuggestions.map((suggestion) => (
            <AnimatedSuggestionItem key={suggestion.id} suggestion={suggestion}>
              <View style={styles.suggestionHeader}>
                <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(suggestion.confidence) }]}>
                  <Text style={styles.confidenceBadgeText}>
                    {suggestion.confidence.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.categoryLabel}>{suggestion.category}</Text>
              </View>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionText}>{suggestion.message}</Text>
                {suggestion.replacement && (
                  <Text style={styles.suggestionReplacement}>
                    Suggestion: "{suggestion.replacement}"
                  </Text>
                )}
              </View>
              <View style={styles.suggestionActions}>
                <TouchableOpacity
                  onPress={() => handleApplySuggestion(suggestion)}
                  style={[styles.actionButton, appliedSuggestions.has(suggestion.id) && styles.appliedButton]}
                  disabled={appliedSuggestions.has(suggestion.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {appliedSuggestions.has(suggestion.id) ? 'Applied' : 'Apply'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDismissSuggestion(suggestion)}
                  style={[styles.actionButton, styles.dismissButton]}
                >
                  <Text style={styles.actionButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </AnimatedSuggestionItem>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryFilter: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  categoryButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  applyAllButton: {
    backgroundColor: '#28a745',
  },
  revertAllButton: {
    backgroundColor: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  suggestionsList: {
    flex: 1,
    padding: 15,
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  suggestionContent: {
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  suggestionReplacement: {
    fontSize: 13,
    color: '#007bff',
    fontStyle: 'italic',
    marginTop: 6,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  appliedButton: {
    backgroundColor: '#6c757d',
  },
  dismissButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MobileAISuggestionsPanel;
