/* eslint-disable cypress/no-unnecessary-waiting */
describe('LDAP Gateway', () => {
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

    // ldap apis
    cy.intercept('GET', '/api/gateway/radius*').as('radiusListRequest'); // radius List
    cy.intercept('GET', '/api/gateway/ldap+(?*|)').as('ldapListRequest'); // ldap List
    cy.intercept('POST', '/api/gateway/ldap').as('creatLdapRequest'); // add

    cy.intercept('GET', '/api/gateway/ldap+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchLdapRequest';
      }
    }); // Search

    cy.intercept('GET', '/api/gateway/ldap/get-detail+(?*|)').as('ldapDetailRequest'); // get detail
    cy.intercept('PUT', '/api/gateway/ldap/edit/*').as('updateLDAPRequest'); // update  ldap info

    cy.intercept('GET', '/api/gateway/ldap/download+(?*|)').as('downloadLdapConfigRequest'); // Download ldap config

    cy.intercept('DELETE', '/api/gateway/*').as('deleteLDAPRequest'); // delete
  });

  it('should Radius Gateway list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);
    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/gateway-radius"]`).contains('Gateway').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/gateway-radius`);
    });
    cy.wait('@radiusListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should switch to LDAP Gateway page', () => {
    cy.get('.radius-logging-radio-button').contains('LDAP').click();
    cy.wait('@ldapListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should add ldap gateway', () => {
    cy.contains('span', 'Add LDAP Gateway').click();
    cy.wait(1000);

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`s test LDAP Gateway${randomNumber}`);

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@creatLdapRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@ldapListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should search ldap', () => {
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchLdapRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@ldapListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show ldap detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@ldapDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.get('.ant-drawer-title').contains('LDAP Gateway Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to ldap settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@ldapDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit ldap info', () => {
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.get('input[id="name"]').type('{backspace}{backspace}');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateLDAPRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@ldapDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should download ldap full', () => {
    // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Download').trigger('mouseover');
    // cy.wait(500);

    // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Full').click();

    // cy.wait('@downloadLdapFullRequest').then(({ response }) => {
    //   expect(response.statusCode).to.equal(200);
    // });

    // const downloadsFolder = Cypress.config('downloadsFolder');
    // cy.readFile(`${downloadsFolder}/ldap-gateway.zip`).should('exist');
    cy.wait(500);
  });

  it('should download ldap config', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Download').trigger('mouseover');
    cy.wait(500);

    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Config').click({ force: true });

    cy.wait('@downloadLdapConfigRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(500);
    cy.get('.ant-modal-title').contains('LDAP Setup Config').should('exist');
    cy.wait(1000);
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.readFile(`${downloadsFolder}/config.json`).should('exist');
    cy.wait(500);
    cy.get('.ant-modal-close-x').click({ force: true });
    cy.wait(500);
  });

  // it('should Delete Ldap ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.wait(1000);
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click({ force: true });
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click({ force: true });
  //   cy.wait('@deleteLDAPRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(204);
  //   });
  // });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
