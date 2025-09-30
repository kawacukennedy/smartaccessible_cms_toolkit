export interface AISuggestion {
  id: string;
  type: 'accessibility' | 'inclusivity' | 'personalization' | 'creative' | 'seo' | 'content' | 'style';
  message: string;
  recommendation: string;
  confidence: number;
}
