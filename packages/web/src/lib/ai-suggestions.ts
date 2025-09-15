import { AISuggestion } from '@/types/ai-suggestion';

export const generateMockAISuggestions = (content: string): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  if (content.includes('Hello World')) {
    suggestions.push({
      id: 'sugg-1',
      type: 'accessibility',
      message: 'Consider adding more descriptive alt text for images.',
      confidence: 90,
    });
  }

  if (content.length < 50) {
    suggestions.push({
      id: 'sugg-2',
      type: 'creative',
      message: 'Expand on the content to provide more detail.',
      confidence: 75,
    });
  }

  suggestions.push({
    id: 'sugg-3',
    type: 'inclusivity',
    message: 'Review language for inclusive terminology.',
    confidence: 80,
  });

  return suggestions;
};
