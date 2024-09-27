/* eslint-disable cypress/no-unnecessary-waiting */
describe('Sms Provider', () => {
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
    cy.intercept('GET', '/api/otp-provider+(?*|)').as('smsProviderListRequest'); // List
    cy.intercept('POST', '/api/otp-provider').as('creatsmsProviderRequest'); // add

    cy.intercept('GET', '/api/otp-provider+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchsmsProviderRequest';
      }
    }); // Search

    cy.intercept('GET', '/api/otp-provider/get-detail+(?*|)').as('smsProviderDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/otp-provider/*').as('updatesmsProviderRequest'); // update

    // cy.intercept('DELETE', '/api/otp-provider/delete/*').as('deleteExternalsourceRequest'); // delete
  });

  it('should sms provider list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/sms-provider"]`).contains('SMS Provider').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/sms-provider`);
    });
    cy.wait('@smsProviderListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should add sms provider', () => {
    cy.wait(1000);
    // Add User
    cy.contains('span', 'Add Sms Provider').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[placeholder="Provider Name"]').type(`stestSmsProviderName${randomNumber}`);

    cy.get('div[name="provider"]').click();
    cy.get('.ant-select-item-option-content').contains('div', 'AsistBT').click();
    cy.wait(500);
    cy.get('textarea[name="description"]').type(`Created for selenium test`);
    cy.wait(500);
    cy.contains('span', 'Next').click();
    cy.wait(1000);
    cy.contains('span', 'Save').click();

    cy.wait('@creatsmsProviderRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@smsProviderListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should search sms provider', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`test`);
    cy.wait('@searchsmsProviderRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@searchsmsProviderRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show sms provider detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@smsProviderDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('SMS Provider Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to sms provider settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Edit').click();
    cy.wait('@smsProviderDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit sms provider info', () => {
    // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.get('input[id="name"]').type('{backspace}');
    cy.get('button[type="submit"]').click();
    cy.wait('@updatesmsProviderRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@smsProviderDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  // //   it('should Delete sms provider ', () => {
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
