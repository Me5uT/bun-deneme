import { TransferActions } from './GroupModel';

export interface IRadiusRuleListModel {
  description: string;
  id: number;
  isAccept: boolean;
  isActive: boolean;
  isAllParticipantIncluded: boolean;
  isParticipantRule: boolean;
  name: string;
  participantGroupList: null | any[];
  participantList: null | any[];
  providerId: null | string;
  providerName: null | string;
  radiusClientIds: string;
  radiusClientList: null | any[];
  ruleOrder: number;
  sourceAddressList: string[];
  sourceCountryList: string[];
  tenantId: number;
  uid: string;
}

export interface IRadiusRuleDetailModel {
  attributeNumber: null | number;
  authorizationAttributeType: null | number;

  authorizationValue: null | string;
  description: string;
  id: number;
  isAccept: boolean;
  isActive: boolean;
  isAllParticipantsIncluded: boolean;
  isParticipantRule: boolean;
  name: string;
  otpTimeout: RuleOtpTimeout;
  participantGroupList: null | any[];
  participantList: null | any[];
  prefix: null | string;
  providerId: null | string;
  providerName?: null | string;
  radiusClientIds: any;
  radiusClientList: null | any[];
  scheduleDays: any;
  scheduleEndDateTime: null | string;
  scheduleEndTime: null | string;
  scheduleStartDateTime: null | string;
  scheduleStartTime: null | string;
  scheduleType: RuleScheduleType;

  recurringTimeRange: any;
  onetimeRange: any;
  seperator: null | string;
  sourceAddresses: any;
  sourceCountries: any;
  uid: string;
  vendorCode: null | string;
}

export interface IRadiusRuleAddRequestModel {
  accountId: string;
  name: string;
  description: string;
  radiusClientIds: string;
  sourceAddresses: string;
  sourceCountries: string;
  providerId: string;
  otpTimeout: number;
  authorizationAttributeType: number;
  vendorCode: number;
  attributeNumber: number;
  prefix: string;
  seperator: string;
  authorizationValue: string;
  scheduleType: number;
  scheduleStart: string;
  scheduleEnd: string;
  scheduleDays: string;
  isAccept: boolean;
  isAllParticipantsIncluded: boolean;
  participants: string[];
  participantGroups: string[];
  userOrGroup?: 'Users' | 'Groups';
}

export interface IEditRuleUsersRequest extends IEditRuleUsers {
  ruleId: string;
}

export interface IEditRuleUsers {
  accountId: string;
  isAllParticipantsIncluded?: boolean;
  participants: {
    participantId: string;
    action: TransferActions;
  }[];
}
export interface IEditRuleGroupRequest extends IEditRuleGroups {
  ruleId: string;
}

export interface IEditRuleGroups {
  accountId: string;
  participantGroups: {
    participantGroupId: string;
    action: TransferActions;
  }[];
}
export interface IRadisRuleSortByOrder {
  accountId: string;
  ruleUids: string[];
}

export enum RuleOtpTimeout {
  NOTIMEOUT,
  ONEHOUR,
  EIGHTHOUR,
  TWENTYFOURHOUR,
}

export const RuleOtpTimeoutLabels = {
  0: 'None',
  1: '1 Hour',
  2: '8 Hours',
  3: '24 Hours',
};

export enum RuleScheduleType {
  ALL,
  RECURRING,
  ONETIME,
}
export const scheduleTypeLabels = {
  0: 'All',
  1: 'Recurring',
  2: 'One Time',
};
export enum RadiusRuleAction {
  Accept = 'accept',
  Deny = 'deny',
}
export interface IUpdateStatus {
  ruleUid: string;
  status: boolean;
}
