/* eslint-disable cypress/no-unnecessary-waiting */
describe('Attribute Profile', () => {
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
    cy.intercept('GET', '/api/ldap-profiles+(?*|)').as('attributeProfileListRequest'); // List
    cy.intercept('POST', '/api/ldap-profiles').as('creatattributeProfileRequest'); // add

    cy.intercept('GET', '/api/ldap-profiles+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchattributeProfileRequest';
      }
    }); // Search

    cy.intercept('GET', '/api/ldap-profiles/get-detail+(?*|)').as('attributeProfileDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/ldap-profiles/edit/*').as('updateattributeProfileRequest'); // update

    // cy.intercept('DELETE', '/api/ldap-profiles/delete/*').as('deleteExternalsourceRequest'); // delete
  });

  it('should attribute profile list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/attribute-profile"]`).contains('Attributes').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/attribute-profile`);
    });
    cy.wait('@attributeProfileListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should add attribute profile', () => {
    cy.wait(1000);
    // Add User
    cy.contains('span', 'Add Attribute Profile').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`stestAttributeProfile${randomNumber}`);
    cy.get('input[id="description"]').type(`Created for selenium test`);
    cy.get('input[id="mailAttribute"]').type(`mail`);

    cy.wait(500);
    cy.contains('span', 'Save').click();

    cy.wait('@creatattributeProfileRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@attributeProfileListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(1000);
  });

  it('should search attribute profile', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`test`);
    cy.wait('@searchattributeProfileRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@searchattributeProfileRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show attribute profile detail draver', () => {
    cy.get('.ant-table-tbody tr:nth-child(2)').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Details').click({ force: true });
    cy.wait('@attributeProfileDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('Attribute Profile Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to attribute profile settings page', () => {
    cy.get('.ant-table-tbody tr:nth-child(2)').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);

    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@attributeProfileDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit attribute profile info', () => {
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.wait(500);
    cy.get('input[id="name"]').type('{backspace}{backspace}');
    cy.wait(500);

    cy.get('button[type="submit"]').click();
    cy.wait('@updateattributeProfileRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@attributeProfileDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  // //   it('should Delete attribute profile ', () => {
  // //     cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  // //     cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  // //     cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  // //     cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  // //     cy.wait('@deleteGroupRequest').then(({ response }) => {
  // //       expect(response.statusCode).to.equal(200);
  // //     });
  // //   });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
