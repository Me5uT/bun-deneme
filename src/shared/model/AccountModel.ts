import { AdminProfileInt, AdminTypeInt } from './AdminModel';
import { ITenant, VerificationStatusInt } from './tenant.model';

export interface IAccountModelTemp {
  activated: boolean;
  authorities: ['ROLE_USER', 'ROLE_ADMIN'];
  createdBy: string;
  createdDate: number | null;
  email: string;
  firstName: string;
  id: number;
  imageUrl: string;
  langKey: string;
  lastModifiedBy: string;
  lastModifiedDate: number | null;
  lastName: string;
  login: string;
  tenant: ITenant | null;
  adminProfile: AdminProfileInt;
  adminType: AdminTypeInt;
  changePasswordDate: null | number | string;
  changePasswordToken: null | string;
  isActive: boolean;
  isChangePassword: null | boolean;
  isDeleted: boolean;
  lastLoginIp: string;
  uid: string;
  verificationStatus: VerificationStatusInt;
}

export interface ISystemSettings {
  id: number;
  uid: string;
  isActive: boolean;
  isDeleted: boolean;
  createdOn?: string | number | null;
  createdDate: string;
  updatedOn?: string | null;
  updatedDate?: string | number | null;
  parentKey: string;
  key: string;
  value: string;
  valueType: number;
  isSecret: boolean;
}
