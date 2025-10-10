import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('dark')} data-testid="set-dark-btn">
        Set Dark
      </button>
      <button onClick={() => setTheme('high_contrast')} data-testid="set-high-contrast-btn">
        Set High Contrast
      </button>
      <button onClick={() => setTheme('sepia')} data-testid="set-sepia-btn">
        Set Sepia
      </button>
      <button onClick={() => setTheme('solarized')} data-testid="set-solarized-btn">
        Set Solarized
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })

  it('loads theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('saves theme to localStorage when changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const darkButton = screen.getByTestId('set-dark-btn')
    fireEvent.click(darkButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('changes theme to high contrast', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const highContrastButton = screen.getByTestId('set-high-contrast-btn')
    fireEvent.click(highContrastButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'high_contrast')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('high_contrast')
  })

  it('changes theme to sepia', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const sepiaButton = screen.getByTestId('set-sepia-btn')
    fireEvent.click(sepiaButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'sepia')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('sepia')
  })

  it('changes theme to solarized', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const solarizedButton = screen.getByTestId('set-solarized-btn')
    fireEvent.click(solarizedButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'solarized')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('solarized')
  })

  it('persists theme changes across re-renders', () => {
    const { rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const darkButton = screen.getByTestId('set-dark-btn')
    fireEvent.click(darkButton)

    // Re-render the component
    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('throws error when useTheme is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    )

    consoleSpy.mockRestore()
  })

  it('handles invalid theme from localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should fall back to default 'light' theme
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })
})