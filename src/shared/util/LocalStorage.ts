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

export const enum StorageType {
  SESSION,
  LOCAL,
}

/**
 * Get either localStorage or sessionStorage
 * @param type storage type
 */
export const getStorage = (type: StorageType): Storage => {
  if (type === StorageType.SESSION) {
    return window.sessionStorage;
  }
  return window.localStorage;
};

/**
 * Set an item into storage
 * @param type storage type
 * @param key key to set
 * @param value value to set
 */
const setItem = (type: StorageType) => (key: string, value: any) => {
  getStorage(type).setItem(key, JSON.stringify(value));
};

/**
 * Get an item from storage
 * @param type storage type
 * @param key key to get
 * @param defaultVal value to return if key doesnt exist
 */
const getItem = (type: StorageType) => (key: string, defaultVal?: any) => {
  const val = getStorage(type).getItem(key);
  if (!val || val === "undefined") return defaultVal;
  try {
    return JSON.parse(val);
  } catch (e) {
    return val + e;
  }
};

/**
 * Remove item from storage
 * @param type storage type
 * @param key key to remove
 */
const removeItem = (type: StorageType) => (key: string) => {
  getStorage(type).removeItem(key);
};

export type getItemType = (key: string, defaultVal?: any) => any;
export type setItemType = (key: string, value: any) => void;
export type removeItemType = (key: string) => void;

export interface IStorageAPI {
  get: getItemType;
  set: setItemType;
  remove: removeItemType;
}

export interface IStorageService {
  session: IStorageAPI;
  local: IStorageAPI;
}

export const Storage: IStorageService = {
  session: {
    get: getItem(StorageType.SESSION),
    set: setItem(StorageType.SESSION),
    remove: removeItem(StorageType.SESSION),
  },
  local: {
    get: getItem(StorageType.LOCAL),
    set: setItem(StorageType.LOCAL),
    remove: removeItem(StorageType.LOCAL),
  },
};
