
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    chromeWebSecurity: false,
    experimentalStudio: true
  },
  env: {
    admin: {
      username: "admin",
      password: "admin123"
    },
    mineAdmin: {
      username: "mine",
      password: "mine123"
    },
    user: {
      username: "user",
      password: "user123"
    }
  }
});

