describe('User', () => {
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

    // account apis
    cy.intercept('GET', '/api/participant/get-all+(?*|)', req => {
      const filterParams = [
        'displayName',
        'username',
        'mail',
        'phone',
        'participantType',
        'verificationStatus',
        'sam',
        'participantStatus',
      ];
      const searchParams = ['searchtext'];

      const hasFilterParams = filterParams.some(param => req.url.includes(param));
      const hasSearchParams = searchParams.some(param => req.url.includes(param));

      if (hasSearchParams) {
        req.alias = 'searchUserRequest';
      } else if (!hasFilterParams) {
        req.alias = 'userListRequest';
      } else {
        req.alias = 'filterUserRequest';
      }
    }); // List

    cy.intercept('POST', '/api/participant/add').as('createUserRequest'); // add
    cy.intercept('GET', '/api/participant/get-detail+(?*|)').as('userDetailRequest'); // get  detail
    cy.intercept('PUT', '/api/participant/edit/*').as('updateUserRequest'); // update  user info
    cy.intercept('POST', '/api/participant/reset-all-verification').as('resendUserVerificationRequest'); // resend verification mail
    cy.intercept('POST', '/api/tenant-settings/reset-password').as('resetUserPasswordRequest'); // rreset password mail
    cy.intercept('GET', '/api/participant/send-change-password+(?*|)').as('sendChangePasswordRequest'); // send change password mail

    cy.intercept('GET', '/api/participant/send-totp*').as('sendUserTOTPRequest'); // send TOTP
    cy.intercept('POST', '/api/participant/test-sender').as('sendUserTestSenederRequest'); // test sender
    cy.intercept('DELETE', '/api/participants/*').as('deleteUserRequest'); // delete
    cy.intercept('GET', '/api/participant/export+(?*|)').as('exportAllUsersRequest'); // export
  });

  it('should exist user list page', () => {
    cy.wait(500);
    // "Configuration" düğmesinin görünür ve tıklanabilir olduğunu doğrula
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

  it('should add user', () => {
    // Add User
    cy.contains('span', 'Add User').click();

    cy.get('.ant-modal-body').should('exist');
    cy.wait(500);

    cy.get('input[name="displayName"]').type(`selenium test user${randomNumber}`);
    cy.get('input[name="username"]').type(`selenium username${randomNumber}`);
    cy.get('.add-user-phone').clear().type('905069029046');

    cy.get('input[name="mail"]').type(`seleniumtest${randomNumber}@${randomNumber}stest.com`);
    cy.get('input[name="sam"]').type(`stestSamValue${randomNumber}`);
    cy.wait(500);

    cy.contains('span', 'Next').click();

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@createUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@userListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait(500);
  });

  it('should not add user with same sam value', () => {
    // Add User
    cy.contains('span', 'Add User').click();

    cy.get('.ant-modal-body').should('exist');
    cy.wait(500);

    cy.get('input[name="displayName"]').type(`selenium test user${randomNumber}`);
    cy.get('input[name="username"]').type(`selenium username${randomNumber}`);
    cy.get('.add-user-phone').clear().type('905069029046');

    cy.get('input[name="mail"]').type(`seleniumtest${randomNumber}@${randomNumber}stest.com`);
    cy.get('input[name="sam"]').type(`stestSamValue${randomNumber}`);
    cy.wait(500);

    cy.contains('span', 'Next').click();

    cy.wait(500);
    cy.contains('span', 'Save').click();
    cy.wait('@createUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(400);
    });
    cy.get('.add-modal-form-item').children().contains('span', 'Close').click();
  });

  it('should search user', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
    cy.wait('@searchUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.get('input[placeholder="Search..."]').clear();
    cy.wait('@userListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(1000);
  });

  it('should not search any user', () => {
    // Search User
    cy.get('input[placeholder="Search..."]').type(`empt`);
    cy.wait('@searchUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.equal(0);
    });
    cy.get('input[placeholder="Search..."]').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
    cy.wait('@userListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
    cy.wait(1000);
  });

  it('should filtre user', () => {
    // Filter User
    cy.get('.filter-icon-button').click();
    cy.get('.ant-modal-title').contains('div', 'Advanced Search').should('exist');
    cy.get('input[id="displayName"]').type(`${randomNumber}`);
    cy.get("button[type='submit']").click();
    cy.wait('@filterUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body?.resultList?.length).to.be.greaterThan(0);
    });
  });

  it('should show user detail draver', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.contains('span', 'Details').click();
    cy.wait('@userDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.get('.ant-drawer-title').contains('User Details').should('exist');
    cy.wait(1500);
    cy.get('.ant-drawer-close').click();
  });

  it('should go to user settings page', () => {
    cy.get('.ant-table-tbody tr:first').find('[data-icon="ellipsis-vertical"]').trigger('mouseover');
    cy.wait(500);
    cy.contains('span', 'Edit').click({ force: true });
    cy.wait('@userDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should edit user info', () => {
    // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
    cy.get('div[role="tab"]').contains('User Info').click();
    cy.wait(500);
    cy.get('input[id="displayName"]').type('{backspace}');
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.wait('@updateUserRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.wait('@userDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should send token verification', () => {
    // Send Verification Mail
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Send Token Verification').click({ force: true });
    cy.wait(500);
    cy.get('.ant-modal').contains('span', 'If you want to send Token Verification').should('exist');
    cy.wait(500);
    cy.get('.ant-modal-footer').contains('span', 'OK').click();
    cy.wait('@resendUserVerificationRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(500);
  });

  it('should send Set Password Mail', () => {
    // Send Verification Mail
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Send Set Password Mail').click({ force: true });
    cy.wait(500);
    cy.get('.ant-modal').contains('span', 'If you want to set password mail').should('exist');
    cy.wait(500);
    cy.get('.ant-modal-footer').contains('span', 'OK').click();
    cy.wait('@sendChangePasswordRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(500);
  });

  it('should send TOTP', () => {
    // Send Verification Mail
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Send TOTP').click({ force: true });
    // içerisinde text olarak "If you want" yazan modal açılsın
    cy.wait('@sendUserTOTPRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.wait(500);
  });

  it('should not Test Sender SMS', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Test Sender').trigger('mouseover');
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Sms').click({ force: true });
    cy.wait('@sendUserTestSenederRequest').then(({ response }) => {
      // expect(response.statusCode).to.equal(400); // TODO Check this
    });

    cy.wait(500);
    cy.get('.profile-card-container').click();
    cy.wait(500);
  });

  it('should be disabled Test Sender Mirket OTP', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Test Sender').trigger('mouseover');
    cy.wait(500);

    // içerisinde text olarak Mirket OTP yazan buton disabled olmalı
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Mirket OTP').parent().should('be.disabled');
    cy.wait(500);
    cy.get('.profile-card-container').click();
    cy.wait(500);
  });

  it('should be disabled Test Sender Mirket Push Notification', () => {
    cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
    cy.wait(500);
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Test Sender').trigger('mouseover');
    cy.wait(500);

    // Mirket Push butonu disabled olmalı
    cy.get('.ant-dropdown-menu-title-content').contains('span', 'Mirket Push').parent().should('be.disabled');

    cy.wait(500);
    cy.get('.profile-card-container').click();
    cy.wait(500);
  });

  // it('should Delete Selenium Test User ', () => {
  //   cy.get('.ant-tabs-extra-content').contains('span', 'Actions').click();
  //   cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
  //   cy.get('.ant-modal').contains('span', 'If you want').should('exist');
  //   cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
  //   cy.wait('@deleteUserRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(204);
  //   });

  //   cy.get('.ant-menu-title-content').contains('Dashboard').click();
  //   cy.wait('@dashboardDetailRequest').then(({ response }) => {
  //     expect(response.statusCode).to.equal(200);
  //   });
  //   cy.wait(500);
  // });

  it('should export all users ', () => {
    cy.get('.ant-breadcrumb-link').contains('a', 'User List').click();
    cy.wait('@userListRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.content-container-inner').should('exist');
    cy.wait(500);
    cy.get('.anticon-export').should('exist').click();

    cy.wait('@exportAllUsersRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    // İndirilen dosyanın varlığını kontrol etmek isterseniz
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.readFile(`${downloadsFolder}/user-list.xls`).should('exist');
    cy.wait(500);
  });

  it('return dashboard page', () => {
    cy.get('.ant-menu-title-content').contains('Dashboard').click();
    cy.wait('@dashboardDetailRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
