import { AISuggestion } from '@/types/ai-suggestion';

interface ContentAnalysis {
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
  tone: {
    primary: string;
    suggestions: string[];
  };
}

export const analyzeContent = (content: string): ContentAnalysis => {
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Readability analysis (simplified Flesch Reading Ease)
  const readabilityScore = Math.max(0, Math.min(100,
    206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (content.length / wordCount))
  ));

  // SEO analysis
  const keywords = extractKeywords(content);
  const seoScore = calculateSEOscore(content, keywords);

  // Accessibility analysis
  const accessibilityIssues = checkAccessibility(content);

  // Sentiment analysis (simplified)
  const sentimentScore = analyzeSentiment(content);

  return {
    readability: {
      score: readabilityScore,
      level: readabilityScore > 60 ? 'easy' : readabilityScore > 30 ? 'medium' : 'hard',
      suggestions: generateReadabilitySuggestions(readabilityScore, avgWordsPerSentence)
    },
    seo: {
      score: seoScore,
      keywords,
      suggestions: generateSEOSuggestions(content, keywords)
    },
    accessibility: {
      score: Math.max(0, 100 - (accessibilityIssues.length * 10)),
      issues: accessibilityIssues,
      suggestions: generateAccessibilitySuggestions(accessibilityIssues)
    },
    sentiment: {
      score: sentimentScore,
      label: sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral'
    },
    tone: {
      primary: detectTone(content),
      suggestions: generateToneSuggestions(content)
    }
  };
};

export const generateAISuggestions = (content: string, analysis?: ContentAnalysis): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  const contentAnalysis = analysis || analyzeContent(content);

  // Readability suggestions
  if (contentAnalysis.readability.level === 'hard') {
    suggestions.push({
      id: `readability-${Date.now()}`,
      type: 'readability',
      message: 'Content may be difficult to read',
      recommendation: 'Consider simplifying sentences and using shorter words',
      confidence: Math.min(95, 100 - contentAnalysis.readability.score),
      autoFix: true
    });
  }

  // SEO suggestions
  if (contentAnalysis.seo.score < 70) {
    suggestions.push({
      id: `seo-${Date.now()}`,
      type: 'seo',
      message: 'SEO optimization opportunities available',
      recommendation: `Add keywords like: ${contentAnalysis.seo.keywords.slice(0, 3).join(', ')}`,
      confidence: 100 - contentAnalysis.seo.score,
      autoFix: false
    });
  }

  // Accessibility suggestions
  contentAnalysis.accessibility.issues.forEach((issue, index) => {
    suggestions.push({
      id: `accessibility-${Date.now()}-${index}`,
      type: 'accessibility',
      message: issue,
      recommendation: contentAnalysis.accessibility.suggestions[index] || 'Review for accessibility compliance',
      confidence: 85,
      autoFix: issue.includes('alt text') || issue.includes('heading')
    });
  });

  // Tone suggestions
  if (contentAnalysis.sentiment.label === 'negative' && contentAnalysis.tone.primary === 'formal') {
    suggestions.push({
      id: `tone-${Date.now()}`,
      type: 'tone',
      message: 'Consider adjusting tone for better engagement',
      recommendation: 'Try a more conversational tone to improve reader connection',
      confidence: 70,
      autoFix: false
    });
  }

  // Creative suggestions
  if (content.split(' ').length < 100) {
    suggestions.push({
      id: `creative-${Date.now()}`,
      type: 'creative',
      message: 'Content could benefit from expansion',
      recommendation: 'Add examples, statistics, or quotes to make content more engaging',
      confidence: 60,
      autoFix: false
    });
  }

  return suggestions;
};

// Real-time suggestion generation for content changes
export const generateRealTimeSuggestions = (
  content: string,
  previousContent: string,
  cursorPosition?: number
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Detect if user is writing a heading
  if (cursorPosition !== undefined) {
    const lines = content.split('\n');
    const currentLineIndex = content.substring(0, cursorPosition).split('\n').length - 1;
    const currentLine = lines[currentLineIndex] || '';

    if (currentLine.trim().length > 0 && !currentLine.includes('#') && currentLine.length < 60) {
      suggestions.push({
        id: `heading-${Date.now()}`,
        type: 'structure',
        message: 'Consider making this a heading',
        recommendation: 'Use # for main headings or ## for subheadings to improve content structure',
        confidence: 75,
        autoFix: true,
        position: cursorPosition
      });
    }
  }

  // Detect repetitive words
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts: { [key: string]: number } = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  const repetitiveWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 3 && word !== 'the' && word !== 'and' && word !== 'or')
    .map(([word]) => word);

  if (repetitiveWords.length > 0) {
    suggestions.push({
      id: `repetition-${Date.now()}`,
      type: 'style',
      message: `Word repetition detected: ${repetitiveWords.slice(0, 3).join(', ')}`,
      recommendation: 'Consider using synonyms or rephrasing to avoid repetition',
      confidence: 80,
      autoFix: false
    });
  }

  // Detect content changes that might need updates
  if (previousContent && content !== previousContent) {
    const addedContent = content.replace(previousContent, '');
    if (addedContent.includes('http') && !addedContent.includes('](')) {
      suggestions.push({
        id: `link-${Date.now()}`,
        type: 'formatting',
        message: 'Detected plain URL - consider making it a link',
        recommendation: 'Format URLs as [link text](url) for better readability',
        confidence: 90,
        autoFix: true
      });
    }
  }

  return suggestions;
};

