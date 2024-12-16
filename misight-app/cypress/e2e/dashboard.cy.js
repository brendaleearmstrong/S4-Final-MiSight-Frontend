
describe("Dashboard Features", () => {
  beforeEach(() => {
    cy.login("admin");
  });

  it("navigates through sections", () => {
    cy.get("[data-test=env-data]").click();
    cy.contains("Environmental Data").should("be.visible");

    cy.get("[data-test=safety-data]").click();
    cy.contains("Safety Reports").should("be.visible");
  });

  it("displays environmental data", () => {
    cy.get("[data-test=env-data]").click();
    cy.get("[data-test=air-quality-chart]").should("be.visible");
    cy.get("[data-test=add-measurement]").click();
    cy.get("input[name=measuredValue]").type("45");
    cy.get("button[type=submit]").click();
    cy.contains("Measurement added successfully").should("be.visible");
  });
});

