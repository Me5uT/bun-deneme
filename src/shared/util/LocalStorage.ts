import { ILocalStoragePortalModel } from "../model/LocalStorage.model";

export const AUTH_TOKEN_KEY = "authenticationToken";
export const SYSTEM_SETTINGS_KEY = "systemSettings";
export const PROVIDERS = "providers";
export const KEEP_ME_SIGNED_IN = "keepMeSignedIn";
export const ALIAS = "alias";
export const PORTAL = "portal";
export const RULE_ATTRIBUTE_TYPES = "ruleAttributeTypes";
export const PHONE_COUNTRY_CODE = "phoneCountryCode";
export const setPortalToLocal = async ({
  portal,
  portalId,
  tenantType,
  domain,
  inPortal,
  csa,
  csaCount,
  csaUsage,
  expireDate,
  licenceCount,
  licenceStatus,
  licenceType,
  licenceUsage,
  email,
  fullname,
  loginPath,
  tenantStatus,
  tenantName,
  mentis,
  remoteSupport,
}: ILocalStoragePortalModel) => {
  const keepMeSignedIn = await Storage.local.get(KEEP_ME_SIGNED_IN);

  if (!keepMeSignedIn) {
    const jwt = await Storage.session.get(AUTH_TOKEN_KEY);
    Storage.local.set(AUTH_TOKEN_KEY, jwt);
  }

  // Mevcut portal verilerini al
  const existingPortals: ILocalStoragePortalModel[] =
    Storage.local.get(PORTAL) || [];

  // Yeni portal verisini hazırla
  const newPortalData: ILocalStoragePortalModel = {
    portal,
    portalId,
    tenantType,
    domain,
    inPortal,
    csa,
    csaCount,
    csaUsage,
    expireDate,
    licenceCount,
    licenceStatus,
    licenceType,
    licenceUsage,
    email,
    fullname,
    loginPath,
    tenantStatus,
    tenantName,
    remoteSupport,
    mentis,
  };

  const uniquePortals = existingPortals.filter(
    (p) => p.portalId !== portalId && p.portal !== portal
  );
  // Yeni veriyi mevcut verilere ekle
  const updatedPortals = [...uniquePortals, newPortalData];

  // Güncellenmiş verileri LocalStorage'a kaydet
  Storage.local.set(PORTAL, updatedPortals);
};

export const setPhoneCountryToLocal = (countryCode: string) => {
  // Güncellenmiş verileri LocalStorage'a kaydet
  Storage.local.set(PHONE_COUNTRY_CODE, countryCode);
};

export const getPhoneCountryFromLocal = () => {
  return Storage.local.get(PHONE_COUNTRY_CODE) || "gb";
};

export class Storage {
  static local = {
    get: (key: string) => {
      return localStorage.getItem(key);
    },
    set: (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    remove: (key: string) => {
      localStorage.removeItem(key);
    },
  };

  static session = {
    get: (key: string) => {
      return sessionStorage.getItem(key);
    },
    set: (key: string, value: string) => {
      sessionStorage.setItem(key, value);
    },
    remove: (key: string) => {
      sessionStorage.removeItem(key);
    },
  };
}
