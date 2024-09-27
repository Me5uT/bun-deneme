import { VerificationStatusInt } from './tenant.model';

export interface IAdminModel {
  id: number;
  uid: string;
  accountId?: string;
  login: string;
  adminProfile: number;
  adminType: number;
  email: string;
  firstName: string;
  imageUrl?: string | null;
  isActive: boolean;
  langKey: string;
  lastLoginIp?: string | null;
  lastName: string;

  verificationStatus: VerificationStatusInt;
}
export interface IAddAdminRequest {
  accountId: string;
  adminId: string;
  firstName: string;
  lastName: string;
  adminType: AdminTypeInt;
  adminProfile: AdminProfileInt;
}
export interface IUpdateAdminRequest {
  adminId: string;
  accountId: string;
  displayName: string;
  adminType: AdminTypeInt;
}
export enum AdminType {
  OWNER = 'Owner',
  MASTER_ADMIN = 'Master Admin',
  ACCOUNT_ADMIN = 'Account Admin',
}

export enum AdminTypeInt {
  OWNER,
  MASTER_ADMIN,
  ACCOUNT_ADMIN,
}
export enum AdminProfile {
  FullControl = 'Full Control',
  ReadOnly = 'Read Only',
}
export enum AdminProfileInt {
  FullControl,
  ReadOnly,
}
