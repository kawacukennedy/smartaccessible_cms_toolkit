import {
  saveContentToIndexedDB,
  getContentFromIndexedDB,
  getAllOfflineContent,
  deleteContentFromIndexedDB,
} from '../indexedDB'

// Mock idb
jest.mock('idb', () => ({
  openDB: jest.fn(),
}))

describe('IndexedDB Utils', () => {
  const mockDB = {
    put: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock the initDB function to return our mock DB
    jest.doMock('../indexedDB', () => ({
      ...jest.requireActual('../indexedDB'),
      initDB: jest.fn().mockResolvedValue(mockDB),
    }))
  })

  describe('saveContentToIndexedDB', () => {
    it('should save content to IndexedDB', async () => {
      const { saveContentToIndexedDB } = require('../indexedDB')

      await saveContentToIndexedDB('test-id', 'test content')

      expect(mockDB.put).toHaveBeenCalledWith('offlineContent', {
        id: 'test-id',
        content: 'test content',
        timestamp: expect.any(Number),
        status: 'draft',
      })
    })

    it('should save content with custom status', async () => {
      const { saveContentToIndexedDB } = require('../indexedDB')

      await saveContentToIndexedDB('test-id', 'test content', 'pending_sync')

      expect(mockDB.put).toHaveBeenCalledWith('offlineContent', {
        id: 'test-id',
        content: 'test content',
        timestamp: expect.any(Number),
        status: 'pending_sync',
      })
    })
  })

  describe('getContentFromIndexedDB', () => {
    it('should retrieve content from IndexedDB', async () => {
      const mockContent = {
        id: 'test-id',
        content: 'test content',
        timestamp: Date.now(),
        status: 'draft',
      }
      mockDB.get.mockResolvedValue(mockContent)

      const { getContentFromIndexedDB } = require('../indexedDB')

      const result = await getContentFromIndexedDB('test-id')

      expect(mockDB.get).toHaveBeenCalledWith('offlineContent', 'test-id')
      expect(result).toEqual(mockContent)
    })

    it('should return undefined for non-existent content', async () => {
      mockDB.get.mockResolvedValue(undefined)

      const { getContentFromIndexedDB } = require('../indexedDB')

      const result = await getContentFromIndexedDB('non-existent')

      expect(result).toBeUndefined()
    })
  })

  describe('getAllOfflineContent', () => {
    it('should retrieve all offline content', async () => {
      const mockContents = [
        { id: '1', content: 'content 1', timestamp: Date.now(), status: 'draft' },
        { id: '2', content: 'content 2', timestamp: Date.now(), status: 'pending_sync' },
      ]
      mockDB.getAll.mockResolvedValue(mockContents)

      const { getAllOfflineContent } = require('../indexedDB')

      const result = await getAllOfflineContent()

      expect(mockDB.getAll).toHaveBeenCalledWith('offlineContent')
      expect(result).toEqual(mockContents)
    })
  })

  describe('deleteContentFromIndexedDB', () => {
    it('should delete content from IndexedDB', async () => {
      const { deleteContentFromIndexedDB } = require('../indexedDB')

      await deleteContentFromIndexedDB('test-id')

      expect(mockDB.delete).toHaveBeenCalledWith('offlineContent', 'test-id')
    })
  })
})