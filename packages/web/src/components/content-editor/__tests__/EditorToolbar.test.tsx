import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditorToolbar from '../EditorToolbar'

// Mock the useUndoRedo hook
jest.mock('../../../contexts/UndoRedoContext', () => ({
  useUndoRedo: () => ({
    undo: jest.fn(),
    redo: jest.fn(),
    canUndo: true,
    canRedo: false,
  }),
}))

describe('EditorToolbar', () => {
  const defaultProps = {
    onSaveDraft: jest.fn(),
    onPublish: jest.fn(),
    onToggleAIAssist: jest.fn(),
    isAiAssistEnabled: false,
    accessibilityScore: 85,
    isOffline: false,
    isSaving: false,
    onToggleSidebar: jest.fn(),
    onToggleAIPanel: jest.fn(),
    onTogglePreview: jest.fn(),
    isPreviewPaneOpen: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all toolbar buttons', () => {
    render(<EditorToolbar {...defaultProps} />)

    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument()
  })

  it('displays accessibility score', () => {
    render(<EditorToolbar {...defaultProps} />)

    expect(screen.getByText('85')).toBeInTheDocument()
  })

  it('calls onSaveDraft when save button is clicked', () => {
    render(<EditorToolbar {...defaultProps} />)

    const saveButton = screen.getByRole('button', { name: /save draft/i })
    fireEvent.click(saveButton)

    expect(defaultProps.onSaveDraft).toHaveBeenCalledTimes(1)
  })

  it('calls onPublish when publish button is clicked', () => {
    render(<EditorToolbar {...defaultProps} />)

    const publishButton = screen.getByRole('button', { name: /publish/i })
    fireEvent.click(publishButton)

    expect(defaultProps.onPublish).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleAIAssist when AI assist button is clicked', () => {
    render(<EditorToolbar {...defaultProps} />)

    const aiButton = screen.getByRole('button', { name: /ai assist/i })
    fireEvent.click(aiButton)

    expect(defaultProps.onToggleAIAssist).toHaveBeenCalledTimes(1)
  })

  it('shows saving state when isSaving is true', () => {
    render(<EditorToolbar {...defaultProps} isSaving={true} />)

    expect(screen.getByText(/saving/i)).toBeInTheDocument()
  })

  it('disables save button when saving', () => {
    render(<EditorToolbar {...defaultProps} isSaving={true} />)

    const saveButton = screen.getByRole('button', { name: /saving/i })
    expect(saveButton).toBeDisabled()
  })

  it('shows offline publish text when offline', () => {
    render(<EditorToolbar {...defaultProps} isOffline={true} />)

    expect(screen.getByRole('button', { name: /queue publish/i })).toBeInTheDocument()
  })

  it('calls toggle functions when respective buttons are clicked', () => {
    render(<EditorToolbar {...defaultProps} />)

    const sidebarButton = screen.getByRole('button', { name: /sidebar/i })
    const aiPanelButton = screen.getByRole('button', { name: /ai panel/i })
    const previewButton = screen.getByRole('button', { name: /preview/i })

    fireEvent.click(sidebarButton)
    fireEvent.click(aiPanelButton)
    fireEvent.click(previewButton)

    expect(defaultProps.onToggleSidebar).toHaveBeenCalledTimes(1)
    expect(defaultProps.onToggleAIPanel).toHaveBeenCalledTimes(1)
    expect(defaultProps.onTogglePreview).toHaveBeenCalledTimes(1)
  })
})