
describe("Authentication", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("completes signup flow", () => {
    cy.visit("/signup");
    cy.get("input[name=username]").type("testuser");
    cy.get("input[name=password]").type("password123");
    cy.get("input[name=confirmPassword]").type("password123");
    cy.get("select[name=role]").select("USER");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
  });

  it("completes login flow", () => {
    cy.visit("/login");
    cy.get("input[name=username]").type("testuser");
    cy.get("input[name=password]").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });

  it("handles invalid login", () => {
    cy.visit("/login");
    cy.get("input[name=username]").type("wronguser");
    cy.get("input[name=password]").type("wrongpass");
    cy.get("button[type=submit]").click();
    cy.contains("Invalid username or password").should("be.visible");
  });
});

