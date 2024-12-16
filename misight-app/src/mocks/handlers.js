import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', () => {
    return HttpResponse.json({
      token: 'mockToken123',
      user: { id: 1, name: 'Test User', email: 'testuser@example.com' }
    }, { status: 200 })
  }),
  http.post('/api/signup', () => {
    return HttpResponse.json({
      message: 'User created successfully',
      user: { id: 1, username: 'Test User', email: 'testuser@example.com' }
    }, { status: 201 })
  })
]