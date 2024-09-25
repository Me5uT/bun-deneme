import { ITenant } from "./tenant.model";

export interface IAttributeProfile {
  uid: string;
  accountId?: string;
  name: string | null;
  description: string | null;
  phonePattern?: string | null;
  phonePatternReplacer?: string | null;
  phoneAttribute?: string | null;
  mailAttribute?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  statusCondition: AttributeProfileStatusCondition;
}

export interface ILdapProfileUpdateRequest {
  uid: string;
  accountId?: string;
  name: string;
  description: string;
  phonePattern: string;
  phonePatternReplacer: string;
  phoneAttribute: string;
  mailAttribute: string;
}

export enum AttributeProfileStatusCondition {
  ENABLE_ACCOUNTS, // default
  ALL_ACCOUNTS,
}

export const defaultValue: Partial<IAttributeProfile> = {
  isActive: false,
  isDeleted: false,
};
