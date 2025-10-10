import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  mobileSearch,
  SearchQuery,
  SearchResult,
  SearchAnalytics
} from '../lib/mobileSearch';

interface AdvancedSearchProps {
  isVisible: boolean;
  onClose: () => void;
  onResultSelect?: (result: SearchResult) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isVisible, onClose, onResultSelect }) => {
  const { themeStyles } = useTheme();
  const [query, setQuery] = useState<SearchQuery>({
    text: '',
    options: {
      fuzzy: false,
      semantic: false,
      caseSensitive: false,
      wholeWords: false,
    }
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible) {
      loadSearchData();
    }
  }, [isVisible]);

  const loadSearchData = async () => {
    try {
      const searchAnalytics = mobileSearch.getSearchAnalytics();
      setAnalytics(searchAnalytics);

      // Load search history (mock data for now)
      setSearchHistory(['content editor', 'mobile app', 'collaboration', 'sync']);
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  };

  const performSearch = async () => {
    if (!query.text.trim()) {
      Alert.alert('Search Query Required', 'Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await mobileSearch.search(query);
      setResults(searchResults);

      // Update search history
      if (!searchHistory.includes(query.text)) {
        setSearchHistory(prev => [query.text, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Search Failed', 'An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    onResultSelect?.(result);
    onClose();
  };

  const clearSearch = () => {
    setQuery({ ...query, text: '' });
    setResults([]);
  };

  const toggleFilter = (filterKey: keyof SearchQuery['options']) => {
    setQuery({
      ...query,
      options: {
        ...query.options,
        [filterKey]: !query.options?.[filterKey]
      }
    });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultItem, themeStyles.card]}
      onPress={() => handleResultPress(item)}
      accessibilityLabel={`Search result: ${item.title}`}
      accessibilityHint="Tap to select this search result"
    >
      <View style={styles.resultHeader}>
        <Text style={[styles.resultType, themeStyles.text]}>
          {item.type.toUpperCase()}
        </Text>
        <Text style={[styles.resultScore, themeStyles.textSecondary]}>
          {Math.round(item.relevanceScore)}%
        </Text>
      </View>

      <Text style={[styles.resultTitle, themeStyles.text]} numberOfLines={1}>
        {item.title}
      </Text>

      <Text style={[styles.resultExcerpt, themeStyles.textSecondary]} numberOfLines={2}>
        {item.excerpt}
      </Text>

      <View style={styles.resultMeta}>
        {item.metadata.author && (
          <Text style={[styles.resultMetaText, themeStyles.textSecondary]}>
            Author: {item.metadata.author}
          </Text>
        )}
        <Text style={[styles.resultMetaText, themeStyles.textSecondary]}>
          {item.metadata.modifiedAt.toLocaleDateString()}
        </Text>
        {item.metadata.size && (
          <Text style={[styles.resultMetaText, themeStyles.textSecondary]}>
            {(item.metadata.size / 1024).toFixed(1)} KB
          </Text>
        )}
      </View>

      {item.highlights.length > 0 && (
        <View style={styles.resultHighlights}>
          {item.highlights.slice(0, 3).map((highlight, index) => (
            <Text key={index} style={[styles.resultHighlight, { backgroundColor: '#fff3cd' }]}>
              ...{highlight.text}...
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSearchHistory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.historyItem, themeStyles.card]}
      onPress={() => setQuery({ ...query, text: item })}
    >
      <Text style={[styles.historyIcon, themeStyles.text]}>🕒</Text>
      <Text style={[styles.historyText, themeStyles.text]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, themeStyles.background]}>
        <View style={[styles.header, themeStyles.card]}>
          <Text style={[styles.title, themeStyles.text]}>Advanced Search</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, themeStyles.text]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, themeStyles.card]}>
            <TextInput
              style={[styles.searchInput, themeStyles.input]}
              placeholder="Search documents, media, comments..."
              placeholderTextColor={themeStyles.textSecondary.color}
              value={query.text}
              onChangeText={(text) => setQuery({ ...query, text })}
              onSubmitEditing={performSearch}
              returnKeyType="search"
              autoFocus
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: '#007bff' }]}
              onPress={performSearch}
              disabled={isSearching}
            >
              <Text style={styles.searchButtonText}>
                {isSearching ? '🔍' : 'Search'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchActions}>
            <TouchableOpacity
              style={[styles.filterButton, themeStyles.card]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={[styles.filterButtonText, themeStyles.text]}>
                🎛️ Filters {showFilters ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.clearButton, themeStyles.card]}
              onPress={clearSearch}
            >
              <Text style={[styles.clearButtonText, themeStyles.text]}>Clear</Text>
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={[styles.filtersContainer, themeStyles.card]}>
              <Text style={[styles.filtersTitle, themeStyles.text]}>Search Options</Text>

              <View style={styles.filterRow}>
                <Text style={[styles.filterLabel, themeStyles.text]}>Fuzzy Search</Text>
                <Switch
                  value={query.options?.fuzzy || false}
                  onValueChange={() => toggleFilter('fuzzy')}
                />
              </View>

              <View style={styles.filterRow}>
                <Text style={[styles.filterLabel, themeStyles.text]}>Semantic Search</Text>
                <Switch
                  value={query.options?.semantic || false}
                  onValueChange={() => toggleFilter('semantic')}
                />
              </View>

              <View style={styles.filterRow}>
                <Text style={[styles.filterLabel, themeStyles.text]}>Case Sensitive</Text>
                <Switch
                  value={query.options?.caseSensitive || false}
                  onValueChange={() => toggleFilter('caseSensitive')}
                />
              </View>

              <View style={styles.filterRow}>
                <Text style={[styles.filterLabel, themeStyles.text]}>Whole Words</Text>
                <Switch
                  value={query.options?.wholeWords || false}
                  onValueChange={() => toggleFilter('wholeWords')}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={[styles.loadingText, themeStyles.text]}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={[styles.resultsCount, themeStyles.text]}>
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </Text>
              }
            />
          ) : query.text ? (
            <View style={styles.noResultsContainer}>
              <Text style={[styles.noResultsText, themeStyles.text]}>No results found</Text>
              <Text style={[styles.noResultsSubtext, themeStyles.textSecondary]}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          ) : (
            <View style={styles.historyContainer}>
              <Text style={[styles.historyTitle, themeStyles.text]}>Recent Searches</Text>
              <FlatList
                data={searchHistory}
                renderItem={renderSearchHistory}
                keyExtractor={(item, index) => `${item}_${index}`}
                style={styles.historyList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>

        {/* Search Analytics */}
        {analytics && (
          <View style={[styles.analyticsContainer, themeStyles.card]}>
            <Text style={[styles.analyticsTitle, themeStyles.text]}>Search Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsItem}>
                <Text style={[styles.analyticsValue, themeStyles.text]}>
                  {analytics.totalSearches}
                </Text>
                <Text style={[styles.analyticsLabel, themeStyles.textSecondary]}>
                  Total Searches
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={[styles.analyticsValue, themeStyles.text]}>
                  {analytics.averageResponseTime.toFixed(0)}ms
                </Text>
                <Text style={[styles.analyticsLabel, themeStyles.textSecondary]}>
                  Avg Response
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={[styles.analyticsValue, themeStyles.text]}>
                  {analytics.popularQueries.length}
                </Text>
                <Text style={[styles.analyticsLabel, themeStyles.textSecondary]}>
                  Popular Queries
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    padding: 16,
    borderRadius: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultType: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resultScore: {
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultMetaText: {
    fontSize: 12,
  },
  resultHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  resultHighlight: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  historyIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  historyText: {
    fontSize: 14,
  },
  analyticsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticsItem: {
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AdvancedSearch;