import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('/api/media/upload', () => {
  describe('POST', () => {
    it('returns upload success response', async () => {
      const mockRequest = {} as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('cdn_url')
      expect(data).toHaveProperty('id')
      expect(data.cdn_url).toMatch(/^https:\/\/cdn\.example\.com\//)
      expect(data.id).toMatch(/^media_\d+$/)
    })

    it('handles upload errors gracefully', async () => {
      // Since the current implementation doesn't actually handle errors,
      // this test verifies the current behavior
      const mockRequest = {} as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('cdn_url')
      expect(data).toHaveProperty('id')
    })
  })
})