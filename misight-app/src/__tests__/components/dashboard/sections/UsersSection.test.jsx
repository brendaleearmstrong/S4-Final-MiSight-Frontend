// src/__tests__/components/dashboard/sections/UsersSection.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UsersSection } from '@/components/dashboard/sections/UsersSection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    users: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('UsersSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      role: 'ADMIN',
      privileges: ['READ', 'WRITE', 'DELETE']
    },
    {
      id: 2,
      username: 'user1',
      role: 'USER',
      privileges: ['READ']
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.users.getAll.mockResolvedValue(mockUsers)
  })

  test('renders users management interface', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Users Management')).toBeInTheDocument()
      expect(screen.getByText('Add User')).toBeInTheDocument()
    })

    // Check table headers
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Privileges')).toBeInTheDocument()
  })

  test('handles user creation', async () => {
    const newUser = {
      username: 'newuser',
      password: 'password123',
      role: 'USER',
    }

    endpoints.users.create.mockResolvedValueOnce({
      id: 3,
      ...newUser,
      privileges: ['READ']
    })

    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    // Open modal
    fireEvent.click(screen.getByText('Add User'))

    // Fill form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: newUser.username }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: newUser.password }
    })
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: newUser.role }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(endpoints.users.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role
        })
      )
    })
  })

  test('validates required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByText('Add User'))
    
    const createButton = await screen.findByRole('button', { name: /create/i })
    fireEvent.click(createButton)

    await waitFor(() => {
      // Check for required field validations
      const requiredFields = screen.getAllByText(/required/i)
      expect(requiredFields.length).toBeGreaterThan(0)
    })
  })

  test('handles user deletion with confirmation', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    // Mock confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true)

    // Find and click delete button
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(endpoints.users.delete).toHaveBeenCalledWith(mockUsers[0].id)
      expect(window.confirm).toHaveBeenCalled()
    })
  })

  test('updates existing user', async () => {
    const updatedUser = {
      ...mockUsers[1],
      role: 'MINE_ADMIN'
    }

    endpoints.users.update.mockResolvedValueOnce(updatedUser)

    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument()
    })

    // Click edit button
    const editButton = screen.getAllByRole('button', { name: /edit/i })[1]
    fireEvent.click(editButton)

    // Update role
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'MINE_ADMIN' }
    })

    // Submit updates
    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(endpoints.users.update).toHaveBeenCalledWith(
        mockUsers[1].id,
        expect.objectContaining({
          role: 'MINE_ADMIN'
        })
      )
    })
  })

  test('displays user privileges correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('READ, WRITE, DELETE')).toBeInTheDocument()
      expect(screen.getByText('READ')).toBeInTheDocument()
    })
  })

  test('handles password updates', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument()
    })

    // Click edit button
    const editButton = screen.getAllByRole('button', { name: /edit/i })[1]
    fireEvent.click(editButton)

    // Update password
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'newpassword123' }
    })

    // Submit updates
    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(endpoints.users.update).toHaveBeenCalledWith(
        mockUsers[1].id,
        expect.objectContaining({
          password: 'newpassword123'
        })
      )
    })
  })

  test('handles API errors gracefully', async () => {
    endpoints.users.create.mockRejectedValueOnce(new Error('API Error'))

    render(
      <QueryClientProvider client={queryClient}>
        <UsersSection />
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByText('Add User'))

    // Fill form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'newuser' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'USER' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to create/i)).toBeInTheDocument()
    })
  })
})