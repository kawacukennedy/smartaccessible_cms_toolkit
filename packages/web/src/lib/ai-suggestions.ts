import { AISuggestion } from '@/types/ai-suggestion';

export const generateMockAISuggestions = (content: string): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  if (content.includes('Hello World')) {
    suggestions.push({
      id: 'sugg-1',
      type: 'accessibility',
      message: 'Consider adding more descriptive alt text for images.',
      recommendation: 'Ensure all images have descriptive alt text for screen readers.',
      confidence: 90,
    });
  }

  if (content.length < 50) {
    suggestions.push({
      id: 'sugg-2',
      type: 'creative',
      message: 'Expand on the content to provide more detail.',
      recommendation: 'Elaborate on key points and add supporting examples to enrich the content.',
      confidence: 75,
    });
  }

  suggestions.push({
    id: 'sugg-3',
    type: 'inclusivity',
    message: 'Review language for inclusive terminology.',
    recommendation: 'Use gender-neutral language and avoid stereotypes to ensure inclusivity.',
    confidence: 80,
  });

  return suggestions;
};
