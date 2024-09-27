import { AdminProfileInt, AdminTypeInt } from './AdminModel';
import { LicenceStatusInt, LicenceTypeInt, TenantStatusInt, TenantTypeInt } from './tenant.model';

export interface ILocalStorageTenantModel {
  loginPath?: string | null;
  fullname?: string | null;
  email?: string | null;
  tenantName?: string | null;
  alias: string;
  domain: string;
  accountId: string;
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
  isReadOnly?: boolean | null;
  adminProfile?: AdminProfileInt | null;
  adminType?: AdminTypeInt | null;
  mentis?: boolean | null;
}

export interface ILocalStoragePortalModel {
  tenantName?: string | null;
  loginPath?: string | null;
  fullname?: string | null;
  email?: string | null;
  inPortal: boolean | null;
  portal: string | null;
  domain: string | null;
  portalId: string | null;
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