// Helper functions
function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'an', 'a'];

  const keywordCounts: { [key: string]: number } = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3 && !stopWords.includes(cleanWord)) {
      keywordCounts[cleanWord] = (keywordCounts[cleanWord] || 0) + 1;
    }
  });

  return Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function calculateSEOscore(content: string, keywords: string[]): number {
  let score = 50; // Base score

  // Length bonus
  if (content.length > 300) score += 20;
  if (content.length > 1000) score += 10;

  // Keyword usage bonus
  const keywordUsage = keywords.length > 5 ? 15 : keywords.length * 3;
  score += keywordUsage;

  // Heading bonus
  if (content.includes('# ')) score += 10;

  return Math.min(100, score);
}

function checkAccessibility(content: string): string[] {
  const issues: string[] = [];

  // Check for images without alt text (simplified check)
  const imgTags = content.match(/<img[^>]*>/g) || [];
  imgTags.forEach(tag => {
    if (!tag.includes('alt=')) {
      issues.push('Image found without alt text');
    }
  });

  // Check heading structure
  const headings = content.match(/^#{1,6}\s/gm) || [];
  if (headings.length === 0) {
    issues.push('No headings found - consider adding H1 and H2 tags');
  }

  // Check for very long paragraphs
  const paragraphs = content.split('\n\n');
  paragraphs.forEach(p => {
    if (p.length > 500) {
      issues.push('Very long paragraph detected - consider breaking into smaller paragraphs');
    }
  });

  return issues;
}

function analyzeSentiment(content: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointing', 'boring'];

  const words = content.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.1;
    if (negativeWords.includes(word)) score -= 0.1;
  });

  return Math.max(-1, Math.min(1, score));
}

function detectTone(content: string): string {
  const formalWords = ['therefore', 'furthermore', 'consequently', 'moreover', 'additionally'];
  const casualWords = ['hey', 'cool', 'awesome', 'totally', 'kinda', 'sorta'];

  const words = content.toLowerCase().split(/\s+/);
  let formalCount = 0;
  let casualCount = 0;

  words.forEach(word => {
    if (formalWords.includes(word)) formalCount++;
    if (casualWords.includes(word)) casualCount++;
  });

  if (formalCount > casualCount) return 'formal';
  if (casualCount > formalCount) return 'casual';
  return 'neutral';
}

function generateReadabilitySuggestions(score: number, avgWordsPerSentence: number): string[] {
  const suggestions: string[] = [];

  if (avgWordsPerSentence > 20) {
    suggestions.push('Break long sentences into shorter ones');
  }

  if (score < 30) {
    suggestions.push('Use simpler words and shorter sentences');
    suggestions.push('Add bullet points or numbered lists for complex information');
  }

  return suggestions;
}

function generateSEOSuggestions(content: string, keywords: string[]): string[] {
  const suggestions: string[] = [];

  if (!content.includes('# ')) {
    suggestions.push('Add a main heading (H1) at the beginning');
  }

  if (keywords.length < 3) {
    suggestions.push('Include more relevant keywords naturally in the content');
  }

  if (content.length < 300) {
    suggestions.push('Expand content to at least 300 words for better SEO');
  }

  return suggestions;
}

function generateAccessibilitySuggestions(issues: string[]): string[] {
  return issues.map(issue => {
    if (issue.includes('alt text')) {
      return 'Add descriptive alt text that explains the image content and function';
    }
    if (issue.includes('heading')) {
      return 'Use proper heading hierarchy (H1, H2, H3) to structure content';
    }
    if (issue.includes('paragraph')) {
      return 'Break long paragraphs into smaller, more digestible chunks';
    }
    return 'Review content for accessibility best practices';
  });
}

function generateToneSuggestions(content: string): string[] {
  const suggestions: string[] = [];
  const tone = detectTone(content);

  if (tone === 'formal') {
    suggestions.push('Consider using contractions (don\'t, can\'t) for a more conversational tone');
    suggestions.push('Add rhetorical questions to engage readers');
  }

  if (tone === 'casual') {
    suggestions.push('Consider more professional language for formal contexts');
  }

  return suggestions;
}

// Legacy function for backward compatibility
export const generateMockAISuggestions = generateAISuggestions;
