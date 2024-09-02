describe("Star Wars Battle Game", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the game header and change resource types", () => {
    cy.get("mat-card.game-header").should("be.visible");
    cy.get("mat-card-title").should("contain.text", "Star Wars Battle");
    cy.get("button").contains("Starships").click();
    cy.get("button").contains("People").click();
  });

  it("should fetch, display cards and check winner", () => {
    cy.get("button").contains("Play Again").dblclick();

    cy.wait(2000);

    cy.get(".cards-container > :nth-child(1) > .mat-mdc-card-header").contains(
      "Left Player"
    );
    cy.get(".cards-container > :nth-child(2) > .mat-mdc-card-header").contains(
      "Right Player"
    );

    cy.get(".winner-announcement").should("contain.text", "Winner");
  });

  it("should display error message if request fails", () => {
    cy.intercept("GET", "**/api/people/*", { statusCode: 500 }).as(
      "getPeopleFail"
    );

    cy.get("button").contains("Play Again").click();
    cy.wait("@getPeopleFail");

    cy.get(
      '.mat-mdc-snack-bar-label.ng-tns-c16-2 > [aria-hidden="true"] > .mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label'
    ).should("contain.text", "Request failed, please try again.");
  });
});
