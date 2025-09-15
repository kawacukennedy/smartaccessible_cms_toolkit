export interface AISuggestion {
  id: string;
  type: 'accessibility' | 'inclusivity' | 'personalization' | 'creative';
  message: string;
  confidence: number;
}
