/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import "cypress-wait-until";

// authenticationToken'i localStorage'dan alıp kaydedin

Cypress.Commands.add("authenticatedRequest", (data) => {
  const token = localStorage.getItem(Cypress.env("jwtStorageName")) ?? "";
  let bearerToken = "";

  if (token) {
    try {
      bearerToken = JSON.parse(token);
    } catch (e) {
      console.error("Token is not valid JSON:", e);
    }
  }

  return cy.request({
    ...data,

    headers: {
      ...data.headers,
      Authorization: `Bearer ${bearerToken}`,
      "Accept-Language": "en-US",
    },
  });
});

Cypress.Commands.add("login", (username: string, password: string) => {
  const storedToken = localStorage.getItem(Cypress.env("jwtStorageName"));

  if (storedToken) {
    // Token mevcutsa, login adımlarını atla ve doğrulama yap
    cy.authenticatedRequest({ url: "/api/account" })
      .its("status")
      .should("eq", 200);
  } else {
    cy.visit("/");
    cy.get('[id="username"]').type(username);
    cy.get('[id="password"]').type(password);
    cy.get('[id="keepMeSignedIn"]').check();
    cy.get(".login-continue").click();
    cy.get("button[type='submit']").click();

    cy.session(
      [username, password],
      () => {
        cy.request({
          method: "GET",
          url: "/api/account",
          failOnStatusCode: false,
        });
        cy.authenticatedRequest({
          method: "POST",
          body: { username, password },
          url: Cypress.env("authenticationUrl"),
        }).then(({ body: { id_token } }) => {
          localStorage.setItem(
            Cypress.env("jwtStorageName"),
            JSON.stringify(id_token)
          );
        });
      },
      {
        validate() {
          cy.authenticatedRequest({ url: "/api/account" })
            .its("status")
            .should("eq", 200);
        },
      }
    );
  }
  cy.window().then((win) => {
    cy.waitUntil(() => win.localStorage.getItem("alias")).then(() => {
      const aliasObj = win.localStorage.getItem("alias");

      if (aliasObj) {
        const parsedObj = JSON.parse(aliasObj);
        const { accountId, alias } = parsedObj;

        // Tüm nesneyi baseObj olarak kaydedin
        cy.wrap(parsedObj).as("baseObj");

        // accountId ve alias değerlerini ayrı ayrı kaydedin
        cy.wrap(accountId).as("accountId");
        cy.wrap(alias).as("alias");
      }
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      authenticatedRequest(data): Cypress.Chainable;
      login(username: string, password: string): Cypress.Chainable;
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {};
