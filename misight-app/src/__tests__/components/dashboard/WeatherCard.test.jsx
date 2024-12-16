import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherCard } from '@/components/dashboard/WeatherCard'

describe('WeatherCard', () => {
  const mockWeatherData = {
    current: { temp: 22, condition: 'Sunny', windSpeed: 12 },
    forecast: [
      { day: 'Today', high: 22, low: 15, condition: 'Sunny' }
    ]
  }

  test('renders weather information', () => {
    render(<WeatherCard weatherData={mockWeatherData} />)
    expect(screen.getByText('22°C')).toBeInTheDocument()
    expect(screen.getByText('Sunny')).toBeInTheDocument()
  })
})
