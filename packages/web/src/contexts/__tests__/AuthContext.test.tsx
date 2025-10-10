import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}))

const { get: mockGet, set: mockSet, remove: mockRemove } = require('js-cookie')

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { isLoggedIn, user, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="is-logged-in">{isLoggedIn ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? user.name : 'null'}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('provides default auth state', () => {
    mockGet.mockReturnValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })

  it('initializes auth state from cookies', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'isLoggedIn') return 'true'
      return undefined
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('Admin User')
  })

  it('handles successful login', async () => {
    mockGet.mockReturnValue(undefined)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        token: 'jwt-token',
        refresh_token: 'refresh-token'
      }),
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByTestId('login-btn')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true')
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })

    expect(mockFetch).toHaveBeenCalledWith('https://api.storyblok-ai.example/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    })

    expect(mockSet).toHaveBeenCalledWith('isLoggedIn', 'true', { expires: 7 })
    expect(mockSet).toHaveBeenCalledWith('token', 'jwt-token', { expires: 7 })
    expect(mockSet).toHaveBeenCalledWith('refresh_token', 'refresh-token', { expires: 7 })
  })

  it('handles login failure', async () => {
    mockGet.mockReturnValue(undefined)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByTestId('login-btn')

    // Mock console.error to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    await expect(fireEvent.click(loginButton)).rejects.toThrow('Invalid credentials')

    consoleSpy.mockRestore()

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false')
  })

  it('handles logout', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'isLoggedIn') return 'true'
      return undefined
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const logoutButton = screen.getByTestId('logout-btn')
    fireEvent.click(logoutButton)

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(mockRemove).toHaveBeenCalledWith('isLoggedIn')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    )

    consoleSpy.mockRestore()
  })
})