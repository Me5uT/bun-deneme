/* eslint-disable cypress/no-unnecessary-waiting */
describe('Administration', () => {
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
    cy.intercept('GET', '/api/admin/get-all+(?*|)').as('adminListRequest'); // List
    cy.intercept('POST', '/api//admin/register').as('createAdminRequest'); // add

    cy.intercept('GET', '/api/admin/get-all+(?*|)', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchAdminRequest';
      }
    }); // Search

    cy.intercept('GET', '/api/admin/get-admin-detail+(?*|)').as('adminDetailRequest'); // get detail
    cy.intercept('POST', '/api/admin/edit/*').as('updateAdminRequest'); // update
    cy.intercept('POST', '/api/admin/reset-verification').as('sendVerificationRequest'); // send verification
    cy.intercept('POST', '/api/tenant-settings/reset-password').as('resetPasswordRequest'); // reset password
    cy.intercept('DELETE', '/api/admin/*').as('deleteAdminRequest'); // delete
  });

  it('should admin list page', () => {
    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/administration"]`).contains('Administration').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/administration`);
    });
    cy.wait('@adminListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.get('.content-container-inner').should('exist');
  });

  it('should add admin', () => {
    // Add Admin
    cy.contains('span', 'Add Admin').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="firstName"]').type(`stestAdminf${randomNumber}`);
    cy.get('input[id="lastName"]').type(`stestAdminl${randomNumber}`);
    cy.get('input[id="mail"]').type(`testAdmin${randomNumber}`);
    cy.get('div[id="adminType"]').contains('span', 'Master Admin').click();

    cy.wait(500);
    cy.contains('span', 'Save').click();

    cy.wait('@createAdminRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@adminListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(1);
    });
    cy.wait(1000);
  });

  it('should search admin', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`stest`);
    cy.wait('@searchAdminRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
    cy.wait(500);

    cy.wait('@searchAdminRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show admin detail draver', () => {
    cy.get('.ant-table-tbody tr:nth-child(2)').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@adminDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('Admin Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
    cy.wait(1500);
  });

  it('should go to admin settings page', () => {
    cy.get('.ant-table-tbody tr:nth-child(2)').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');

    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });

    cy.wait('@adminDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit admin info', () => {
    // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
    cy.get('div[role="tab"]').contains('Settings').click();
    cy.wait(500);
    cy.get('input[id="lastName"]').type('{backspace}');
    cy.wait(500);

    cy.get('button[type="submit"]').click();
    cy.wait('@updateAdminRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@adminDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should send verification', () => {
    // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Send Verification').click({ force: true });

    // cy.wait('@sendVerificationRequest').then(({ response }) => {
    //   expect(response.statusCode).to.equal(200);
    // }); // TODO
    cy.wait(1000);
  });

  it('should reset password', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Reset Password').click({ force: true });

    cy.wait('@resetPasswordRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(1000);
  });

  //   it('should Delete admin ', () => {
  //     cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //     cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  //     cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //     cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  //     cy.wait('@deleteGroupRequest').then(({ response }) => {
  //       expect(response.statusCode).to.equal(204);
  //     });
  // //   });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
