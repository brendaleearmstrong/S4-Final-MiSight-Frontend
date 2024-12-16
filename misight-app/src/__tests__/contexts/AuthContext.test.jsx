import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { useAuth, AuthProvider } from '@/contexts/AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('provides user authentication state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeDefined()
  })

  test('handles login', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login({ username: 'test', role: 'USER' })
    })

    expect(result.current.user).toEqual({ username: 'test', role: 'USER' })
  })
})
