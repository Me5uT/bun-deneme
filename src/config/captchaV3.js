import { SITE_KEY } from "./constants";

export const getRecaptchaToken = async () => {
  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then((token) => {
          resolve(token);
        }, reject);
    });
  });
};
