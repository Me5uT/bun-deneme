/* eslint-disable cypress/no-unnecessary-waiting */
describe('External Source', () => {
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
    cy.intercept('GET', '/api/external-source/get-all+(?*|)').as('externalsourceListRequest'); // List

    cy.intercept('GET', '/api/external-source/get-all+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchExternalsourceRequest';
      }
    }); // Search

    cy.intercept('POST', '/api/external-source/add').as('creatEexternalsourceRequest'); // add
    cy.intercept('GET', '/api/external-source/get-detail+(?*|)').as('externalsourceDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/external-source/edit/*').as('updateExternalsourceRequest'); // update
    cy.intercept('GET', '/api/external-source/sync+(?*|)').as('sync'); // sync
    cy.intercept('GET', '/api/external-source/report+(?*|)').as('gotoreport'); // report

    // cy.intercept('DELETE', '/api/external-source/delete/*').as('deleteExternalsourceRequest'); // delete
  });

  it('should external source list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/external-source"]`).contains('External Source').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/external-source`);
    });
    cy.wait('@externalsourceListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should add external source', () => {
    cy.wait(1000);
    // Add User
    cy.contains('span', 'Add External Source').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`stestExternalSource${randomNumber}`);
    cy.get('input[id="description"]').type(`stestExternalSourcedescp${randomNumber}`);

    cy.get('input[id="gatewayUid"]').click();
    cy.get('.ant-select-item-option').first().click();

    cy.get('input[id="domainName"]').type(`stestExternalDomain${randomNumber}`);

    cy.get('input[id="ldapGroupDn"]').type(`stestLdapgroupDN${randomNumber}`);

    cy.get('.attribute-list-select').click();
    cy.get('.attribute-list-select-popup .ant-select-item-option').first().click({ force: true });

    cy.get('input[id="samValue"]').type(`stestexternalSAMVALUE${randomNumber}`);

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@creatEexternalsourceRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@externalsourceListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should search external source', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchExternalsourceRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@externalsourceListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show external source detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@externalsourceDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('External Source Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to external source settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@externalsourceDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit external source info', () => {
    // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.get('input[id="name"]').type('{backspace}');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateExternalsourceRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@externalsourceDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should sync external source', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Sync').click();
    cy.wait('@sync').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(1000);
  });

  it('should go to external source report page', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Report').click();
    cy.wait('@gotoreport').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('include', '/report');
  });

  //   it('should Delete external source ', () => {
  //     cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //     cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  //     cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //     cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  //     cy.wait('@deleteGroupRequest').then(({ response }) => {
  //       expect(response.statusCode).to.equal(200);
  //     });
  //   });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
