import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AIPanel from '../AIPanel'

// Mock the child components
jest.mock('../AISuggestionsPanel', () => {
  return function MockAISuggestionsPanel({ onApplySuggestion }: { onApplySuggestion: (suggestion: any) => void }) {
    return <div data-testid="ai-suggestions-panel">AI Suggestions Panel</div>
  }
})

jest.mock('../AccessibilityDashboard', () => {
  return function MockAccessibilityDashboard() {
    return <div data-testid="accessibility-dashboard">Accessibility Dashboard</div>
  }
})

// Mock the contexts
jest.mock('../../../contexts/UndoRedoContext', () => ({
  useUndoRedo: () => ({
    currentContent: 'Sample content for testing'
  })
}))

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotifications: () => ({
    addNotification: jest.fn()
  })
}))

describe('AIPanel', () => {
  const mockOnApplySuggestion = jest.fn()
  const mockTogglePanel = jest.fn()
  const mockOnAIScanRequest = jest.fn()

  const defaultProps = {
    onApplySuggestion: mockOnApplySuggestion,
    aiScanStatus: 'idle' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    })
  })

  it('renders desktop version by default', () => {
    render(<AIPanel {...defaultProps} />)

    expect(screen.getByText('AI Suggestions')).toBeInTheDocument()
    expect(screen.getByText('Accessibility Issues')).toBeInTheDocument()
    expect(screen.getByText('Tone & Readability')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByTestId('ai-suggestions-panel')).toBeInTheDocument()
  })

  it('displays AI scan status when not idle', () => {
    render(<AIPanel {...defaultProps} aiScanStatus="running" />)

    expect(screen.getByText('AI scan in progress…')).toBeInTheDocument()
  })

  it('displays different AI scan statuses', () => {
    const { rerender } = render(<AIPanel {...defaultProps} aiScanStatus="queued" />)
    expect(screen.getByText('AI scan queued')).toBeInTheDocument()

    rerender(<AIPanel {...defaultProps} aiScanStatus="done" />)
    expect(screen.getByText('AI scan complete')).toBeInTheDocument()

    rerender(<AIPanel {...defaultProps} aiScanStatus="failed" />)
    expect(screen.getByText('AI scan failed. Retry?')).toBeInTheDocument()
  })

  it('renders mobile offcanvas version when responsive and mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    })

    render(<AIPanel {...defaultProps} isResponsive={true} isOpen={true} togglePanel={mockTogglePanel} />)

    expect(screen.getByText('AI Panel')).toBeInTheDocument()
    expect(screen.getByLabelText('Close AI Panel')).toBeInTheDocument()
  })

  it('renders tablet bottom drawer version when responsive and tablet width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })

    render(<AIPanel {...defaultProps} isResponsive={true} isOpen={true} togglePanel={mockTogglePanel} />)

    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getByText('Variations')).toBeInTheDocument()
  })

  it('calls togglePanel when close button is clicked in mobile mode', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    })

    render(<AIPanel {...defaultProps} isResponsive={true} isOpen={true} togglePanel={mockTogglePanel} />)

    const closeButton = screen.getByLabelText('Close AI Panel')
    fireEvent.click(closeButton)

    expect(mockTogglePanel).toHaveBeenCalledTimes(1)
  })

  it('calls togglePanel when close button is clicked in tablet mode', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })

    render(<AIPanel {...defaultProps} isResponsive={true} isOpen={true} togglePanel={mockTogglePanel} />)

    const closeButton = screen.getByLabelText('Close AI Panel')
    fireEvent.click(closeButton)

    expect(mockTogglePanel).toHaveBeenCalledTimes(1)
  })

  it('switches tabs in desktop mode', () => {
    render(<AIPanel {...defaultProps} />)

    const accessibilityTab = screen.getByText('Accessibility Issues')
    fireEvent.click(accessibilityTab)

    expect(screen.getByTestId('accessibility-dashboard')).toBeInTheDocument()
  })

  it('switches tabs in tablet mode', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })

    render(<AIPanel {...defaultProps} isResponsive={true} />)

    const suggestionsTab = screen.getByText('Suggestions')
    fireEvent.click(suggestionsTab)

    expect(screen.getByTestId('ai-suggestions-panel')).toBeInTheDocument()
  })

  it('handles variation generation in tablet mode', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })

    render(<AIPanel {...defaultProps} isResponsive={true} onAIScanRequest={mockOnAIScanRequest} />)

    const variationsTab = screen.getByText('Variations')
    fireEvent.click(variationsTab)

    const promptTextarea = screen.getByLabelText('Enter prompt for AI content variation')
    const generateButton = screen.getByLabelText('Generate AI content variation')

    fireEvent.change(promptTextarea, { target: { value: 'Make it shorter' } })
    fireEvent.click(generateButton)

    expect(mockOnAIScanRequest).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Based on your prompt: "Make it shorter"/)).toBeInTheDocument()
  })

  it('shows generated variation content', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })

    render(<AIPanel {...defaultProps} isResponsive={true} onAIScanRequest={mockOnAIScanRequest} />)

    const variationsTab = screen.getByText('Variations')
    fireEvent.click(variationsTab)

    const promptTextarea = screen.getByLabelText('Enter prompt for AI content variation')
    const generateButton = screen.getByLabelText('Generate AI content variation')

    fireEvent.change(promptTextarea, { target: { value: 'Test prompt' } })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Variation:')).toBeInTheDocument()
    expect(screen.getByText(/Sample content for testing/)).toBeInTheDocument()
  })

  it('handles window resize events when responsive', () => {
    const mockResize = jest.fn()
    window.addEventListener = mockResize

    render(<AIPanel {...defaultProps} isResponsive={true} />)

    expect(mockResize).toHaveBeenCalled()

    window.removeEventListener = jest.fn()
  })

  it('does not add resize listeners when not responsive', () => {
    const mockResize = jest.fn()
    window.addEventListener = mockResize

    render(<AIPanel {...defaultProps} />)

    expect(mockResize).not.toHaveBeenCalled()
  })
})