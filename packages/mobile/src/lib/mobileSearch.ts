// Mobile Advanced Search System with AI-Powered Semantic Search
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SearchQuery {
  text: string;
  filters?: {
    type?: ('document' | 'media' | 'comment')[];
    dateRange?: { start: Date; end: Date };
    author?: string[];
    tags?: string[];
    category?: string[];
  };
  options?: {
    fuzzy?: boolean;
    semantic?: boolean;
    caseSensitive?: boolean;
    wholeWords?: boolean;
  };
}

export interface SearchResult {
  id: string;
  type: 'document' | 'media' | 'comment';
  title: string;
  content: string;
  excerpt: string;
  relevanceScore: number;
  highlights: { start: number; end: number; text: string }[];
  metadata: {
    author?: string;
    createdAt: Date;
    modifiedAt: Date;
    tags?: string[];
    category?: string;
    size?: number;
  };
}

export interface SearchIndex {
  id: string;
  type: 'document' | 'media' | 'comment';
  content: string;
  tokens: string[];
  embeddings?: number[]; // For semantic search
  metadata: Record<string, any>;
  lastIndexed: Date;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResponseTime: number;
  popularQueries: Array<{ query: string; count: number }>;
  noResultsQueries: string[];
  clickThroughRate: number;
}

export class MobileSearchService {
  private static instance: MobileSearchService;
  private searchIndex: Map<string, SearchIndex> = new Map();
  private searchAnalytics: SearchAnalytics;
  private isIndexing: boolean = false;

  private constructor() {
    this.searchAnalytics = {
      totalSearches: 0,
      averageResponseTime: 0,
      popularQueries: [],
      noResultsQueries: [],
      clickThroughRate: 0
    };
    this.initializeSearch();
  }

  static getInstance(): MobileSearchService {
    if (!MobileSearchService.instance) {
      MobileSearchService.instance = new MobileSearchService();
    }
    return MobileSearchService.instance;
  }

  private async initializeSearch(): Promise<void> {
    try {
      // Load search index
      const indexData = await AsyncStorage.getItem('@search_index');
      if (indexData) {
        const index = JSON.parse(indexData);
        for (const [key, value] of Object.entries(index)) {
          this.searchIndex.set(key, {
            ...value,
            lastIndexed: new Date(value.lastIndexed)
          } as SearchIndex);
        }
      }

      // Load search analytics
      const analyticsData = await AsyncStorage.getItem('@search_analytics');
      if (analyticsData) {
        this.searchAnalytics = { ...this.searchAnalytics, ...JSON.parse(analyticsData) };
      }

    } catch (error) {
      console.error('Error initializing search service:', error);
    }
  }

