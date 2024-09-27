describe('Users 2', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'lfqycryzcikwbcovbjixaijcy@mirketsecurity.com';
  const password = Cypress.env('E2E_PASSWORD') ?? 'c6{wtygL<EhANQ`k3mvD29cMP>*PWD12Rgn4;|+1^|"#+Jv8+';
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

    // group apis

    cy.intercept('GET', '/api/participant-group/get-all*', req => {
      const searchParams = ['searchtext'];

      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchGroupRequest';
      } else {
        req.alias = 'groupListRequest';
      }
    }); // List and Search

    cy.intercept('POST', '/api/participant-group/add').as('createGroupRequest'); // add
    cy.intercept('GET', '/api/participant-group/get-detail+(?*|)').as('groupDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/participant-group/edit/*').as('updateGroupRequest'); // update  group info
    cy.intercept('GET', '/api/participant/selection+(?*|)').as('getAllUserRequest'); // get all user
    cy.intercept('PUT', '/api/participant-group/group-participant/*').as('addUserToGroupRequest'); // add user to group
    cy.intercept('GET', '/api/participant/get-all-by-group+(?*|)').as('getAllUserByGroupRequest'); // get all user by group

    cy.intercept('DELETE', '/api/participant-group/delete/*').as('deleteGroupRequest'); // delete

    cy.intercept('GET', '/api/participant/get-all+(?*|)').as('userListRequest');
    cy.intercept('GET', '/api/participant/get-detail+(?*|)').as('userDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/participant/participant-group/*').as('addGroupToUserRequest'); // add user to group
    cy.intercept('GET', '/api/participant-group/get-all-by-participant+(?*|)').as('getAllGroupByParticipantRequest'); // get all group by participant
  });

  it('should exist user list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);

    cy.get('@alias').then(alias => {
      // "User" bağlantısının görünür ve tıklanabilir olduğunu doğrula
      cy.get(`a[href="/${alias}/user"]`).contains('User').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/user`);
    });

    cy.wait('@userListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should go to user settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@userDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should add group to user', () => {
    cy.get('div[role="tab"]').contains('Member of Groups').click();

    cy.wait('@groupListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.get('.available-items-table').get('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(1) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addGroupToUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllGroupByParticipantRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(1000);
  });

  it('should remove group from user', () => {
    cy.wait(500);
    cy.get('.selected-items-table').find('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(2) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addGroupToUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllGroupByParticipantRequest').then(({ response }) => {
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
