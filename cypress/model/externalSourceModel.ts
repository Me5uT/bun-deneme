import { IAttributeProfile } from './AttributeProfile.model';
import { LdapTypeInt } from './gateway.model';
import { EGroupType } from './GroupModel';
import { IParticipant } from './participant.model';
import { ITenant } from './tenant.model';

export interface IExternalSourceReportModel {
  createdDate: string;
  createdOn: number;
  externalSource: IExternalSourceModel;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  message: string;
  participant: IParticipant;
  status: ExternalSourceReportStatus;
  tenant: ITenant;
  uid: string;
  updatedDate: string;
  updatedOn: number;
  username: string;
}
export enum ExternalSourceReportStatus {
  OK = 'OK',
  FAIL = 'FAIL',
}
export interface IExternalSourceModel {
  uid: string;
  name: string;
  description: string;
  gatewayName: string;
  gatewayUid: string;
  domainName: string;
  ldapGroupDn: string;
  attribute: IAttributeProfile;
  samValue: string;
  message: string;
  type: LdapTypeInt;
  syncPeriod: ESyncPeriod;
  lastSyncStatus: ESyncStatus;
  isActive: boolean;
  isSyncManuel: boolean;
  groupType?: EGroupType;
  sam?: string;
  totalParticipant?: number | null;
  validParticipant?: number | null;
}

export interface IExternalSourceEditModel {
  uid: string;
  name: string;
  description: string;
  ldapGroupDn: string;
  isSyncManuel: boolean;
  syncPeriod: ESyncPeriod;
  gatewayUid: string;
  domainName: string;
  attribute: string;
  samValue: string;
  type: LdapTypeInt;
}

export interface IAddRequestExternalSourceModel {
  accountId: string;
  name: string;
  description: string;
  ldapGroupDn: string;
  isSyncManuel: boolean;
  syncPeriod: ESyncPeriod; //
  gatewayUid: string;
  domainName: string;
  attributeUid: string;
  samValue: string;
  type: LdapTypeInt;
}
export interface IExternalSourceCheckGroupDN {
  accountId: string;
  ldapGroupDn: string;
  externalSourceId: string | null;
}
export enum ESyncPeriod {
  ONDEMAND,
  ONEHOURS,
  SIXHOURS,
  TWENTYFOURHOURS,
}

export interface IExternalSourceByGroupModel {
  groupId: string;
  isExcept: boolean;
  searchtext: string;
}
export enum ESyncPeriodStr {
  ONDEMAND = 'On Demand',
  ONEHOURS = '1 Hour',
  SIXHOURS = '6 Hours',
  TWENTYFOURHOURS = '24 Hours',
}

export enum ESyncStatus {
  SUCCESS,
  FAILED,
  AUTO_SYNC_NOT_STARTED,
  AUTO_SYNC_STARTED,
  SYNCING,
}

export enum ESyncStatusStr {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  AUTO_SYNC_NOT_STARTED = 'AUTO SYNC NOT STARTED',
  AUTO_SYNC_STARTED = 'AUTO SYNC STARTED',
  SYNCING = 'SYNCING',
}
