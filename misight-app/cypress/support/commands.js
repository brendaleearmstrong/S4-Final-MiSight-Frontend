
Cypress.Commands.add("login", (userType = "user") => {
  const users = {
    admin: { username: "admin", password: "admin123" },
    mine: { username: "mine", password: "mine123" },
    user: { username: "user", password: "user123" }
  };

  const user = users[userType];
  cy.visit("/login");
  cy.get("input[name=username]").type(user.username);
  cy.get("input[name=password]").type(user.password);
  cy.get("button[type=submit]").click();
});

Cypress.Commands.add("logout", () => {
  cy.get("[data-test=logout-button]").click();
  cy.url().should("include", "/login");
});

