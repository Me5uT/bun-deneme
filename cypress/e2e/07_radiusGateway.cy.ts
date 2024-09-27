/* eslint-disable cypress/no-unnecessary-waiting */
describe('Radius Gateway', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'nkarakas@mirketsecurity.com';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const bearerToken = JSON.parse(localStorage.getItem(Cypress.env('jwtStorageName')));
  const randomNumber = Math.floor(Math.random() * 100000);
  // create random ip address
  const randomIpAddress = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}`;
  };

  before(() => {
    if (!bearerToken) {
      cy.login(username, password);
    }
  });

  beforeEach(() => {
    // dashboard api
    cy.intercept('GET', '/api/dashboard/detail+(?*|)').as('dashboardDetailRequest');

    // ldap apis
    cy.intercept('GET', '/api/gateway/radius+(?*|)').as('radiusListRequest'); // radius List
    cy.intercept('GET', '/api/radius-client/get-all-by-gateway+(?*|)').as('clientistRequest'); // client List
    cy.intercept('GET', '/api/gateway/ldap+(?*|)').as('ldapListRequest'); // ldap List
    cy.intercept('POST', '/api/gateway/radius').as('creatRadiusRequest'); // add radius
    cy.intercept('POST', '/api/radius-client').as('createClientRequest'); // add client

    cy.intercept('GET', '/api/gateway/radius+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchLdapRequest';
      }
    }); // Search gateway

    cy.intercept('GET', '/api/radius-client/get-all-by-gateway+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchClientRequest';
      }
    }); // Search client

    cy.intercept('GET', '/api/gateway/radius/get-detail+(?*|)').as('radiusDetailRequest'); // get detail
    cy.intercept('PUT', '/api/gateway/radius/edit/*').as('updateRadiusRequest'); // update  ldap info

    cy.intercept('GET', '/api/gateway/radius/get-config+(?*|)').as('downloadConfigRequest'); // download config

    cy.intercept('DELETE', '/api/gateway/*').as('deleteRadiusRequest'); // delete radius
    cy.intercept('DELETE', '/api/radius-client/*').as('deleteClientRequest'); // delete client
  });

  it('should radius Gateway list page', () => {
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

  it('should add radius gateway', () => {
    cy.contains('span', 'Add Radius Gateway').click();
    cy.wait(1000);

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`test radius Gateway${randomNumber}`);
    cy.get('input[id="description"]').type(`test LDAP Gateway${randomNumber} desc`);
    cy.get('input[id="samName"]').type(`rgateway${randomNumber}`);
    cy.get('input[id="gatewayIp"]').type(`${randomIpAddress()}`);
    cy.get('.ant-btn-block').contains('span', 'Add Radius Client').click();
    cy.wait(500);
    cy.get('input[id="radiusClients_0_name"]').type(`rclient${randomNumber}`);
    cy.get('input[id="radiusClients_0_ipAddress"]').type(`${randomIpAddress()}`);
    cy.get('input[id="radiusClients_0_secretKey"]').type(`secretkey${randomNumber}`);

    cy.contains('span', 'Save').click();
    cy.wait('@creatRadiusRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@radiusListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should search radius', () => {
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchLdapRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@radiusListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show radius detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@radiusDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.get('.ant-drawer-title').contains('Radius Gateway Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to radius settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@radiusDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should swtich clients page', () => {
    cy.get('div[role="tab"]').contains('Radius Clients').click();

    cy.wait('@clientistRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should add radius client', () => {
    cy.wait(1000);
    cy.contains('span', 'Add Radius Client').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`tesradiusclient2${randomNumber}`);
    cy.get('input[id="ipAddress"]').type(`${randomIpAddress()}`);
    cy.get('input[id="secretKey"]').type(`secrett${randomNumber}`);

    cy.wait(500);

    cy.contains('span', 'Save').click();
    cy.wait('@createClientRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@clientistRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(1);
    });
  });

  it('should search client', () => {
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchClientRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').clear();
    cy.wait(500);

    cy.wait('@clientistRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  // it('should Delete Client ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.wait(1000);
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click({ force: true });
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click({ force: true });
  //   cy.wait(500);
  //   cy.wait('@deleteClientRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(204);
  //   });
  // });

  it('should edit radius info', () => {
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.get('input[id="name"]').type('{backspace}{backspace}');
    cy.wait(500);

    cy.get('button[type="submit"]').click();
    cy.wait('@updateRadiusRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@radiusDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should download config', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Download').trigger('mouseover');
    cy.wait(500);

    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Config').click();

    cy.wait('@downloadConfigRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.ant-modal-title').contains('Radius Setup Config').should('exist');
    cy.wait(1000);

    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.readFile(`${downloadsFolder}/config.json`).should('exist');
    cy.wait(500);

    cy.get('.ant-modal-close').click({ force: true });
    cy.wait(1000);
  });

  it('should go to download full setup', () => {
    // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Download').trigger('mouseover');
    // cy.wait(500);

    // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Full Setup').click();

    cy.wait(500);
  });

  // it('should Delete Ldap ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.wait(1000);
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click({ force: true });
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click({ force: true });
  //   cy.wait('@deleteRadiusRequest').then(({ response }) => {
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
