import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AISuggestion {
  id: string;
  type: 'grammar' | 'style' | 'seo' | 'accessibility' | 'content';
  message: string;
  confidence: 'high' | 'medium' | 'low';
  position?: {
    start: number;
    end: number;
  };
  replacement?: string;
  category: string;
}

export interface AIContentAnalysis {
  readability: {
    score: number;
    level: 'easy' | 'medium' | 'hard';
    suggestions: string[];
  };
  seo: {
    score: number;
    keywords: string[];
    suggestions: string[];
  };
  accessibility: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  sentiment: {
    score: number; // -1 to 1
    label: 'negative' | 'neutral' | 'positive';
  };
}

export interface AIWritingAssistant {
  generateSuggestions(content: string): Promise<AISuggestion[]>;
  analyzeContent(content: string): Promise<AIContentAnalysis>;
  improveWriting(content: string, style: 'professional' | 'casual' | 'creative'): Promise<string>;
  generateTitle(content: string): Promise<string>;
  checkGrammar(content: string): Promise<AISuggestion[]>;
  optimizeSEO(content: string, keywords?: string[]): Promise<AISuggestion[]>;
  enhanceAccessibility(content: string): Promise<AISuggestion[]>;
}

export class MobileAIService implements AIWritingAssistant {
  private static readonly CACHE_KEY = '@ai_cache';
  private static readonly API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // Example endpoint
  private static readonly API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.loadCache();
  }

  async generateSuggestions(content: string): Promise<AISuggestion[]> {
    const cacheKey = `suggestions_${this.hashContent(content)}`;

    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Simulate AI processing with mock data for demo
      const suggestions = await this.generateMockSuggestions(content);

      // Cache the result
      this.setCached(cacheKey, suggestions);

      return suggestions;
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return this.generateFallbackSuggestions(content);
    }
  }

  async analyzeContent(content: string): Promise<AIContentAnalysis> {
    const cacheKey = `analysis_${this.hashContent(content)}`;

    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const analysis = await this.performContentAnalysis(content);
      this.setCached(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing content:', error);
      return this.generateFallbackAnalysis(content);
    }
  }

  async improveWriting(content: string, style: 'professional' | 'casual' | 'creative' = 'professional'): Promise<string> {
    try {
      // Simulate AI writing improvement
      await new Promise(resolve => setTimeout(resolve, 2000));

      const improvements = {
        professional: 'Enhanced the content with more formal language and improved structure.',
        casual: 'Made the content more conversational and approachable.',
        creative: 'Added creative elements and more engaging storytelling.'
      };

      return `${content}\n\n[AI Improvement: ${improvements[style]}]`;
    } catch (error) {
      console.error('Error improving writing:', error);
      return content;
    }
  }

  async generateTitle(content: string): Promise<string> {
    try {
      // Extract first few words and make it title case
      const words = content.split(' ').slice(0, 8);
      const title = words.join(' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/[.!?]$/, '');

      return title || 'Untitled Content';
    } catch (error) {
      console.error('Error generating title:', error);
      return 'AI Generated Title';
    }
  }

  async checkGrammar(content: string): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // Basic grammar checks (in a real implementation, this would use AI)
    const sentences = content.split(/[.!?]+/);

    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed && !trimmed[0].match(/[A-Z]/)) {
        suggestions.push({
          id: `grammar_${index}`,
          type: 'grammar',
          message: 'Sentence should start with a capital letter.',
          confidence: 'high',
          position: {
            start: content.indexOf(trimmed),
            end: content.indexOf(trimmed) + trimmed.length
          },
          category: 'grammar'
        });
      }
    });

    return suggestions;
  }

  async optimizeSEO(content: string, keywords: string[] = []): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // Basic SEO checks
    if (content.length < 300) {
      suggestions.push({
        id: 'seo_length',
        type: 'seo',
        message: 'Content is too short for optimal SEO. Aim for at least 300 words.',
        confidence: 'medium',
        category: 'seo'
      });
    }

    // Check for keywords
    if (keywords.length > 0) {
      const contentLower = content.toLowerCase();
      const missingKeywords = keywords.filter(keyword =>
        !contentLower.includes(keyword.toLowerCase())
      );

      if (missingKeywords.length > 0) {
        suggestions.push({
          id: 'seo_keywords',
          type: 'seo',
          message: `Consider adding these keywords: ${missingKeywords.join(', ')}`,
          confidence: 'medium',
          category: 'seo'
        });
      }
    }

    return suggestions;
  }

  async enhanceAccessibility(content: string): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // Check for images without alt text (basic check)
    const imgRegex = /<img[^>]*>/gi;
    const images = content.match(imgRegex) || [];

    images.forEach((img, index) => {
      if (!img.includes('alt=')) {
        suggestions.push({
          id: `accessibility_alt_${index}`,
          type: 'accessibility',
          message: 'Image is missing alt text for screen readers.',
          confidence: 'high',
          category: 'accessibility'
        });
      }
    });

    // Check for heading structure
    const headings = content.match(/^#{1,6}\s/m) || [];
    if (headings.length === 0) {
      suggestions.push({
        id: 'accessibility_headings',
        type: 'accessibility',
        message: 'Consider adding headings to improve content structure for screen readers.',
        confidence: 'medium',
        category: 'accessibility'
      });
    }

    return suggestions;
  }

  private async generateMockSuggestions(content: string): Promise<AISuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: AISuggestion[] = [];
    const contentLength = content.length;

    // Generate contextual suggestions based on content
    if (contentLength > 100) {
      suggestions.push({
        id: 'style_1',
        type: 'style',
        message: 'Consider breaking this long paragraph into shorter ones for better readability.',
        confidence: 'medium',
        category: 'style'
      });
    }

    if (content.toLowerCase().includes('click here')) {
      suggestions.push({
        id: 'accessibility_1',
        type: 'accessibility',
        message: 'Avoid generic link text like "click here". Use descriptive link text instead.',
        confidence: 'high',
        category: 'accessibility'
      });
    }

    if (!content.includes('?') && !content.includes('!')) {
      suggestions.push({
        id: 'content_1',
        type: 'content',
        message: 'Consider adding questions or exclamations to make your content more engaging.',
        confidence: 'low',
        category: 'content'
      });
    }

    return suggestions;
  }

  private async performContentAnalysis(content: string): Promise<AIContentAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const wordCount = content.split(' ').length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    // Calculate readability score (simplified)
    let readabilityScore = 100;
    if (avgWordsPerSentence > 20) readabilityScore -= 20;
    if (wordCount < 300) readabilityScore -= 15;

    const readabilityLevel: 'easy' | 'medium' | 'hard' =
      readabilityScore > 80 ? 'easy' :
      readabilityScore > 60 ? 'medium' : 'hard';

    // Extract potential keywords (simplified)
    const words = content.toLowerCase().split(/\W+/);
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'poor'];

    const positiveCount = positiveWords.reduce((count, word) =>
      count + (content.toLowerCase().split(word).length - 1), 0);
    const negativeCount = negativeWords.reduce((count, word) =>
      count + (content.toLowerCase().split(word).length - 1), 0);

    const sentimentScore = positiveCount > negativeCount ? 0.5 :
                          negativeCount > positiveCount ? -0.5 : 0;

    const sentimentLabel: 'negative' | 'neutral' | 'positive' =
      sentimentScore > 0.1 ? 'positive' :
      sentimentScore < -0.1 ? 'negative' : 'neutral';

    return {
      readability: {
        score: readabilityScore,
        level: readabilityLevel,
        suggestions: readabilityScore < 80 ? [
          'Use shorter sentences for better readability',
          'Break up long paragraphs',
          'Use simpler words when possible'
        ] : []
      },
      seo: {
        score: Math.min(100, wordCount / 3), // Basic score based on word count
        keywords,
        suggestions: wordCount < 300 ? ['Add more content for better SEO'] : []
      },
      accessibility: {
        score: 85, // Placeholder
        issues: [],
        suggestions: ['Ensure all images have alt text', 'Use proper heading structure']
      },
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel
      }
    };
  }

  private generateFallbackSuggestions(content: string): AISuggestion[] {
    return [{
      id: 'fallback_1',
      type: 'content',
      message: 'Consider reviewing your content for clarity and engagement.',
      confidence: 'low',
      category: 'general'
    }];
  }

  private generateFallbackAnalysis(content: string): AIContentAnalysis {
    return {
      readability: {
        score: 70,
        level: 'medium',
        suggestions: ['Review content for readability improvements']
      },
      seo: {
        score: 60,
        keywords: [],
        suggestions: ['Add relevant keywords to improve SEO']
      },
      accessibility: {
        score: 75,
        issues: [],
        suggestions: ['Review accessibility guidelines']
      },
      sentiment: {
        score: 0,
        label: 'neutral'
      }
    };
  }

  private hashContent(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private async loadCache(): Promise<void> {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading AI cache:', error);
    }
  }

  private async saveCache(): Promise<void> {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error saving AI cache:', error);
    }
  }

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCached(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    this.saveCache(); // Save to persistent storage
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    await AsyncStorage.removeItem(this.CACHE_KEY);
  }
}

// Singleton instance
export const mobileAIService = new MobileAIService();