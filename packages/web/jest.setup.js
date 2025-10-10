import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: () => 'Menu',
  Search: () => 'Search',
  Bell: () => 'Bell',
  User: () => 'User',
  Sun: () => 'Sun',
  Moon: () => 'Moon',
  Undo: () => 'Undo',
  Redo: () => 'Redo',
  Save: () => 'Save',
  Send: () => 'Send',
  Shield: () => 'Shield',
  Sparkles: () => 'Sparkles',
  Eye: () => 'Eye',
  Sidebar: () => 'Sidebar',
  Lightbulb: () => 'Lightbulb',
  PlusCircle: () => 'PlusCircle',
  FileText: () => 'FileText',
  GripVerticalIcon: () => 'GripVerticalIcon',
  Edit3: () => 'Edit3',
  MoreVertical: () => 'MoreVertical',
}))

// Mock react-dnd
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => children,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{}, jest.fn()],
}))

jest.mock('react-dnd-html5-backend', () => ({}))

// Mock IndexedDB
const mockIndexedDB = {
  openDB: jest.fn(),
  deleteDB: jest.fn(),
}

global.indexedDB = mockIndexedDB

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})