/* eslint-disable cypress/no-unnecessary-waiting */
describe('User Portal', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'nkarakas@mirketsecurity.com';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const bearerToken = JSON.parse(localStorage.getItem(Cypress.env('jwtStorageName')));
  const randomNumber = Math.floor(Math.random() * 100000);

  before(() => {
    if (!bearerToken) {
      cy.login(username, password);
    }
  });

  beforeEach(() => {
    // dashboard api
    cy.intercept('GET', '/api/dashboard/detail+(?*|)').as('dashboardDetailRequest');

    //   apis
    cy.intercept('GET', '/api/userportal/mfa/*').as('userPortalMfaRequest'); // get all
    cy.intercept('PUT', '/api/userportal/mfa').as('updateUserPortalMfa'); // update
  });

  it('should user portal mfa page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.contains('b', 'User Portal').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/user-portal`);
    });
    cy.wait('@userPortalMfaRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.ant-card-head-title').contains('MFA Methods').should('exist');
  });

  it('should change mfa method', () => {
    cy.wait(1000);
    cy.get('#isOtpEnable').should('be.visible').click();
    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@updateUserPortalMfa').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
