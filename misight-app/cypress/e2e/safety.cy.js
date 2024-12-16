
describe("Safety Data Management", () => {
  beforeEach(() => {
    cy.login("mine");
  });

  it("records safety incident", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=safety-data]").click();
    cy.get("[data-test=report-incident]").click();
    
    cy.get("input[name=lostTimeIncidents]").type("1");
    cy.get("input[name=nearMisses]").type("2");
    cy.get("select[name=safetyLevel]").select("FAIR");
    
    cy.get("button[type=submit]").click();
    cy.contains("Incident recorded successfully").should("be.visible");
  });

  it("displays safety metrics", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=safety-data]").click();
    
    cy.get("[data-test=incidents-chart]").should("be.visible");
    cy.get("[data-test=safety-score]").should("be.visible");
  });
});

