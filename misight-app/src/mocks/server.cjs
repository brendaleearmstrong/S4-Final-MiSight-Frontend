const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { handlers } = require('./handlers.cjs');

const server = setupServer(...handlers);

module.exports = { server };