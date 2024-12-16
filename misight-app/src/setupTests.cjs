require('@testing-library/jest-dom');
require('whatwg-fetch');
const { server } = require('./mocks/server.cjs');

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn'
  });
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
});