describe('Group', () => {
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
    cy.intercept('GET', '/api/external-source/get-all-by-group+(?*|)').as('getAllExternalSourceByGroupRequest'); // get all external source by group
    cy.intercept('PUT', '/api/participant-group/external-source/+(?*|)').as('addExternalSourceToGroupRequest'); // get all external source by group
    cy.intercept('GET', '/api/external-source/get-all+(?*|)').as('getAllExternalSourceRequest'); // get all external source
  });

  it('should group list page', () => {
    cy.wait(500);
    cy.contains('b', 'Configuration').should('be.visible').click();
    cy.wait(500);
    cy.get('@alias').then(alias => {
      cy.get(`a[href="/${alias}/group"]`).contains('Groups').should('be.visible').click({ force: true });
      cy.url().should('include', `/${alias}/group`);
    });

    cy.wait('@groupListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
  });

  it('should add group', () => {
    cy.wait(1000);
    // Add User
    cy.contains('span', 'Add Group').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`selenium test group${randomNumber}`);

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@createGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@groupListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should not add group with same name', () => {
    cy.wait(1000);
    // Add User
    cy.contains('span', 'Add Group').click();

    cy.get('.ant-modal-body').should('exist');
    cy.get('input[id="name"]').type(`selenium test group${randomNumber}`);

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@createGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(400);
    });

    cy.get('.add-modal-form-item').children().contains('span', 'Close').click();
  });

  it('should search group', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(500);
    cy.get('input[placeholder="Search..."]').clear();
    cy.wait(500);

    cy.wait('@groupListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show group detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@groupDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('Group Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to group settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@groupDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit group info', () => {
    cy.get('div[role="tab"]').contains('Group Info').click();
    cy.wait(500);
    cy.get('input[id="name"]').type('{backspace}{backspace}');
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.wait('@updateGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@groupDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should add user to group', () => {
    cy.get('div[role="tab"]').contains('Users').click();

    cy.wait('@getAllUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    // ant-table-tbody içerisindeki ilk ant-table-selection-column elementine tıkla ve seç
    cy.get('.available-items-table').get('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(1) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addUserToGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllUserByGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(1000);
  });

  it('should remove user from group', () => {
    cy.wait(500);
    cy.get('.selected-items-table').find('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(2) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addUserToGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllUserByGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should add external source to group', () => {
    cy.get('div[role="tab"]').contains('External Sources').click();

    cy.wait('@getAllExternalSourceRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    // ant-table-tbody içerisindeki ilk ant-table-selection-column elementine tıkla ve seç
    cy.get('.available-items-table').get('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(1) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addExternalSourceToGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllExternalSourceByGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(1000);
  });

  it('should remove external source from group', () => {
    cy.wait(500);
    cy.get('.selected-items-table').find('.ant-table-tbody tr:first').find('.ant-table-selection-column').click();
    cy.get('.custom-transfer-container > .ant-space > :nth-child(2) > .ant-btn').click();
    cy.wait(500);
    cy.get('.ant-tabs-extra-content > .ant-space > :nth-child(1) > .ant-btn').contains('Save').click();
    cy.wait('@addExternalSourceToGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
    cy.wait('@getAllExternalSourceByGroupRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  // it('should Delete group ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  //   cy.wait('@deleteGroupRequest').then(({ response }) => {
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
