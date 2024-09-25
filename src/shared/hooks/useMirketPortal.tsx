import { Storage } from "app/shared/util/LocalStorage";
import {
  ILocalStoragePortalModel,
  ILocalStorageTenantModel,
} from "../model/LocalStorage.model";
import {
  LicenceStatusInt,
  LicenceTypeInt,
  TenantStatusInt,
  TenantTypeInt,
} from "../model/tenant.model";
import { ALIAS, PORTAL } from "../util/LocalStorage";
import { AdminProfileInt, AdminTypeInt } from "../model/AdminModel";
import React from "react";

export interface IBasePathReturnModel {
  fullname?: string | null;
  email?: string | null;
  tenantName?: string | null;
  basePath: string;
  loginPath?: string | null;
  domain: string;
  accountId?: string | null;
  ownerAdminId?: string | null;
  tenantType?: TenantTypeInt | null;
  tenantStatus?: TenantStatusInt | null;
  expireDate?: Date | number | string | null;
  licenceType?: LicenceTypeInt | null;
  licenceStatus?: LicenceStatusInt | null;
  licenceCount?: number | null;
  licenceUsage?: number | null;
  csa?: boolean | null;
  csaCount?: number | null;
  csaUsage?: number | null;
  remoteSupport?: boolean | null;
  adminType?: AdminTypeInt | null;
  adminProfile?: AdminProfileInt | null;
  isReadOnly?: boolean | null;
  mentis?: boolean | null;
}

const useMirketPortal = (): [IBasePathReturnModel] => {
  // localdeki giriş yapan kullanıcı verileri
  const alias: ILocalStorageTenantModel = React.useMemo(
    () =>
      Storage.local.get(ALIAS) || {
        alias: "",
        id: "",
        tenantType: "",
        domain: "",
      },
    [location.pathname]
  );

  // localdeki portal verileri
  const portals: ILocalStoragePortalModel[] = React.useMemo(
    () => Storage.local.get(PORTAL) || [],
    [location.pathname]
  );

  // location.pathname'i içeren portal objesini bul
  const matchingPortal: ILocalStoragePortalModel | undefined = portals?.find(
    (p) => location.pathname.split("/")[1] === p.portal
  );

  const baseObj = React.useMemo(() => {
    if (location.pathname !== "/" && matchingPortal !== undefined) {
      return {
        basePath: matchingPortal?.portal,
        accountId: matchingPortal?.portalId,
        tenantType: matchingPortal?.tenantType,
        domain: matchingPortal?.domain,
        tenantStatus: matchingPortal?.tenantStatus,
        expireDate: matchingPortal?.expireDate,
        licenceType: matchingPortal?.licenceType,
        licenceStatus: matchingPortal?.licenceStatus,
        licenceCount: matchingPortal?.licenceCount,
        licenceUsage: matchingPortal?.licenceUsage,
        tenantName: matchingPortal?.tenantName,
        remoteSupport: matchingPortal?.remoteSupport,
        mentis: matchingPortal?.mentis,

        adminType: alias?.adminType,
        adminProfile: alias?.adminProfile,
        isReadOnly: alias?.adminProfile === AdminProfileInt.ReadOnly,

        loginPath: alias?.alias,
        fullname: alias?.fullname,
        email: alias?.email,
        ownerAdminId: alias?.ownerAdminId,
      };
    }
    return {
      basePath: alias?.alias,
      accountId: alias?.accountId,
      ownerAdminId: alias?.ownerAdminId,
      tenantType: alias?.tenantType,
      domain: alias?.domain,
      tenantStatus: alias?.tenantStatus,
      expireDate: alias?.expireDate,
      licenceType: alias?.licenceType,
      licenceStatus: alias?.licenceStatus,
      licenceCount: alias?.licenceCount,
      licenceUsage: alias?.licenceUsage,
      tenantName: alias?.tenantName,
      fullname: alias?.fullname,
      email: alias?.email,
      loginPath: alias?.alias,
      mentis: alias?.mentis,

      remoteSupport: alias?.remoteSupport,
      isReadOnly: alias?.adminProfile === AdminProfileInt.ReadOnly,
      adminProfile: alias?.adminProfile,
      adminType: alias?.adminType,
    };
  }, [location.pathname]);
  return [baseObj];
};

export default useMirketPortal;
