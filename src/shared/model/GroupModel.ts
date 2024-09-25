import { IAttributeProfile } from 'app/shared/model/AttributeProfile.model';
import { ITenant } from 'app/shared/model/tenant.model';

export interface IGroup {
  id?: number;
  accountId?: string | null;
  uid?: string;
  name?: string | null;
  description?: string | null;
  totalParticipant?: number | null;
  version?: string | null;
  gatewayType?: number | null;
  gatewayStatus?: number | null;
  ldapType?: number | null;
  samName?: string | null;
  domainName?: string | null;
  isLdapSecure?: boolean | null;
  ldapIp?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  groupType?: number | null;
  ldapProfile?: IAttributeProfile | null;
  participantGroupType?: EGroupType;
}

export interface IGroupByParticipantModel {
  participantId: string;
  isExcept: boolean;
  searchtext: string;
}
export interface IGroupByRuleModel {
  ruleId: string;
  isExcept: boolean;
  searchtext: string;
}
export enum EGroupType {
  LOCAL,
  LDAP,
}
export enum GatewayTypeInt {
  LDAP,
  RADIUS,
}
export interface IEditGroupUsersRequest extends IEditGroupUsers {
  groupId: string;
}

export interface IEditGroupUsers {
  accountId: string;
  participants: {
    participantId: string;
    action: TransferActions;
  }[];
  isAllParticipantsIncluded?: boolean;
}

export interface IEditGroupExternalSourceRequest extends IEditGroupExternalSource {
  groupId: string;
}

export interface IEditGroupExternalSource {
  accountId: string;
  externalSources: {
    externalSourceId: string;
    action: TransferActions;
  }[];
}

export enum TransferActions {
  ADD,
  REMOVE,
}

export const defaultValue: Readonly<IGroup> = {
  isLdapSecure: false,
  isActive: false,
  isDeleted: false,
};
