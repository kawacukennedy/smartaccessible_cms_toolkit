import { POST, GET } from '../route'
import { NextRequest } from 'next/server'

// Mock the AI analysis function
jest.mock('../../../../lib/ai', () => ({
  runAIAnalysis: jest.fn(),
}))

describe('/api/ai/scan', () => {
  describe('POST', () => {
    it('should return task ID for valid request', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          workspace_id: 'workspace_1',
          content_snapshot: '[{"type":"TextBlock","payload":{"content":"Test content"}}]',
          scan_types: ['readability', 'accessibility'],
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('task_id')
      expect(data.status).toBe('done')
      expect(data.results).toHaveProperty('suggestions')
    })

    it('should return 400 for invalid request', async () => {
      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request')
    })

    it('should generate suggestions for text content', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          workspace_id: 'workspace_1',
          content_snapshot: '[{"type":"TextBlock","payload":{"content":"This is a very long sentence that should trigger a readability suggestion."}}]',
          scan_types: ['readability'],
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(data.results.suggestions).toBeDefined()
      expect(data.results.suggestions.length).toBeGreaterThan(0)
      expect(data.results.suggestions[0]).toHaveProperty('type', 'readability')
    })

    it('should generate accessibility suggestions for images without alt text', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          workspace_id: 'workspace_1',
          content_snapshot: '[{"type":"ImageBlock","payload":{"content":"image.jpg"},"accessibility_meta":{}}]',
          scan_types: ['accessibility'],
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(data.results.suggestions).toBeDefined()
      expect(data.results.suggestions.length).toBeGreaterThan(0)
      expect(data.results.suggestions[0]).toHaveProperty('type', 'accessibility')
    })
  })

  describe('GET', () => {
    it('should return task status and results', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/ai/scan?taskId=test-task-123',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.task_id).toBe('test-task-123')
      expect(data.status).toBe('done')
      expect(data.results).toHaveProperty('suggestions')
    })

    it('should return 400 when taskId is missing', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/ai/scan',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Task ID required')
    })
  })
})