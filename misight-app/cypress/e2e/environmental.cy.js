
describe("Environmental Data Management", () => {
  beforeEach(() => {
    cy.login("mine");
  });

  it("adds new environmental measurement", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=env-data]").click();
    cy.get("[data-test=add-measurement]").click();
    
    cy.get("input[name=measuredValue]").type("45");
    cy.get("select[name=pollutantId]").select("PM10");
    cy.get("textarea[name=notes]").type("Test measurement");
    
    cy.get("button[type=submit]").click();
    cy.contains("Measurement added successfully").should("be.visible");
  });

  it("displays environmental charts", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=env-data]").click();
    
    cy.get("[data-test=air-quality-chart]").should("be.visible");
    cy.get("[data-test=trends-chart]").should("be.visible");
  });
});

