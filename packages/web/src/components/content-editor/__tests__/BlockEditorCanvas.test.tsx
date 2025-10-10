import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlockEditorCanvas from '../BlockEditorCanvas'

// Mock the IndexedDB function
jest.mock('../../../lib/db/indexedDB', () => ({
  saveContentToIndexedDB: jest.fn(),
}))

// Mock TiptapBlock component
jest.mock('../TiptapBlock', () => {
  return function MockTiptapBlock({ content, onChange }: { content: string; onChange: (content: string) => void }) {
    return (
      <div data-testid="tiptap-block">
        <input
          value={content}
          onChange={(e) => onChange(e.target.value)}
          data-testid="tiptap-input"
        />
      </div>
    )
  }
})

// Mock BlockContextMenu component
jest.mock('../BlockContextMenu', () => {
  return function MockBlockContextMenu({
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown
  }: {
    blockId: string;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onViewSuggestions: () => void;
    onViewAlerts: () => void;
    hasSuggestions: boolean;
    hasAlerts: boolean;
  }) {
    return (
      <div data-testid="block-context-menu">
        <button onClick={onDuplicate} data-testid="duplicate-btn">Duplicate</button>
        <button onClick={onDelete} data-testid="delete-btn">Delete</button>
        <button onClick={onMoveUp} data-testid="move-up-btn">Move Up</button>
        <button onClick={onMoveDown} data-testid="move-down-btn">Move Down</button>
      </div>
    )
  }
})

describe('BlockEditorCanvas', () => {
  const mockOnContentChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty canvas initially', () => {
    render(<BlockEditorCanvas />)

    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
    expect(screen.getByText('Hero')).toBeInTheDocument()
    expect(screen.getByText('CTA')).toBeInTheDocument()
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('renders initial content when provided', () => {
    const initialContent = JSON.stringify([
      {
        id: '1',
        type: 'TextBlock',
        meta: { created_by: 'user', created_at: '2023-01-01', version: 1 },
        payload: { content: 'Initial content' },
        accessibility_meta: {}
      }
    ])

    render(<BlockEditorCanvas initialContent={initialContent} />)

    expect(screen.getByText('Initial content')).toBeInTheDocument()
  })

  it('adds a new text block when text button is clicked', async () => {
    render(<BlockEditorCanvas onContentChange={mockOnContentChange} />)

    const textButton = screen.getByText('Text')
    fireEvent.click(textButton)

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled()
    })

    const callArgs = mockOnContentChange.mock.calls[0][0]
    const parsedContent = JSON.parse(callArgs)
    expect(parsedContent).toHaveLength(1)
    expect(parsedContent[0].type).toBe('TextBlock')
    expect(parsedContent[0].payload.content).toBe('New TextBlock block')
  })

  it('adds different types of blocks', async () => {
    render(<BlockEditorCanvas onContentChange={mockOnContentChange} />)

    const imageButton = screen.getByText('Image')
    const heroButton = screen.getByText('Hero')
    const ctaButton = screen.getByText('CTA')
    const customButton = screen.getByText('Custom')

    fireEvent.click(imageButton)
    fireEvent.click(heroButton)
    fireEvent.click(ctaButton)
    fireEvent.click(customButton)

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalledTimes(4)
    })

    const lastCallArgs = mockOnContentChange.mock.calls[3][0]
    const parsedContent = JSON.parse(lastCallArgs)
    expect(parsedContent).toHaveLength(4)
    expect(parsedContent[0].type).toBe('ImageBlock')
    expect(parsedContent[1].type).toBe('Hero')
    expect(parsedContent[2].type).toBe('CTA')
    expect(parsedContent[3].type).toBe('Custom')
  })

  it('edits a block when edit button is clicked', async () => {
    const initialContent = JSON.stringify([
      {
        id: '1',
        type: 'TextBlock',
        meta: { created_by: 'user', created_at: '2023-01-01', version: 1 },
        payload: { content: 'Original content' },
        accessibility_meta: {}
      }
    ])

    render(<BlockEditorCanvas initialContent={initialContent} onContentChange={mockOnContentChange} />)

    const editButton = screen.getByTitle('Edit block')
    fireEvent.click(editButton)

    expect(screen.getByTestId('tiptap-block')).toBeInTheDocument()

    const input = screen.getByTestId('tiptap-input')
    fireEvent.change(input, { target: { value: 'Updated content' } })

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled()
    })
  })

  it('duplicates a block', async () => {
    const initialContent = JSON.stringify([
      {
        id: '1',
        type: 'TextBlock',
        meta: { created_by: 'user', created_at: '2023-01-01', version: 1 },
        payload: { content: 'Original content' },
        accessibility_meta: {}
      }
    ])

    render(<BlockEditorCanvas initialContent={initialContent} onContentChange={mockOnContentChange} />)

    const duplicateButton = screen.getByTestId('duplicate-btn')
    fireEvent.click(duplicateButton)

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled()
    })

    const callArgs = mockOnContentChange.mock.calls[0][0]
    const parsedContent = JSON.parse(callArgs)
    expect(parsedContent).toHaveLength(2)
    expect(parsedContent[0].payload.content).toBe('Original content')
    expect(parsedContent[1].payload.content).toBe('Original content')
    expect(parsedContent[0].id).not.toBe(parsedContent[1].id)
  })

  it('deletes a block', async () => {
    const initialContent = JSON.stringify([
      {
        id: '1',
        type: 'TextBlock',
        meta: { created_by: 'user', created_at: '2023-01-01', version: 1 },
        payload: { content: 'Content to delete' },
        accessibility_meta: {}
      }
    ])

    render(<BlockEditorCanvas initialContent={initialContent} onContentChange={mockOnContentChange} />)

    const deleteButton = screen.getByTestId('delete-btn')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled()
    })

    const callArgs = mockOnContentChange.mock.calls[0][0]
    const parsedContent = JSON.parse(callArgs)
    expect(parsedContent).toHaveLength(0)
  })

  it('saves content to IndexedDB when blocks change', async () => {
    const { saveContentToIndexedDB } = require('../../../lib/db/indexedDB')

    render(<BlockEditorCanvas onContentChange={mockOnContentChange} />)

    const textButton = screen.getByText('Text')
    fireEvent.click(textButton)

    await waitFor(() => {
      expect(saveContentToIndexedDB).toHaveBeenCalledWith('editor-content', expect.any(String))
    })
  })

  it('handles invalid initial content gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<BlockEditorCanvas initialContent="invalid json" />)

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(screen.getByText('Text')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})