import { AdvancedMediaProcessor } from '../mediaProcessor';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock File and FileReader
const mockFile = {
  name: 'test-image.jpg',
  size: 1024,
  type: 'image/jpeg',
  arrayBuffer: jest.fn(),
};

const mockFileReader = {
  readAsArrayBuffer: jest.fn(),
  readAsDataURL: jest.fn(),
  onload: null,
  onerror: null,
  result: 'mock-data-url',
};

global.File = jest.fn(() => mockFile) as any;
global.FileReader = jest.fn(() => mockFileReader) as any;

// Mock Image for OCR
const mockImage = {
  onload: null,
  onerror: null,
  src: '',
};
global.Image = jest.fn(() => mockImage) as any;

// Mock canvas for image processing
const mockCanvas = {
  getContext: jest.fn(() => ({
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(100),
      width: 10,
      height: 10,
    })),
  })),
  toDataURL: jest.fn(() => 'mock-canvas-data'),
  width: 100,
  height: 100,
};
global.HTMLCanvasElement = jest.fn(() => mockCanvas) as any;

describe('Advanced Media Processor Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe('AdvancedMediaProcessor', () => {
    it('should initialize media processor', () => {
      const processor = new AdvancedMediaProcessor();
      expect(processor).toBeInstanceOf(AdvancedMediaProcessor);
    });

    it('should process image files with OCR', async () => {
      const processor = new AdvancedMediaProcessor();
      const file = new File([], 'test.jpg');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          text: 'Extracted text from image',
          confidence: 0.95,
        }),
      });

      const result = await processor.processImage(file, {
        enableOCR: true,
        enableTagging: true,
      });

      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('tags');
      expect(result).toHaveProperty('metadata');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should process video files', async () => {
      const processor = new AdvancedMediaProcessor();
      const file = new File([], 'test.mp4');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          duration: 120,
          thumbnail: 'thumbnail-url',
          transcription: 'Video transcription text',
        }),
      });

      const result = await processor.processVideo(file, {
        generateThumbnail: true,
        enableTranscription: true,
      });

      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('thumbnail');
      expect(result).toHaveProperty('transcription');
    });

    it('should process audio files', async () => {
      const processor = new AdvancedMediaProcessor();
      const file = new File([], 'test.mp3');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          duration: 180,
          transcription: 'Audio transcription text',
          language: 'en',
        }),
      });

      const result = await processor.processAudio(file, {
        enableTranscription: true,
        detectLanguage: true,
      });

      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('transcription');
      expect(result).toHaveProperty('language');
    });

    it('should handle batch processing', async () => {
      const processor = new AdvancedMediaProcessor();
      const files = [
        new File([], 'image1.jpg'),
        new File([], 'image2.jpg'),
        new File([], 'video1.mp4'),
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ text: 'Text 1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ text: 'Text 2' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ duration: 60 }),
        });

      const results = await processor.processBatch(files, {
        enableOCR: true,
        enableTagging: true,
      });

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should generate smart tags', async () => {
      const processor = new AdvancedMediaProcessor();
      const file = new File([], 'test.jpg');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          tags: ['nature', 'landscape', 'sunset'],
          confidence: 0.87,
        }),
      });

      const result = await processor.generateTags(file);

      expect(result.tags).toContain('nature');
      expect(result.tags).toContain('landscape');
      expect(result.confidence).toBe(0.87);
    });

    it('should optimize images', async () => {
      const processor = new AdvancedMediaProcessor();
      const file = new File([], 'large-image.jpg');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          optimizedUrl: 'optimized-image-url',
          originalSize: 2048000,
          optimizedSize: 512000,
          compressionRatio: 0.25,
        }),
      });

      const result = await processor.optimizeImage(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      });

      expect(result.optimizedUrl).toBe('optimized-image-url');
      expect(result.compressionRatio).toBe(0.25);
    });

    it('should search media by content', async () => {
      const processor = new AdvancedMediaProcessor();

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { id: '1', score: 0.95, metadata: { tags: ['test'] } },
            { id: '2', score: 0.87, metadata: { tags: ['sample'] } },
          ],
          total: 2,
        }),
      });

      const results = await processor.searchByContent('test query', {
        limit: 10,
        threshold: 0.8,
      });

      expect(results.results).toHaveLength(2);
      expect(results.total).toBe(2);
      expect(results.results[0].score).toBe(0.95);
    });

    it('should handle processing errors gracefully', async () => {
      const processor = new AdvancedMediaProcessor();

      mockFetch.mockRejectedValue(new Error('API error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(processor.processImage(new File([], 'test.jpg')))
        .rejects.toThrow('API error');

      consoleSpy.mockRestore();
    });

    it('should validate file types', () => {
      const processor = new AdvancedMediaProcessor();

      expect(() => processor.validateFileType(new File([], 'test.txt'), ['image/jpeg']))
        .toThrow('Unsupported file type');

      expect(() => processor.validateFileType(new File([], 'test.jpg'), ['image/jpeg']))
        .not.toThrow();
    });

    it('should generate processing queue', () => {
      const processor = new AdvancedMediaProcessor();
      const files = [
        new File([], 'image1.jpg'),
        new File([], 'video1.mp4'),
        new File([], 'audio1.mp3'),
      ];

      const queue = processor.createProcessingQueue(files, {
        priority: 'high',
        concurrent: 2,
      });

      expect(queue).toHaveProperty('items');
      expect(queue).toHaveProperty('priority');
      expect(queue).toHaveProperty('maxConcurrent');
      expect(queue.items).toHaveLength(3);
    });

    it('should track processing progress', async () => {
      const processor = new AdvancedMediaProcessor();
      const progressCallback = jest.fn();

      processor.onProgress(progressCallback);

      // Simulate progress updates
      processor.emitProgress(50, 'Processing image...');

      expect(progressCallback).toHaveBeenCalledWith(50, 'Processing image...');
    });

    it('should handle large file uploads with chunking', async () => {
      const processor = new AdvancedMediaProcessor();
      const largeFile = new File([], 'large-video.mp4');
      Object.defineProperty(largeFile, 'size', { value: 100 * 1024 * 1024 }); // 100MB

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ uploadId: 'chunked-upload-123' }),
      });

      const result = await processor.uploadLargeFile(largeFile, {
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
      });

      expect(result.uploadId).toBe('chunked-upload-123');
      expect(mockFetch).toHaveBeenCalledTimes(20); // 100MB / 5MB = 20 chunks
    });
  });
});