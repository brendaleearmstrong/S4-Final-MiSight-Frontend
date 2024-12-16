import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

describe('App', () => {
  test('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})