  // Indexing
  async indexContent(id: string, type: SearchIndex['type'], content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const tokens = this.tokenizeContent(content);
      const embeddings = await this.generateEmbeddings(content);

      const searchIndex: SearchIndex = {
        id,
        type,
        content,
        tokens,
        embeddings,
        metadata,
        lastIndexed: new Date()
      };

      this.searchIndex.set(id, searchIndex);
      await this.persistSearchIndex();

    } catch (error) {
      console.error('Error indexing content:', error);
    }
  }

  async removeFromIndex(id: string): Promise<void> {
    this.searchIndex.delete(id);
    await this.persistSearchIndex();
  }

  async reindexAll(): Promise<void> {
    if (this.isIndexing) return;

    this.isIndexing = true;
    try {
      // Clear existing index
      this.searchIndex.clear();

      // Re-index all content types
      // This would typically iterate through all documents, media, etc.
      // For now, we'll just mark as complete
      console.log('Re-indexing all content...');

      await this.persistSearchIndex();

    } catch (error) {
      console.error('Error re-indexing:', error);
    } finally {
      this.isIndexing = false;
    }
  }

  private tokenizeContent(content: string): string[] {
    // Simple tokenization - in a real implementation, this would use NLP libraries
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
      .filter((token, index, array) => array.indexOf(token) === index); // Remove duplicates
  }

  private async generateEmbeddings(content: string): Promise<number[]> {
    // In a real implementation, this would use a machine learning model
    // For now, we'll create a simple hash-based embedding
    const tokens = this.tokenizeContent(content);
    const embedding = new Array(128).fill(0);

    tokens.forEach((token, index) => {
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = ((hash << 5) - hash) + token.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
      }

      // Distribute hash across embedding dimensions
      for (let i = 0; i < 128; i++) {
        embedding[i] = (embedding[i] + (hash >> i) % 256) / 256;
      }
    });

    return embedding;
  }

  // Search
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const startTime = Date.now();

    try {
      let results: SearchResult[] = [];

      if (query.options?.semantic && query.text.trim()) {
        // Perform semantic search
        results = await this.performSemanticSearch(query);
      } else {
        // Perform keyword-based search
        results = await this.performKeywordSearch(query);
      }

      // Apply filters
      if (query.filters) {
        results = this.applyFilters(results, query.filters);
      }

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Update analytics
      await this.updateSearchAnalytics(query.text, results.length, Date.now() - startTime);

      return results;

    } catch (error) {
      console.error('Search failed:', error);
      await this.updateSearchAnalytics(query.text, 0, Date.now() - startTime, true);
      return [];
    }
  }

  private async performKeywordSearch(query: SearchQuery): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const searchTerms = this.tokenizeContent(query.text);
    const isFuzzy = query.options?.fuzzy ?? false;
    const caseSensitive = query.options?.caseSensitive ?? false;
    const wholeWords = query.options?.wholeWords ?? false;

    for (const [id, indexItem] of this.searchIndex) {
      const score = this.calculateKeywordScore(indexItem, searchTerms, {
        fuzzy: isFuzzy,
        caseSensitive,
        wholeWords
      });

      if (score > 0) {
        const result = await this.createSearchResult(indexItem, query.text, score);
        results.push(result);
      }
    }

    return results;
  }

  private async performSemanticSearch(query: SearchQuery): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const queryEmbedding = await this.generateEmbeddings(query.text);

    for (const [id, indexItem] of this.searchIndex) {
      if (!indexItem.embeddings) continue;

      const similarity = this.cosineSimilarity(queryEmbedding, indexItem.embeddings);
      const score = similarity * 100; // Convert to 0-100 scale

      if (score > 30) { // Minimum similarity threshold
        const result = await this.createSearchResult(indexItem, query.text, score);
        results.push(result);
      }
    }

    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private calculateKeywordScore(
    indexItem: SearchIndex,
    searchTerms: string[],
    options: { fuzzy: boolean; caseSensitive: boolean; wholeWords: boolean }
  ): number {
    let totalScore = 0;
    const content = options.caseSensitive ? indexItem.content : indexItem.content.toLowerCase();

    for (const term of searchTerms) {
      const searchTerm = options.caseSensitive ? term : term.toLowerCase();
      let termScore = 0;

      if (options.wholeWords) {
        // Exact word matching
        const regex = new RegExp(`\\b${this.escapeRegex(searchTerm)}\\b`, options.caseSensitive ? 'g' : 'gi');
        const matches = content.match(regex);
        termScore = matches ? matches.length * 10 : 0;
      } else {
        // Partial matching
        const regex = new RegExp(this.escapeRegex(searchTerm), options.caseSensitive ? 'g' : 'gi');
        const matches = content.match(regex);
        termScore = matches ? matches.length * 5 : 0;
      }

      // Fuzzy matching bonus
      if (options.fuzzy && termScore === 0) {
        termScore = this.calculateFuzzyScore(searchTerm, indexItem.tokens);
      }

      // Boost score for matches in title/metadata
      if (indexItem.metadata.title && indexItem.metadata.title.toLowerCase().includes(searchTerm)) {
        termScore *= 2;
      }

      totalScore += termScore;
    }

    return totalScore;
  }

  private calculateFuzzyScore(searchTerm: string, tokens: string[]): number {
    let bestScore = 0;

    for (const token of tokens) {
      const distance = this.levenshteinDistance(searchTerm, token);
      const maxLength = Math.max(searchTerm.length, token.length);
      const similarity = 1 - (distance / maxLength);

      if (similarity > 0.8) { // 80% similarity threshold
        bestScore = Math.max(bestScore, similarity * 3);
      }
    }

    return bestScore;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private applyFilters(results: SearchResult[], filters: SearchQuery['filters']): SearchResult[] {
    return results.filter(result => {
      // Type filter
      if (filters?.type && !filters.type.includes(result.type)) {
        return false;
      }

      // Date range filter
      if (filters?.dateRange) {
        const itemDate = result.metadata.createdAt || result.metadata.modifiedAt;
        if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
          return false;
        }
      }

      // Author filter
      if (filters?.author && result.metadata.author && !filters.author.includes(result.metadata.author)) {
        return false;
      }

      // Tags filter
      if (filters?.tags && result.metadata.tags) {
        const hasMatchingTag = filters.tags.some(tag =>
          result.metadata.tags!.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Category filter
      if (filters?.category && result.metadata.category && !filters.category.includes(result.metadata.category)) {
        return false;
      }

      return true;
    });
  }

  private async createSearchResult(indexItem: SearchIndex, query: string, score: number): Promise<SearchResult> {
    const highlights = this.generateHighlights(indexItem.content, query);
    const excerpt = this.generateExcerpt(indexItem.content, highlights);

    return {
      id: indexItem.id,
      type: indexItem.type,
      title: indexItem.metadata.title || `Untitled ${indexItem.type}`,
      content: indexItem.content,
      excerpt,
      relevanceScore: score,
      highlights,
      metadata: {
        author: indexItem.metadata.author,
        createdAt: indexItem.metadata.createdAt || new Date(),
        modifiedAt: indexItem.lastIndexed,
        tags: indexItem.metadata.tags,
        category: indexItem.metadata.category,
        size: indexItem.content.length
      }
    };
  }

  private generateHighlights(content: string, query: string): { start: number; end: number; text: string }[] {
    const highlights: { start: number; end: number; text: string }[] = [];
    const searchTerms = this.tokenizeContent(query);
    const lowerContent = content.toLowerCase();

    for (const term of searchTerms) {
      let startIndex = 0;
      let index = lowerContent.indexOf(term, startIndex);

      while (index !== -1 && highlights.length < 10) { // Limit highlights
        const endIndex = index + term.length;
        highlights.push({
          start: index,
          end: endIndex,
          text: content.substring(index, endIndex)
        });

        startIndex = endIndex;
        index = lowerContent.indexOf(term, startIndex);
      }
    }

    return highlights.sort((a, b) => a.start - b.start);
  }

  private generateExcerpt(content: string, highlights: { start: number; end: number; text: string }[], maxLength: number = 200): string {
    if (highlights.length === 0) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }

    // Create excerpt around first highlight
    const firstHighlight = highlights[0];
    const start = Math.max(0, firstHighlight.start - 50);
    const end = Math.min(content.length, firstHighlight.end + 50);

    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }

  // Analytics
  private async updateSearchAnalytics(query: string, resultCount: number, responseTime: number, hadError: boolean = false): Promise<void> {
    this.searchAnalytics.totalSearches++;

    // Update average response time
    const totalTime = this.searchAnalytics.averageResponseTime * (this.searchAnalytics.totalSearches - 1) + responseTime;
    this.searchAnalytics.averageResponseTime = totalTime / this.searchAnalytics.totalSearches;

    // Track popular queries
    const existingQuery = this.searchAnalytics.popularQueries.find(q => q.query === query);
    if (existingQuery) {
      existingQuery.count++;
    } else {
      this.searchAnalytics.popularQueries.push({ query, count: 1 });
    }

    // Keep only top 20 popular queries
    this.searchAnalytics.popularQueries.sort((a, b) => b.count - a.count);
    this.searchAnalytics.popularQueries = this.searchAnalytics.popularQueries.slice(0, 20);

    // Track no-results queries
    if (resultCount === 0 && !hadError) {
      if (!this.searchAnalytics.noResultsQueries.includes(query)) {
        this.searchAnalytics.noResultsQueries.push(query);
      }
    }

    await this.persistSearchAnalytics();
  }

  // Persistence
  private async persistSearchIndex(): Promise<void> {
    try {
      const indexData: Record<string, any> = {};
      for (const [key, value] of this.searchIndex) {
        indexData[key] = {
          ...value,
          lastIndexed: value.lastIndexed.toISOString()
        };
      }
      await AsyncStorage.setItem('@search_index', JSON.stringify(indexData));
    } catch (error) {
      console.error('Failed to persist search index:', error);
    }
  }

  private async persistSearchAnalytics(): Promise<void> {
    try {
      await AsyncStorage.setItem('@search_analytics', JSON.stringify(this.searchAnalytics));
    } catch (error) {
      console.error('Failed to persist search analytics:', error);
    }
  }

  // Public API
  getSearchAnalytics(): SearchAnalytics {
    return { ...this.searchAnalytics };
  }

  getIndexStats(): { totalItems: number; types: Record<string, number>; lastIndexed?: Date } {
    const types: Record<string, number> = {};
    let lastIndexed: Date | undefined;

    for (const item of this.searchIndex.values()) {
      types[item.type] = (types[item.type] || 0) + 1;
      if (!lastIndexed || item.lastIndexed > lastIndexed) {
        lastIndexed = item.lastIndexed;
      }
    }

    return {
      totalItems: this.searchIndex.size,
      types,
      lastIndexed
    };
  }

  async clearIndex(): Promise<void> {
    this.searchIndex.clear();
    await AsyncStorage.removeItem('@search_index');
  }

  async clearAnalytics(): Promise<void> {
    this.searchAnalytics = {
      totalSearches: 0,
      averageResponseTime: 0,
      popularQueries: [],
      noResultsQueries: [],
      clickThroughRate: 0
    };
    await AsyncStorage.removeItem('@search_analytics');
  }
}

export const mobileSearch = MobileSearchService.getInstance();