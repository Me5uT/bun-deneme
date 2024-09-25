import { setLocale } from "app/shared/reducers/locale";
import { Storage } from "app/shared/util/LocalStorage";

// TranslatorContext.setDefaultLocale("en");
// TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const languages: any = {
  "ar-ly": { name: "العربية", rtl: true },
  en: { name: "English" },
  ru: { name: "Русский" },
  tr: { name: "Türkçe" },
  // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
};

export const locales = Object.keys(languages).sort();

export const isRTL = (lang: string): boolean =>
  languages[lang] && languages[lang].rtl;

export const registerLocale = (store) => {
  store.dispatch(setLocale(Storage.session.get("locale", "en")));
};
