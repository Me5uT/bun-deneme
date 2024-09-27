import { defineConfig } from "cypress";

const devConfig = {
  video: false,
  fixturesFolder: "cypress/fixtures",
  screenshotsFolder: "dist/cypress/screenshots",
  downloadsFolder: "dist/cypress/downloads",
  videosFolder: "dist/cypress/videos",
  chromeWebSecurity: true,
  viewportWidth: 1200,
  viewportHeight: 720,
  // retries: 2,
  scrollBehavior: "center",
  env: {
    E2E_USERNAME: "nkarakas@mirketsecurity.com",
    E2E_PASSWORD: "admin",
    authenticationUrl: "/api/authenticate",
    jwtStorageName: "authenticationToken",
    baseObjectStorageName: "alias",
  },
  e2e: {
    testIsolation: false,
    baseUrl: "http://localhost:9000/",
    specPattern: "cypress/e2e/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    experimentalRunAllSpecs: true,
  },
};
const prodConfig = {
  video: false,
  screenshotOnRunFailure: false,
  chromeWebSecurity: true,
  viewportWidth: 1200,
  viewportHeight: 720,
  scrollBehavior: "center",
  env: {
    E2E_USERNAME: "lfqycryzcikwbcovbjixaijcy@mirketsecurity.com",
    E2E_PASSWORD: 'c6{wtygL<EhANQ`k3mvD29cMP>*PWD12Rgn4;|+1^|"#+Jv8+',
    authenticationUrl: "/api/authenticate",
    jwtStorageName: "authenticationToken",
    baseObjectStorageName: "alias",
  },
  e2e: {
    testIsolation: false,
    baseUrl: "https://localhost:443/",
    specPattern: "cypress/e2e/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    experimentalRunAllSpecs: true,
  },
};

export default defineConfig(devConfig);
