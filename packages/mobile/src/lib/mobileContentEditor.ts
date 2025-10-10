import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ContentBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'video' | 'quote' | 'code' | 'list' | 'link';
  content: string;
  metadata?: {
    alt?: string;
    url?: string;
    level?: number; // for headings
    language?: string; // for code blocks
    items?: string[]; // for lists
  };
  styles?: {
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    color?: string;
  };
}

export interface ContentDocument {
  id: string;
  title: string;
  blocks: ContentBlock[];
  metadata: {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    category: string;
    seo: {
      title: string;
      description: string;
      keywords: string[];
      canonicalUrl?: string;
    };
    status: 'draft' | 'published' | 'archived';
    version: number;
  };
  collaborators?: string[];
  comments?: ContentComment[];
}

export interface ContentComment {
  id: string;
  blockId?: string;
  author: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies?: ContentComment[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: ContentBlock[];
  thumbnail?: string;
}

export interface ContentVersion {
  id: string;
  documentId: string;
  version: number;
  content: ContentDocument;
  timestamp: Date;
  author: string;
  changes: string[];
}

export class MobileContentEditor {
  private static readonly DOCUMENTS_KEY = '@content_documents';
  private static readonly TEMPLATES_KEY = '@content_templates';
  private static readonly VERSIONS_KEY = '@content_versions';

  // Document Management
  static async createDocument(title: string, author: string): Promise<ContentDocument> {
    if (!title.trim()) {
      throw new Error('Document title cannot be empty');
    }
    if (!author.trim()) {
      throw new Error('Document author cannot be empty');
    }

    const document: ContentDocument = {
      id: Date.now().toString(),
      title: title.trim(),
      blocks: [],
      metadata: {
        author: author.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        category: 'uncategorized',
        seo: {
          title: title.trim(),
          description: '',
          keywords: [],
        },
        status: 'draft',
        version: 1,
      },
    };

    await this.saveDocument(document);
    return document;
  }

  static async saveDocument(document: ContentDocument): Promise<void> {
    try {
      document.metadata.updatedAt = new Date();
      const documents = await this.getAllDocuments();
      const index = documents.findIndex(doc => doc.id === document.id);

      if (index >= 0) {
        documents[index] = document;
      } else {
        documents.push(document);
      }

      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  static async getDocument(id: string): Promise<ContentDocument | null> {
    try {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === id) || null;
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  }

  static async getAllDocuments(): Promise<ContentDocument[]> {
    try {
      const data = await AsyncStorage.getItem(this.DOCUMENTS_KEY);
      if (data) {
        const documents = JSON.parse(data);
        // Convert date strings back to Date objects
        return documents.map((doc: any) => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            createdAt: new Date(doc.metadata.createdAt),
            updatedAt: new Date(doc.metadata.updatedAt),
          },
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  static async deleteDocument(id: string): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Block Operations
  static createBlock(type: ContentBlock['type'], content: string = ''): ContentBlock {
    const block: ContentBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
    };

    // Set default metadata based on type
    switch (type) {
      case 'heading':
        block.metadata = { level: 1 };
        break;
      case 'image':
        block.metadata = { alt: '' };
        break;
      case 'video':
        block.metadata = { url: '' };
        break;
      case 'code':
        block.metadata = { language: 'javascript' };
        break;
      case 'list':
        block.metadata = { items: [] };
        break;
      case 'link':
        block.metadata = { url: '' };
        break;
    }

    return block;
  }

  static updateBlock(document: ContentDocument, blockId: string, updates: Partial<ContentBlock>): ContentDocument {
    const updatedBlocks = document.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );

    return {
      ...document,
      blocks: updatedBlocks,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
        version: document.metadata.version + 1,
      },
    };
  }

  static addBlock(document: ContentDocument, block: ContentBlock, index?: number): ContentDocument {
    const blocks = [...document.blocks];
    if (index !== undefined) {
      blocks.splice(index, 0, block);
    } else {
      blocks.push(block);
    }

    return {
      ...document,
      blocks,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
        version: document.metadata.version + 1,
      },
    };
  }

  static removeBlock(document: ContentDocument, blockId: string): ContentDocument {
    return {
      ...document,
      blocks: document.blocks.filter(block => block.id !== blockId),
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
        version: document.metadata.version + 1,
      },
    };
  }

  static moveBlock(document: ContentDocument, blockId: string, newIndex: number): ContentDocument {
    const blocks = [...document.blocks];
    const currentIndex = blocks.findIndex(block => block.id === blockId);

    if (currentIndex === -1 || newIndex < 0 || newIndex >= blocks.length) {
      return document;
    }

    const [removed] = blocks.splice(currentIndex, 1);
    blocks.splice(newIndex, 0, removed);

    return {
      ...document,
      blocks,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
        version: document.metadata.version + 1,
      },
    };
  }

