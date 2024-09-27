/* eslint-disable cypress/no-unnecessary-waiting */
describe('Radius Rule', () => {
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
    cy.intercept('POST', '/api/rule').as('creatRadiusRuleRequest'); // add
    cy.intercept('GET', '/api/participant/selection+(?*|)').as('participantSelectionRequest'); // get all participant
    cy.intercept('GET', '/api/participant/get-all-by-rule+(?*|)').as('participantByRuleRequest'); // get all participant by rule
    cy.intercept('PUT', '/api/rule/*/participant').as('addOrRemoveUserToRadiusRuleRequest'); // add or remove user to radius rule

    cy.intercept('GET', '/api/rule+(?*|)', req => {
      const filterParams = ['status', 'client', 'user', 'group', 'isAccept'];
      const searchParams = ['searchtext'];

      const hasFilterParams = filterParams.some(param => req.url.includes(param));
      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchRadiusRuleRequest';
      } else if (!hasFilterParams) {
        req.alias = 'radiusRuleListRequest';
      } else {
        req.alias = 'filterRadiusRuleRequest';
      }
    }); // List

    cy.intercept('GET', '/api/rule/get-detail+(?*|)').as('radiusRuleDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/rule/edit/*').as('updateRadiusRuleRequest'); // update

    // cy.intercept('DELETE', '/api/rule/delete/*').as('deleteRadiusRuleRequest'); // delete
  });

  it('should radius rule list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/radius-rules"]`).contains('Radius Rules').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/radius-rules`);
    });
    cy.wait('@radiusRuleListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  // it('should add rule', () => {
  //   cy.wait(1000);
  //   // Add Rule
  //   cy.contains('span', 'Add Radius Rule').click();

  //   cy.get('.ant-modal-body').should('exist');
  //   cy.get('input[name="name"]').type(`stestRadiusRuleName${randomNumber}`);
  //   cy.wait(500);
  //   cy.contains('span', 'Next').click();
  //   cy.wait(700);
  //   cy.contains('span', 'Next').click();

  //   cy.wait('@participantSelectionRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  //   cy.wait(500);

  //   cy.contains('span', 'Next').click();
  //   cy.wait(700);
  //   cy.contains('span', 'Next').click();

  //   cy.get('div[name="providerId"]').click();
  //   cy.get('.ant-select-item-option-content').contains('div', 'Bypass').click();
  //   cy.wait(500);

  //   cy.contains('span', 'Save').click();

  //   cy.wait('@creatRadiusRuleRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  //   cy.wait('@radiusRuleListRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //     expect(response.body?.resultList?.length).to.be.greaterThan(1);
  //   });
  // });

  // it('should search radius rule', () => {
  //   // Search User
  //   cy.get('input[placeholder="Search..."]').type(`test`);
  //   cy.wait('@searchRadiusRuleRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //     expect(response.body?.resultList?.length).to.be.greaterThan(0);
  //   });
  //   cy.wait(500);
  //   cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
  //   cy.wait(500);

  //   cy.wait('@radiusRuleListRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //     expect(response.body?.resultList?.length).to.be.greaterThan(0);
  //   });
  // });

  // it('should show radius rule detail draver', () => {
  //   cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
  //   cy.contains('span', 'Details').click();
  //   cy.wait('@radiusRuleDetailRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  //   cy.get('.ant-drawer-title').contains('Radius Rule Details').should('exist');
  //   cy.wait(1500);
  //   cy.get('.ant-drawer-close').click();
  // });

  it('should go to radius rule settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@radiusRuleDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(1000);
  });

  // it('should edit radius rule info', () => {
  //   cy.get('div[role="tab"]').contains('Source').click();
  //   cy.get('input[id="name"]').type('{backspace}');
  //   cy.get('button[type="submit"]').click();
  //   cy.wait('@updateRadiusRuleRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  //   cy.wait('@radiusRuleDetailRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  // });

  it('should add or remove users to radius rule', () => {
    cy.get('div[role="tab"]').contains('Users').click();
    cy.wait('@participantSelectionRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait('@participantByRuleRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);

    //
    // add
    cy.get('.available-items-table').get('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(1) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addOrRemoveUserToRadiusRuleRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(1000);
    // // remove
    // cy.get('.selected-items-table').find('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    // cy.get('.custom-transfer-container > .ant-space > :nth-child(2) > .ant-btn').click();
    // cy.wait(500);

    // cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    // cy.wait('@addOrRemoveUserToRadiusRuleRequest').then(({ response }) => {
    //   expect(response.statusCode).to.equal(200);
    // });

    // cy.wait(1000);
  });

  // it('should Delete radius rule ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  //   cy.wait('@deleteRadiusRuleRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  // });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
