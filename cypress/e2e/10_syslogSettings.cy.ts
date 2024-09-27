/* eslint-disable cypress/no-unnecessary-waiting */
describe('Syslog Settings', () => {
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
    cy.intercept('GET', '/api/tenant-settings+(?*|)').as('tenantSettingsRequest'); // get all
    cy.intercept('POST', '/api/tenant-settings/syslog').as('updateTenantSettings'); // update
  });

  it('should exist syslog settings page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/syslog"]`).contains('Syslog').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/syslog`);
    });
    cy.wait('@tenantSettingsRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.profile-card-container').should('exist');
    cy.wait(1000);
  });

  it('should change settings', () => {
    // cy.get('input[id="bruteForceProtectionTime"]').type('{backspace}{backspace}');
    // cy.get('input[id="bruteForceProtectionTime"]').type('6');

    // cy.get('button[type="submit"]').click();
    // cy.wait('@updateTenantSettings').then(({ response }) => {
    //   expect(response.statusCode).to.equal(200);
    // });
    cy.wait(500);
  });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
