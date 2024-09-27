import { IVersion } from "./version.model";
import { ILicenceHistory } from "./licence-history.model";
export const defaultValue: Readonly<ITenant | ITenantDetail> = {
  isSupportActive: false,
  isActive: false,
  isDeleted: false,
};

export interface ITenant {
  id?: number;
  uid?: string;
  parentId?: string | null;
  partnerId?: string | null;
  name?: string | null;
  alias?: string | null;
  tenantType?: null | TenantTypeInt;
  tenantStatus?: null | TenantStatusInt;
  domain?: string | null;
  isSupportActive?: boolean;
  licenceStatus?: null | LicenceStatusInt;
  licenceType?: null | LicenceTypeInt;
  msspName?: string | null;
  ownerDisplayName?: string | null;
  ownerMail?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;
  expireDate?: Date | number | string | null;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
  version?: IVersion | number | string | null;
  totalUser?: number | null;
  usedTotalUser?: number | null;
  isCsaActive?: boolean | null;
  csaAmount?: number | null;
  usedCsaAmount?: number | null;
  partnerName?: string | null;
  mentis?: boolean;
}

export interface ITenantDetail {
  licenceHistory: ILicenceHistory;
  ownerAdmin: IAdminModel;
  tenant: ITenant;
}

export interface IAdminModel {
  id: number;
  uid: string;
  login: string;
  activated: boolean;
  adminProfile: number;
  adminType: number;
  authorities: string[];
  changePasswordDate?: string | null;
  changePasswordToken?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  email: string;
  firstName: string;
  imageUrl?: string | null;
  isActive: boolean;
  isChangePassword?: boolean | null;
  isDeleted: boolean;
  langKey: string;
  lastLoginIp?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | null;
  lastName: string;
  tenant: ITenant;
  verificationStatus: VerificationStatusInt;
}

export interface IUpdateStatus {
  accountId: string;
  status: boolean;
}
export interface IUpdateAccount {
  accountId: string;
  licenceType: LicenceTypeInt;
  licenceCount: number;
  expireDate: number;
  partnerId: string;
}

export interface IUpdateAddon {
  accountId: string;
  isCsaActive: boolean;
  csaAmount: number;
}
export enum TenantTypeInt {
  ENDUSER,
  MSSP,
  MIRKET,
  PARTNER,
}

export enum TenantStatusInt {
  Active,
  Passive,
  Pending,
}
export enum LicenceTypeInt {
  Demo,
  MFA,
  SSO,
}
export const LicenceType = {
  Demo: "Demo",
  MFA: "MFA",
  SSO: "MFA + SSO",
};
export enum LicenceStatusInt {
  Active,
  Expired,
  Soon,
  Deleted,
}
export enum VerificationStatusInt {
  Verified,
  Pending,
  Failed,
  Manuel,
}

export enum StatusInt {
  Active,
  Passive,
  Pending,
}
