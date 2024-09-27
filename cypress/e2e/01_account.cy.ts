import { AdminTypeInt } from "../model/AdminModel";
import { TenantTypeInt } from "../model/tenant.model";

describe("Account Test", () => {
  const username = Cypress.env("E2E_USERNAME") ?? "nkarakas@mirketsecurity.com";
  const password = Cypress.env("E2E_PASSWORD") ?? "admin";
  const token = localStorage.getItem(Cypress.env("jwtStorageName")) ?? "";
  let bearerToken = "";

  if (token) {
    try {
      bearerToken = JSON.parse(token);
    } catch (e) {
      console.error("Token is not valid JSON:", e);
    }
  }
  const randomNumber = Math.floor(Math.random() * 100000);
  // wrap edilmiş baseObj değişkeni burada kullanılacak
  let baseObj: any = {};

  before(() => {
    if (!bearerToken) {
      cy.login(username, password);
    }
    cy.get("@baseObj").then((b: any) => {
      cy.log("baseObj: " + b);
      baseObj = b;
    });
  });

  beforeEach(() => {
    // dashboard api
    cy.intercept("GET", "/api/dashboard/detail+(?*|)").as(
      "dashboardDetailRequest"
    );

    // account apis
    cy.intercept("GET", "/api/tenants*", (req) => {
      const filterParams = [
        "name",
        "partnerAccountId",
        "tenantType",
        "tenantStatus",
        "licenceType",
        "licenceStatus",
        "expireDateEnd",
        "expireDateStart",
        "searchtext",
      ];

      const hasFilterParams = filterParams.some((param) =>
        req.url.includes(param)
      );

      if (!hasFilterParams) {
        req.alias = "accountListRequest";
      }
    }); // List  Account

    cy.intercept("GET", "/api/tenants*", (req) => {
      const searchParams = ["searchtext"];

      const hasSearchParams = searchParams.some((param) =>
        req.url.includes(param)
      );

      if (hasSearchParams) {
        req.alias = "searchAccountRequest";
      }
    }); // Search Account

    cy.intercept("GET", "/api/tenants*", (req) => {
      const filterParams = [
        "name",
        "partnerAccountId",
        "tenantType",
        "tenantStatus",
        "licenceType",
        "licenceStatus",
        "expireDateEnd",
        "expireDateStart",
      ];

      const hasFilterParams = filterParams.some((param) =>
        req.url.includes(param)
      );

      if (hasFilterParams) {
        req.alias = "filterAccountRequest";
      }
    }); // Filter Account

    cy.intercept("POST", "/api/tenants").as("createAccountRequest"); // add account
    cy.intercept("GET", "/api/tenants/get-detail-overview+(?*|)").as(
      "accountDetailRequest"
    ); // get account detail
    cy.intercept("POST", "/api/tenants/update-licence").as(
      "updateAccountLicenceRequest"
    ); // update account licence
    cy.intercept("POST", "/api/tenants/resend-verification").as(
      "resendVerificationRequest"
    ); // resend verification mail
    cy.intercept("POST", "/api/tenants/resend-change-password").as(
      "resetPasswordRequest"
    ); // resend verification mail
    cy.intercept("DELETE", "/api/tenants/*").as("deleteAccountRequest"); // delete account
  });

  if (
    baseObj?.tenantType !== TenantTypeInt.ENDUSER ||
    baseObj?.adminType !== AdminTypeInt.ACCOUNT_ADMIN
  ) {
    it("should exist account list page", () => {
      // sidebar'ı aç ve Account'a git
      cy.get(".open-sidebar-icon").click();
      cy.get("#menu-item-accountlist").click();
      cy.get(".content-container-inner").should("exist");
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });

      cy.wait(500);
    });

    // End User Account
    it("should create End User Account", () => {
      cy.contains("span", "Add Account").click();
      cy.get(".ant-modal-body").should("exist");
      cy.contains("span", "End User").click();
      cy.get('input[name="name"]').type(`selenium test account${randomNumber}`);
      cy.get('input[name="ownerFirstName"]').type(
        `selenium owneradmin${randomNumber}`
      );
      cy.get('input[name="ownerLastName"]').type(
        `ownerlastname${randomNumber}`
      );
      cy.get('input[name="ownerMail"]').type(
        `seleniumtest${randomNumber}@${randomNumber}stestownermail.com`
      );
      cy.contains("span", "Next").click();
      cy.get('input[name="licenceCount"]').type("5");
      cy.get('input[name="expireDate"]').click();
      cy.contains("li", "A Month").click();
      cy.get(".ant-switch-handle").click();
      cy.contains("span", "Next").click();
      cy.wait(500);
      cy.contains("span", "Save").click();
      cy.wait("@createAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
      });
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should not create an Account with same account name", () => {
      cy.contains("span", "Add Account").click();
      cy.get(".ant-modal-body").should("exist");
      cy.contains("span", "End User").click();
      cy.get('input[name="name"]').type(`selenium test account${randomNumber}`);
      cy.get('input[name="ownerFirstName"]').type(
        `selenium owneradmin1${randomNumber}`
      );
      cy.get('input[name="ownerLastName"]').type(
        `ownerlastname1${randomNumber}`
      );
      cy.get('input[name="ownerMail"]').type(
        `seleniumtest1${randomNumber}@${randomNumber}stestownermail1.com`
      );
      cy.contains("span", "Next").click();
      cy.get('input[name="licenceCount"]').type("5");
      cy.get('input[name="expireDate"]').click();
      cy.contains("li", "A Month").click();
      cy.get(".ant-switch-handle").click();
      cy.contains("span", "Next").click();
      cy.wait(500);
      cy.contains("span", "Save").click();
      cy.wait("@createAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(400);
      });
      cy.contains("span", "Close").click();

      cy.wait(1000);
    });

    it("should not create an Account with invalid mail (mirketsecurity.com)", () => {
      cy.contains("span", "Add Account").click();
      cy.get(".ant-modal-body").should("exist");
      cy.contains("span", "End User").click();
      cy.get('input[name="name"]').type(
        `selenium test account2${randomNumber}`
      );
      cy.get('input[name="ownerFirstName"]').type(
        `selenium owneradmin2${randomNumber}`
      );
      cy.get('input[name="ownerLastName"]').type(
        `ownerlastname2${randomNumber}`
      );
      cy.get('input[name="ownerMail"]').type(
        `seleniumtest2${randomNumber}@mirketsecurity.com`
      );
      cy.contains("span", "Next").click();
      cy.get('input[name="licenceCount"]').type("5");
      cy.get('input[name="expireDate"]').click();
      cy.contains("li", "A Month").click();
      cy.get(".ant-switch-handle").click();
      cy.contains("span", "Next").click();
      cy.wait(500);
      cy.contains("span", "Save").click();
      cy.wait("@createAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(400);
      });
      cy.contains("span", "Close").click();

      cy.wait(1000);
    });

    // it('should not create an Account with invalid mail (gmail.com)', () => {
    //   cy.contains('span', 'Add Account').click();
    //   cy.get('.ant-modal-body').should('exist');
    //   cy.contains('span', 'End User').click();
    //   cy.get('input[name="name"]').type(`selenium test account3${randomNumber}`);
    //   cy.get('input[name="ownerFirstName"]').type(`selenium owneradmin3${randomNumber}`);
    //   cy.get('input[name="ownerLastName"]').type(`ownerlastname3${randomNumber}`);
    //   cy.get('input[name="ownerMail"]').type(`seleniumtest3${randomNumber}@gmail.com`);
    //   cy.contains('span', 'Next').click();
    //   cy.get('input[name="licenceCount"]').type('5');
    //   cy.get('input[name="expireDate"]').click();
    //   cy.contains('li', 'A Month').click();
    //   cy.get('.ant-switch-handle').click();
    //   cy.contains('span', 'Next').click();
    //   cy.wait(500);
    //   cy.contains('span', 'Save').click();
    //   cy.wait('@createAccountRequest').then(({ response }) => {
    //     expect(response.statusCode).to.equal(400);
    //   });
    //   cy.contains('span', 'Close').click();

    //   cy.wait(1000);
    // });

    it("should search account", () => {
      // Search Account
      cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
      cy.wait("@searchAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.get('input[placeholder="Search..."]').clear();
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.wait(1000);
    });

    it("should not find any account", () => {
      // Search Account
      cy.get('input[placeholder="Search..."]').type(`empty`);
      cy.wait("@searchAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.equal(0);
      });
      cy.get('input[placeholder="Search..."]').clear();
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.wait(1000);
    });

    it("should filter account", () => {
      // Filter Account
      cy.get(".filter-icon-button").click();
      cy.get(".ant-modal-title")
        .contains("div", "Advanced Search")
        .should("exist");
      cy.get('input[placeholder="Account Name"]').type(`${randomNumber}`);
      cy.get("button[type='submit']").click();
      cy.wait("@filterAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.wait(1000);
    });

    it("should edit last created account", () => {
      // Edit Last Created Account
      // class'ı ant-table-tbody olan tbody elementi içerisindeki ilk tr elementi içerisindeki data-icon attribute'u ellipsis-vertical olan elementin hover edilmesi ve Edit butonuna tıklanması
      cy.get(".ant-table-tbody tr:first")
        .find('[data-icon="ellipsis-vertical"]')
        .trigger("mouseover");
      cy.contains("span", "Edit").click();
      // url'in accounts/{uid} olup olmadığını kontrol et
      cy.url().should(
        "match",
        /\/accounts\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      );
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
      cy.get('div[role="tab"]').contains("Settings").click();
      cy.wait(500);
      cy.get('input[id="licenceCount"]').type("{backspace}4");
      cy.get('button[type="submit"]').click();
      cy.wait("@updateAccountLicenceRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should send verification mail", () => {
      // Send Verification Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Resend Verification")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resendVerificationRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should reset password mail", () => {
      // Reset Password Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Set Password")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resetPasswordRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should delete last created account", () => {
      // Delete Last Created Account
      // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').trigger('mouseover');
      // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
      // // içerisinde text olarak "If you want" yazan modal açılsın
      // cy.get('.ant-modal').contains('span', 'If you want').should('exist');
      // // TODO Account Silme aşamasına Code Girme Geldiği zaman burası güncellenecek
      // cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
      // cy.wait('@deleteAccountRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
      // cy.get('.ant-menu-title-content').contains('Dashboard').click();
      // cy.wait('@dashboardDetailRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
    });
    it("should return account list", () => {
      cy.get("#menu-item-accountlist").click();
      cy.get(".content-container-inner").should("exist");
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });

      cy.wait(500);
    });

    // MSSP Account
    it("should create MSSP Account", () => {
      // Add MSSP Account
      cy.contains("span", "Add Account").click();
      cy.get(".ant-modal-body").should("exist");
      cy.get(".ant-radio-group").find("span").contains("MSSP").click();
      cy.get('input[name="name"]').type(
        `selenium mssptest account${randomNumber}`
      );
      cy.get('input[name="ownerFirstName"]').type(
        `selenium msspowneradmin${randomNumber}`
      );
      cy.get('input[name="ownerLastName"]').type(
        `msspownerlastname${randomNumber}`
      );
      cy.get('input[name="ownerMail"]').type(
        `mpseleniumtest${randomNumber}@${randomNumber}mpstestownermail.com`
      );
      cy.contains("span", "Next").click();
      cy.get('input[name="licenceCount"]').type("5");
      cy.get('input[name="expireDate"]').click();
      cy.contains("li", "A Month").click();
      cy.get(".ant-switch-handle").click();
      cy.contains("span", "Next").click();
      cy.wait(500);
      cy.contains("span", "Save").click();
      cy.wait("@createAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
      });
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should search account", () => {
      // Search Account
      cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
      cy.wait("@searchAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.get('input[placeholder="Search..."]').clear();
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(2);
      });
      cy.wait(1000);
    });

    it("should filter account", () => {
      // Filter Account
      cy.get(".filter-icon-button").click();
      cy.get(".ant-modal-title")
        .contains("div", "Advanced Search")
        .should("exist");
      cy.get('input[placeholder="Account Name"]').type(`${randomNumber}`);
      cy.get("button[type='submit']").click();
      cy.wait("@filterAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.wait(1000);
    });

    it("should edit last created account", () => {
      // Edit Last Created Account
      // class'ı ant-table-tbody olan tbody elementi içerisindeki ilk tr elementi içerisindeki data-icon attribute'u ellipsis-vertical olan elementin hover edilmesi ve Edit butonuna tıklanması
      cy.get(".ant-table-tbody tr:first")
        .find('[data-icon="ellipsis-vertical"]')
        .trigger("mouseover");
      cy.contains("span", "Edit").click();
      // url'in accounts/{uid} olup olmadığını kontrol et
      cy.url().should(
        "match",
        /\/accounts\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      );
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
      cy.get('div[role="tab"]').contains("Settings").click();
      cy.wait(500);
      cy.get('input[id="licenceCount"]').type("{backspace}4");
      cy.get('button[type="submit"]').click();
      cy.wait("@updateAccountLicenceRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should send verification mail", () => {
      // Send Verification Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Resend Verification")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resendVerificationRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should reset password mail", () => {
      // Reset Password Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Set Password")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resetPasswordRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should delete last created account", () => {
      // // Delete Last Created Account
      // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').trigger('mouseover');
      // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
      // // içerisinde text olarak "If you want" yazan modal açılsın
      // cy.get('.ant-modal').contains('span', 'If you want').should('exist');
      // // TODO Account Silme aşamasına Code Girme Geldiği zaman burası güncellenecek
      // cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
      // cy.wait('@deleteAccountRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
      // cy.get('.ant-menu-title-content').contains('Dashboard').click();
      // cy.wait('@dashboardDetailRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
    });

    it("should return account list", () => {
      cy.get("#menu-item-accountlist").click();
      cy.get(".content-container-inner").should("exist");
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });

      cy.wait(500);
    });

    // Partner Account
    it("should create Partner Account", () => {
      // Add Partner Account
      cy.contains("span", "Add Account").click();
      cy.get(".ant-modal-body").should("exist");
      cy.get(".ant-radio-group").contains("span", "Partner").click();
      cy.get('input[name="name"]').type(
        `selenium partnertest account${randomNumber}`
      );
      cy.get('input[name="ownerFirstName"]').type(
        `selenium powneradmin${randomNumber}`
      );
      cy.get('input[name="ownerLastName"]').type(
        `pownerlastname${randomNumber}`
      );
      cy.get('input[name="ownerMail"]').type(
        `seleniumptest${randomNumber}@${randomNumber}pstestownermail.com`
      );
      cy.contains("span", "Next").click();
      cy.get('input[name="licenceCount"]').type("5");
      cy.get('input[name="expireDate"]').click();
      cy.contains("li", "A Month").click();
      cy.get(".ant-switch-handle").click();
      cy.contains("span", "Next").click();
      cy.wait(500);
      cy.contains("span", "Save").click();
      cy.wait("@createAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
      });
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should search account", () => {
      // Search Account
      cy.get('input[placeholder="Search..."]').type(`${randomNumber}`);
      cy.wait("@searchAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.get('input[placeholder="Search..."]').clear();
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(2);
      });
      cy.wait(1000);
    });

    it("should filter account", () => {
      // Filter Account
      cy.get(".filter-icon-button").click();
      cy.get(".ant-modal-title")
        .contains("div", "Advanced Search")
        .should("exist");
      cy.get('input[placeholder="Account Name"]').type(`${randomNumber}`);
      cy.get("button[type='submit']").click();
      cy.wait("@filterAccountRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
        expect(response?.body?.resultList?.length).to.be.greaterThan(0);
      });
      cy.wait(1000);
    });

    it("should edit last created account", () => {
      // Edit Last Created Account
      // class'ı ant-table-tbody olan tbody elementi içerisindeki ilk tr elementi içerisindeki data-icon attribute'u ellipsis-vertical olan elementin hover edilmesi ve Edit butonuna tıklanması
      cy.get(".ant-table-tbody tr:first")
        .find('[data-icon="ellipsis-vertical"]')
        .trigger("mouseover");
      cy.contains("span", "Edit").click();
      // url'in accounts/{uid} olup olmadığını kontrol et
      cy.url().should(
        "match",
        /\/accounts\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      );
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      // role="tab" olan ve içerisinde text olarak Settings yazan div elementine tıkla
      cy.get('div[role="tab"]').contains("Settings").click();
      cy.wait(500);
      cy.get('input[id="licenceCount"]').type("{backspace}4");
      cy.get('button[type="submit"]').click();
      cy.wait("@updateAccountLicenceRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait("@accountDetailRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should send verification mail", () => {
      // Send Verification Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Resend Verification")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resendVerificationRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should reset password mail", () => {
      // Reset Password Mail
      cy.get(".ant-tabs-extra-content")
        .contains("span", "Actions")
        .trigger("mouseover");
      cy.get(".ant-dropdown-menu-title-content")
        .contains("span", "Set Password")
        .click();
      // içerisinde text olarak "If you want" yazan modal açılsın
      cy.get(".ant-modal").contains("span", "If you want").should("exist");
      cy.get(".ant-modal-footer").contains("span", "OK").click();
      cy.wait("@resetPasswordRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.wait(1000);
    });

    it("should delete last created account", () => {
      // // Delete Last Created Account
      // cy.get('.ant-tabs-extra-content').contains('span', 'Actions').trigger('mouseover');
      // cy.get('.ant-dropdown-menu-title-content').contains('span', 'Delete').click();
      // // içerisinde text olarak "If you want" yazan modal açılsın
      // cy.get('.ant-modal').contains('span', 'If you want').should('exist');
      // // TODO Account Silme aşamasına Code Girme Geldiği zaman burası güncellenecek
      // cy.get('.ant-modal-footer').contains('span', 'DELETE').click();
      // cy.wait('@deleteAccountRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
      // cy.get('.ant-menu-title-content').contains('Dashboard').click();
      // cy.wait('@dashboardDetailRequest').then(({ response }) => {
      //   expect(response.statusCode).to.equal(500);
      // });
    });

    it("should return account list", () => {
      cy.get("#menu-item-accountlist").click();
      cy.get(".content-container-inner").should("exist");
      cy.wait("@accountListRequest").then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });

      cy.wait(500);
    });
  } else {
    it("should not create any account", () => {
      cy.log("This is a end user account, so it should not create any account");
    });
  }
});
