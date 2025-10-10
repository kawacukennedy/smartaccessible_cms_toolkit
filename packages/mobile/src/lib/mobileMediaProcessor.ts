import { Alert } from 'react-native';

export interface MediaFile {
  id: string;
  uri: string;
  type: 'image' | 'video' | 'document';
  size: number;
  name: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    ocrText?: string;
    tags?: string[];
    altText?: string;
  };
}

export interface ProcessingOptions {
  enableOCR?: boolean;
  enableSmartTagging?: boolean;
  generateAltText?: boolean;
  validateFiles?: boolean;
}

export interface BatchProcessingResult {
  processed: MediaFile[];
  failed: { file: MediaFile; error: string }[];
  skipped: MediaFile[];
}

export class MobileMediaProcessor {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private static readonly SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/mov'];
  private static readonly SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'text/plain'];

  static validateFile(file: MediaFile): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 50MB limit' };
    }

    const supportedTypes = [
      ...this.SUPPORTED_IMAGE_TYPES,
      ...this.SUPPORTED_VIDEO_TYPES,
      ...this.SUPPORTED_DOCUMENT_TYPES
    ];

    if (!supportedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type' };
    }

    return { valid: true };
  }

  static async processOCR(imageUri: string): Promise<string> {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock OCR results based on image URI
    const mockTexts = [
      'Sample text extracted from image',
      'Document content: Lorem ipsum dolor sit amet',
      'Receipt: Total $25.99, Date: 2024-01-15',
      'Business card: John Doe, CEO, Tech Corp',
      'No text detected in image'
    ];

    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  static async generateSmartTags(mediaFile: MediaFile): Promise<string[]> {
    // Simulate AI-powered smart tagging
    await new Promise(resolve => setTimeout(resolve, 1500));

    const baseTags = ['media'];

    if (mediaFile.type === 'image') {
      baseTags.push('image', 'visual');
      // Add contextual tags based on filename/URI
      if (mediaFile.name.toLowerCase().includes('logo')) baseTags.push('logo', 'brand');
      if (mediaFile.name.toLowerCase().includes('photo')) baseTags.push('photo', 'personal');
      if (mediaFile.name.toLowerCase().includes('screenshot')) baseTags.push('screenshot', 'technical');
    } else if (mediaFile.type === 'video') {
      baseTags.push('video', 'multimedia');
      if (mediaFile.name.toLowerCase().includes('tutorial')) baseTags.push('tutorial', 'educational');
    } else if (mediaFile.type === 'document') {
      baseTags.push('document', 'text');
      if (mediaFile.name.toLowerCase().includes('pdf')) baseTags.push('pdf');
    }

    return Array.from(new Set(baseTags)); // Remove duplicates
  }

  static async generateAltText(mediaFile: MediaFile): Promise<string> {
    // Simulate AI alt text generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const descriptions = {
      image: 'Descriptive image showing visual content',
      video: 'Video content with motion and audio',
      document: 'Document containing text information'
    };

    return `${descriptions[mediaFile.type]} - ${mediaFile.name}`;
  }

  static async processSingleFile(
    file: MediaFile,
    options: ProcessingOptions = {}
  ): Promise<MediaFile> {
    const processedFile = { ...file };

    if (options.validateFiles) {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }

    processedFile.metadata = processedFile.metadata || {};

    if (options.enableOCR && file.type === 'image') {
      try {
        processedFile.metadata.ocrText = await this.processOCR(file.uri);
      } catch (error) {
        console.warn('OCR processing failed:', error);
      }
    }

    if (options.enableSmartTagging) {
      try {
        processedFile.metadata.tags = await this.generateSmartTags(file);
      } catch (error) {
        console.warn('Smart tagging failed:', error);
        processedFile.metadata.tags = ['media'];
      }
    }

    if (options.generateAltText) {
      try {
        processedFile.metadata.altText = await this.generateAltText(file);
      } catch (error) {
        console.warn('Alt text generation failed:', error);
        processedFile.metadata.altText = `Media file: ${file.name}`;
      }
    }

    return processedFile;
  }

  static async processBatch(
    files: MediaFile[],
    options: ProcessingOptions = {},
    onProgress?: (processed: number, total: number) => void
  ): Promise<BatchProcessingResult> {
    const result: BatchProcessingResult = {
      processed: [],
      failed: [],
      skipped: []
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const processedFile = await this.processSingleFile(file, options);
        result.processed.push(processedFile);
      } catch (error) {
        result.failed.push({
          file,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      onProgress?.(i + 1, files.length);
    }

    return result;
  }

  static async extractMetadata(file: MediaFile): Promise<Partial<MediaFile['metadata']>> {
    // Simulate metadata extraction
    await new Promise(resolve => setTimeout(resolve, 500));

    if (file.type === 'image') {
      return {
        width: Math.floor(Math.random() * 2000) + 800,
        height: Math.floor(Math.random() * 2000) + 600,
      };
    } else if (file.type === 'video') {
      return {
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      };
    }

    return {};
  }

  static showProcessingAlert(result: BatchProcessingResult): void {
    const { processed, failed, skipped } = result;

    let message = `Processed: ${processed.length}`;
    if (failed.length > 0) message += `\nFailed: ${failed.length}`;
    if (skipped.length > 0) message += `\nSkipped: ${skipped.length}`;

    Alert.alert(
      'Batch Processing Complete',
      message,
      [
        { text: 'OK' }
      ]
    );
  }
}