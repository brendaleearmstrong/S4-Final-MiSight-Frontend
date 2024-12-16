const { rest } = require('msw');

const handlers = [
  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mockToken123',
        user: { id: 1, name: 'Test User', email: 'testuser@example.com' }
      })
    );
  })
];

module.exports = { handlers };