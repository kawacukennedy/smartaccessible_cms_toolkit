import { GET, POST, PUT } from '../route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('../../../../lib/db/prisma', () => ({
  prisma: {
    contentBlock: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const { prisma } = require('../../../../lib/db/prisma')

describe('/api/content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns all content when no id is provided', async () => {
      const mockContents = [
        { id: '1', title: 'Test Content 1', content: 'Content 1' },
        { id: '2', title: 'Test Content 2', content: 'Content 2' },
      ]
      prisma.contentBlock.findMany.mockResolvedValue(mockContents)

      const mockRequest = {
        url: 'http://localhost:3000/api/content',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockContents)
      expect(prisma.contentBlock.findMany).toHaveBeenCalledTimes(1)
    })

    it('returns specific content when id is provided', async () => {
      const mockContent = { id: '1', title: 'Test Content', content: 'Test content' }
      prisma.contentBlock.findUnique.mockResolvedValue(mockContent)

      const mockRequest = {
        url: 'http://localhost:3000/api/content?id=1',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockContent)
      expect(prisma.contentBlock.findUnique).toHaveBeenCalledWith({ where: { id: '1' } })
    })

    it('returns 404 when content not found', async () => {
      prisma.contentBlock.findUnique.mockResolvedValue(null)

      const mockRequest = {
        url: 'http://localhost:3000/api/content?id=nonexistent',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.message).toBe('Content not found')
    })

    it('returns 500 on database error', async () => {
      prisma.contentBlock.findMany.mockRejectedValue(new Error('Database error'))

      const mockRequest = {
        url: 'http://localhost:3000/api/content',
      } as NextRequest

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal Server Error')
    })
  })

  describe('POST', () => {
    it('creates new content successfully', async () => {
      const mockContent = { id: '1', title: 'New Content', content: 'New content' }
      const requestBody = { title: 'New Content', content: 'New content' }

      prisma.contentBlock.create.mockResolvedValue(mockContent)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockContent)
      expect(prisma.contentBlock.create).toHaveBeenCalledWith({ data: requestBody })
    })

    it('returns 500 on creation error', async () => {
      prisma.contentBlock.create.mockRejectedValue(new Error('Creation error'))

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ title: 'Test', content: 'Test' }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal Server Error')
    })
  })

  describe('PUT', () => {
    it('updates content successfully', async () => {
      const mockContent = { id: '1', title: 'Updated Content', content: 'Updated content' }
      const requestBody = { title: 'Updated Content', content: 'Updated content' }

      prisma.contentBlock.update.mockResolvedValue(mockContent)

      const mockRequest = {
        url: 'http://localhost:3000/api/content?id=1',
        json: jest.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest

      const response = await PUT(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockContent)
      expect(prisma.contentBlock.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: requestBody
      })
    })

    it('returns 400 when id is missing', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/content',
        json: jest.fn().mockResolvedValue({ title: 'Test' }),
      } as unknown as NextRequest

      const response = await PUT(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('ID required')
    })

    it('returns 500 on update error', async () => {
      prisma.contentBlock.update.mockRejectedValue(new Error('Update error'))

      const mockRequest = {
        url: 'http://localhost:3000/api/content?id=1',
        json: jest.fn().mockResolvedValue({ title: 'Test' }),
      } as unknown as NextRequest

      const response = await PUT(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal Server Error')
    })
  })
})