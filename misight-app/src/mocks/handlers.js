import { rest } from 'msw';

export const handlers = [
  rest.post('/api/login', (req, res, ctx) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
      return res(
        ctx.status(200),
        ctx.json({
          username: 'admin',
          role: 'ADMIN',
          token: 'mock-jwt-token'
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid username or password' })
    );
  }),

  rest.get('/api/environmental-data', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          measuredValue: 45,
          measurementDate: '2024-12-01',
          pollutant: { name: 'PM10', benchmarkValue: 50 }
        }
      ])
    );
  }),
];