  // Template Management
  static async saveTemplate(template: ContentTemplate): Promise<void> {
    try {
      const templates = await this.getAllTemplates();
      const index = templates.findIndex(t => t.id === template.id);

      if (index >= 0) {
        templates[index] = template;
      } else {
        templates.push(template);
      }

      await AsyncStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }

  static async getAllTemplates(): Promise<ContentTemplate[]> {
    try {
      const data = await AsyncStorage.getItem(this.TEMPLATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  static async createDocumentFromTemplate(templateId: string, title: string, author: string): Promise<ContentDocument> {
    const templates = await this.getAllTemplates();
    const template = templates.find(t => t.id === templateId);

    if (!template) {
      throw new Error('Template not found');
    }

    const document: ContentDocument = {
      id: Date.now().toString(),
      title,
      blocks: template.blocks.map(block => ({
        ...block,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      })),
      metadata: {
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        category: template.category,
        seo: {
          title,
          description: '',
          keywords: [],
        },
        status: 'draft',
        version: 1,
      },
    };

    await this.saveDocument(document);
    return document;
  }

  // Version Control
  static async saveVersion(document: ContentDocument, author: string, changes: string[]): Promise<void> {
    try {
      const version: ContentVersion = {
        id: Date.now().toString(),
        documentId: document.id,
        version: document.metadata.version,
        content: { ...document },
        timestamp: new Date(),
        author,
        changes,
      };

      const versions = await this.getVersions(document.id);
      versions.push(version);

      // Keep only last 10 versions
      if (versions.length > 10) {
        versions.splice(0, versions.length - 10);
      }

      await AsyncStorage.setItem(`${this.VERSIONS_KEY}_${document.id}`, JSON.stringify(versions));
    } catch (error) {
      console.error('Error saving version:', error);
      throw error;
    }
  }

  static async getVersions(documentId: string): Promise<ContentVersion[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.VERSIONS_KEY}_${documentId}`);
      if (data) {
        const versions = JSON.parse(data);
        return versions.map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp),
          content: {
            ...v.content,
            metadata: {
              ...v.content.metadata,
              createdAt: new Date(v.content.metadata.createdAt),
              updatedAt: new Date(v.content.metadata.updatedAt),
            },
          },
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting versions:', error);
      return [];
    }
  }

  static async restoreVersion(documentId: string, versionId: string): Promise<ContentDocument | null> {
    try {
      const versions = await this.getVersions(documentId);
      const version = versions.find(v => v.id === versionId);

      if (version) {
        const restoredDocument = { ...version.content };
        restoredDocument.metadata.updatedAt = new Date();
        restoredDocument.metadata.version = restoredDocument.metadata.version + 1;

        await this.saveDocument(restoredDocument);
        return restoredDocument;
      }

      return null;
    } catch (error) {
      console.error('Error restoring version:', error);
      return null;
    }
  }

  // Collaboration Features
  static async addCollaborator(document: ContentDocument, collaboratorEmail: string): Promise<ContentDocument> {
    const updatedDocument = {
      ...document,
      collaborators: [...(document.collaborators || []), collaboratorEmail],
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };

    await this.saveDocument(updatedDocument);
    return updatedDocument;
  }

  static async addComment(document: ContentDocument, comment: Omit<ContentComment, 'id' | 'timestamp'>): Promise<ContentDocument> {
    const newComment: ContentComment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const updatedDocument = {
      ...document,
      comments: [...(document.comments || []), newComment],
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };

    await this.saveDocument(updatedDocument);
    return updatedDocument;
  }

  // Export/Import
  static exportDocument(document: ContentDocument): string {
    return JSON.stringify(document, null, 2);
  }

  static importDocument(jsonData: string): ContentDocument {
    const document = JSON.parse(jsonData);

    // Convert date strings back to Date objects
    document.metadata.createdAt = new Date(document.metadata.createdAt);
    document.metadata.updatedAt = new Date(document.metadata.updatedAt);

    return document;
  }

  // SEO Optimization
  static optimizeSEO(document: ContentDocument): ContentDocument {
    const content = document.blocks
      .filter(block => block.type === 'text' || block.type === 'heading')
      .map(block => block.content)
      .join(' ');

    // Extract keywords (simple implementation)
    const words = content.toLowerCase().split(/\W+/);
    const wordFreq: { [key: string]: number } = {};

    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    // Generate description
    const description = content.substring(0, 160).replace(/\s+/g, ' ').trim();
    const finalDescription = description.length < content.length ? description + '...' : description;

    return {
      ...document,
      metadata: {
        ...document.metadata,
        seo: {
          ...document.metadata.seo,
          description: finalDescription,
          keywords,
        },
        updatedAt: new Date(),
      },
    };
  }

  // Content Analysis
  static analyzeContent(document: ContentDocument): {
    wordCount: number;
    readingTime: number;
    readabilityScore: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestions: string[];
  } {
    const content = document.blocks
      .filter(block => block.type === 'text' || block.type === 'heading')
      .map(block => block.content)
      .join(' ');

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentences;
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence));

    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'hate', 'dislike'];

    const positiveCount = positiveWords.reduce((count, word) =>
      count + (content.toLowerCase().split(word).length - 1), 0);
    const negativeCount = negativeWords.reduce((count, word) =>
      count + (content.toLowerCase().split(word).length - 1), 0);

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    const suggestions: string[] = [];
    if (wordCount < 300) suggestions.push('Consider adding more content for better SEO');
    if (readabilityScore < 60) suggestions.push('Consider simplifying your language for better readability');
    if (document.blocks.filter(b => b.type === 'heading').length === 0) {
      suggestions.push('Add headings to improve content structure');
    }

    return {
      wordCount,
      readingTime,
      readabilityScore,
      sentiment,
      suggestions,
    };
  }

  // Utility Methods
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  static getDocumentStatusColor(status: ContentDocument['metadata']['status']): string {
    switch (status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  }
}